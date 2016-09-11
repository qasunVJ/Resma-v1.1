var Table = {
    tableNo : 1,

    addNewTable : function () {
        $(".tables-wrapper ul").append('' +
            '<li class="table-holder ui-state-default">' +
            '<span class="number">' + ("0" + this.tableNo).slice(-2) +'</span>' +
            '<a href="#"><img src="/images/free.svg"></a></li>' +
            '<li class="table-empty ui-state-default"></li>');

        this.tableNo++;
    },

    removeTable: function () {
        $(".tables-wrapper ul li.table-empty").last().remove();
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

    //Fires an ajax call to the SERVER to get TABLE VIEW details
    $.get("/managers/tableview", function(tableView, status){
        $tableNumber = tableView.tableNum;
        Table.tableNo = $tableNumber;

        $tableViewMarkup = $(tableView.tableViewMarkup);
        console.log($tableViewMarkup);
        $($tableViewMarkup).prependTo('.tables-wrapper');
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
});
