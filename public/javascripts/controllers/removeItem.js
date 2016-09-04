$(document).ready(function () {
    $('.remove').click(function () {
        deleteId = $(this).data('id');
        console.log(deleteId);
        $.ajax({
            url: '/managers/items/delete/' + deleteId,
            type: 'DELETE',
            success: function () {

            }
        });
        console.log('/managers/items/delete/' + deleteId);
        window.location = '/managers/settings';
    });
});