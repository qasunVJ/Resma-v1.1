var Cart = {
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
}

$($document).ready(function () {
    $('.mini-cart').click(function () {
        console.log('clicked');
        Cart.getCartItems();
    });

    $('.user-message').animate({
        top: '10px'
    }).delay(3000).fadeOut();
});