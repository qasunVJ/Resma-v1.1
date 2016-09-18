var Table = {
    tableNo : 1,

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

        this.tableNo--;
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

    //Fires an ajax call to the server to get TABLE VIEW details
    $.get("/managers/tableview", function(tableView){
        $tableNumber = tableView.tableNum;
        Table.tableNo = $tableNumber;
        $tableViewMarkup = $(tableView.tableViewMarkup);
        $profPic ='';

        $orders = $(tableView.orders);
        $($tableViewMarkup).prependTo('.tables-wrapper');

        if($orders.length != 0){
            for(var i=0;i<$orders.length;i++){
                $order = $orders[i];
                for(var j=1;j<=Table.tableNo;j++){
                    if(j == $order.table_no){
                        $newSRC = '/images/' + $order.order_state + '.svg';
                        $('ul#sortable li:nth-of-type('+j+') a img').attr('src', $newSRC);

                        var profPic = $.ajax({
                            type:'get',
                            url:'/resma/getuserimage/'+$order.waiter_id,
                            async: false,
                            success: function (response) {
                                return response;
                            }
                        }).responseText;

                        if(profPic != null){
                            var picId = profPic.split(":")[1].split("}")[0].replace(/"/g,"");
                            $('<span class="table-waiter"><img class="img-responsive" src="/images/uploads/'+ picId +'"/></span><label class="table-label">'+$order.waiter_name.split(" ")[0]+'</label>').appendTo('ul#sortable li:nth-of-type('+j+')');
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

    //
});
