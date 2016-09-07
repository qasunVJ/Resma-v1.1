var Order = {
    itemNum : 0,

    displayItemNumber : function () {
        $('.item-num-display').attr('value',this.itemNum);
    },

    addOrderItem : function () {
        var newItemBlock = document.getElementById('order-item-hidden').innerHTML.toString();
        console.log(newItemBlock);

        $('[data-id="order-items-wrap"]').append(newItemBlock);
        $('.order-item-hidden').remove();

        this.itemNum = this.itemNum + 1;
        console.log(this.itemNum);

        this.displayItemNumber();

    },

    removeOrderItem : function (item) {
        item.parents('.order-item').remove();
        this.itemNum = this.itemNum - 1;
        this.displayItemNumber();
        console.log(this.itemNum);
    }

    //getItemNumber : function () {
    //    console.log('clicked');
    //    $.ajax({
    //        url: '/resma/orders/new-order/:' + this.itemNum,
    //        type: 'POST',
    //        success: function () {
    //        }
    //    });
    //}

};


$(document).ready(function () {
    //Append order item
    $('.add-order-item').click(function () {
        Order.addOrderItem();
    });

    //Remove items
    $(document).on('click','.remove-order-item', function () {
        Order.removeOrderItem($(this));
    });

    ////Sending itemNum to backend
    //$(document).on('click', '.order-submit', function(){
    //    Order.getItemNumber();
    //});
});