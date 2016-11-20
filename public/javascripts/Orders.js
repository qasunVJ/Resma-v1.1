var Order = {
    itemNum : 0,

    checkItemNum : function () {
        if(this.itemNum > 0){
            $('#order-submit').removeClass('disabled');
            document.getElementById('order-submit').disabled=false;
        }else{
            $('#order-submit').addClass('disabled');
            document.getElementById('order-submit').disabled=true;
        }
    },

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
        Order.checkItemNum();
    },

    setItemPrice: function (price, quantity) {
        $price = price * quantity;
        console.log($price);
        return $price;
    },

    getCartItems : function () {
        console.log('clicked');
        $.ajax({
            url: '/resma/mini-cart',
            type: 'get',
            success: function (result) {
                console.log(result);
            }
        });
    }

};


$(document).ready(function () {
    setInterval(function () {
        Order.checkItemNum();
    }, 0);

    $isCustomer = $('.menu-container').attr('data-id');
    if($isCustomer != 'customer'){
        $('.item-footer').hide();
    }

    //Append order item
    $('.add-order-item').click(function () {
        Order.addOrderItem();
    });

    //Remove items
    $(document).on('click','.remove-order-item', function () {
        Order.removeOrderItem($(this));
        debugger;
    });

    //Initial Price setting
    $(document).on('change', '.itemName', function () {
        $price = $(this).find(':selected').data('id');
        $qty = $(this).parents('div.item_name_wrapper').siblings('div.qty_wrapper').children('.itemQty').val();

        $unitPrice = Order.setItemPrice($price, $qty);
        //console.log($unitPrice);

        $(this).parents('div.item_name_wrapper').siblings('div.price_wrapper').find('.unitPrice').attr('value',$unitPrice);
    });

    $(document).on('change', '.itemQty', function () {
        $qty = $(this).val();
        $price = $(this).parents('div.qty_wrapper').siblings('div.item_name_wrapper').find('select.itemName option:selected').attr('data-id');

        console.log($price + $qty);
        $unitPrice = Order.setItemPrice($price, $qty);
        console.log('From qty'+ $unitPrice);

        $(this).parents('div.qty_wrapper').siblings('div.price_wrapper').find('.unitPrice').attr('value',$unitPrice);

    });

    $('.mini-cart').click(function () {
        console.log('clicked');
        Order.getCartItems();
    });

    $('.user-message').animate({
        top: '10px'
    }).delay(3000).fadeOut();

    $(document).on('click','.print-invoice', function () {
       window.print();
    });

    //Refresh Orders


    ////Sending itemNum to backend
    //$(document).on('click', '.order-submit', function(){
    //    Order.getItemNumber();
    //});
});