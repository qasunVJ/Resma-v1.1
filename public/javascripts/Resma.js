var Table = {
    tableNo : 1,
    isSettingsOn : false,

    setSettingsState : function () {
        this.isSettingsOn = true;
    },

    addNewTable : function () {
        $(".tables-wrapper ul").append('' +
            '<li class="table-holder ui-state-default">' +
            '<span class="number">' + ("0" + this.tableNo).slice(-2) +'</span>' +
            '<a href="#"><img src="/images/free.svg"></a></li><span class="table-empty ui-state-default"></span>');

        this.tableNo++;
    },

    removeTable: function () {
        $(".tables-wrapper ul span.table-empty").last().remove();
        $(".tables-wrapper ul li.table-holder").last().remove();

        if(this.tableNo > 1)
            this.tableNo--;
        if(this.tableNo == 1)
            this.tableNo=1;
    },

    saveTableView: function (tableNo){
        var tableViewSettings = document.getElementById("tables-wrapper").innerHTML.toString();

        $.ajax({
            url: '/managers/table-update',
            data: {tableView: tableViewSettings, tableNo: tableNo},
            type: 'POST',
            success: function () {

            }
        });
    }
};


$(document).ready(function () {
    $(".close-modal").click(function() {
        window.location.reload();
    });

    $("#sortable").sortable();
    $("#sortable").disableSelection();

    //Add new tables
    $('[data-id="add-tables"]').click(function () {
        Table.addNewTable();
    });

    //Remove tables
    $('[data-id="remove-table"]').click(function () {
        Table.removeTable();
    });

    //Fires an ajax call to the SERVER to get TABLE VIEW details
    $.get("/managers/tableview", function(tableView){
        $tableNumber = tableView.tableNum;
        Table.tableNo = $tableNumber;
        $tableViewMarkup = $(tableView.tableViewMarkup);

        $orders = $(tableView.orders);
        $($tableViewMarkup).prependTo('.tables-wrapper');

        if(Table.isSettingsOn==false){
            for(var i=0;i<$orders.length;i++){
                $order = $orders[i];
                for(var j=1;j<=Table.tableNo;j++){
                    if(j == $order.table_no){
                        if( $order.order_state != 'finished'){
                            $newSRC = '/images/' + $order.order_state + '.svg';
                            $label = $order.waiter_name.split(" ")[0];
                            $('ul#sortable li:nth-of-type('+j+') a img').attr('src', $newSRC);
                            $('ul#sortable li:nth-of-type('+j+') a img').css({
                                'box-shadow' : '3px 4px 10px #464646',
                                'border-radius' : '50%',
                                'opacity': 1
                            });
                            $('<span class="table-waiter"><img src="/images/uploads/'+$order.waiter_pic+'" alt="" class="img-responsive"/><label class="table-label">'+$label+'</label></span>').appendTo('ul#sortable li:nth-of-type('+j+')');
                        }
                    }
                }
            }
        }
    });

    //SAVE updated table view
    $('[data-id="save-table-settings"]').click(function () {
        Table.saveTableView(Table.tableNo);
    });

    //Settings
    $('[data-id="menuitem-settings"]').click(function () {
        Table.setSettingsState();
    });

    $isOpen = false;
    $('.chat-min').click(function () {
        if($isOpen){
            $('.chat-wrapper').animate({
                top:'-35px'
            });
            $('#future').animate({
                height:'0'
            });
            $('.chat-wrapper #form').hide();
            $('#chat-min-ico').removeClass('glyphicon-minus').addClass('glyphicon-plus');
            $isOpen = false;
        }else if($isOpen == false){
            $('.chat-wrapper').animate({
                top:'-285px'
            });
            $('#future').animate({
                height:'200px'
            });
            $('.chat-wrapper #form').show();
            $('#chat-min-ico').removeClass('glyphicon-plus').addClass('glyphicon-minus');
            $isOpen = true;
        }

    });


    setInterval(function () {
        $.get("/resma/ordercount", function (orderCountInfo) {
            $online = orderCountInfo.orderCountOnline;
            $onsite = orderCountInfo.orderCountOnsite;
            $delivered = orderCountInfo.orderCountDelivered;

            $currOnline = $("#order-count-online").html();
            $currOnsite = $("#order-count-onsite").html();
            $currDelivered = $("#order-count-delivered").html();

            if($online > parseInt($currOnline)){
                $('#order-count-online').addClass('new-order-indicator');
                $('#online-icon').addClass('new-order-indicator');
                $("#order-count-online").html($online);
            }

            if($onsite > parseInt($currOnsite)){
                $('#order-count-onsite').addClass('new-order-indicator');
                $('#onsite-icon').addClass('new-order-indicator');
                $("#order-count-onsite").html($onsite);            }

            if($delivered > parseInt($currDelivered)){
                $('#order-count-delivered').addClass('new-order-indicator');
                $('#delivered-icon').addClass('new-order-indicator');
                $("#order-count-delivered").html($delivered);            }

        })
    }, 60000);

});
