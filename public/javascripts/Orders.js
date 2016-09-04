var Order = {
    itemNum : 0,

    displayItemNumber : function () {
        $('.item-num-display').attr('value',this.itemNum);
    },

    addOrderItem : function () {
        $('[data-id="order-items-wrap"]').append('<div class="clearfix order-item">' +
            '<div class="col-md-4 col-sm-4 col-xs-12">' +
            '<lable>Item Name</lable><input type="text" name="order_item"></div><div class="col-md-4 col-sm-4 col-xs-12">' +
            '<lable>Quantity</lable><input type="number" name="order_item_qty">' +
            '</div><div class="col-md-4 col-sm-4 col-xs-12"> <lable>......</lable><div class="margin-10 clearfix">' +
            '<span class="price">Price</span>' +
            '<span class="remove-order-item btn btn-danger right">Remove</span></div></div></div>');

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