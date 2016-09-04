$(document).ready(function () {

	$("div#tray-bunch ul li").hover(function(){
        $(this).find(".lid").animate({top: '-60px'});
        $(this).find("#intro").fadeIn();
    }, function () {
    	$(this).find(".lid").animate({top: '15px'});
    	$(this).find("#intro").fadeOut('fast');
    });

    $("#help_token").click(function(){
        $("#help_token_msg").fadeIn();
    });

    $("#help_token_close").click(function(){
        $("#help_token_msg").fadeOut();
    });
});