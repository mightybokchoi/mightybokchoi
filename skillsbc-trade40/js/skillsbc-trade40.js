// SLIDE DOWN NAVIGATION // 

$(document).ready(function() {
    $("#menu-hamburger").click(function(){
        $(".submenu").slideDown();
        $(this).hide();
    });
    $("#menu-close").click(function(){
    	$(".submenu").slideUp();
    	$("#menu-hamburger").show();
    });
});


// SMOOTH SCROLL // 

$(document).ready(function(){
  $('a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
    && location.hostname == this.hostname) {
      var $target = $(this.hash);
      $target = $target.length && $target
      || $('[name=' + this.hash.slice(1) +']');
      if ($target.length) {
        var targetOffset = $target.offset().top;
        $('html,body')
        .animate({scrollTop: targetOffset}, 600);
       return false;
      }
    }
  });
});