jQuery(function ($) {
  var $slideShow = $(".testimonials .slideshow");
  var $slides = $(".slide", $slideShow);

  if ($slides.length) {
    $slideShow;

    $slideShow
      .on("init afterChange", function (evt, slick, direction) {
        setTimeout(function () {
          // force tabindex 0 for nav dots
          $(".slick-dots button", $slideShow).attr("tabindex", "0");

          // set aria-selected false for non-selected dots
          $(".slick-dots button:not([aria-selected='true'])", $slideShow).attr('aria-selected', 'false');
        }, 0);
      })
      .slick({
        dots: $slides.length > 1,
        fade: true,
        infinite: false,
        draggable: true,
        swipe: true,
        swipeToSlide: true,
      });
  }
});
