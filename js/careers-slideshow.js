
jQuery(function ($) {
	function init(){
		if($('.careers-slideshow').length>0){
			careersSlideshow();
		}
	}

	function careersSlideshow() {
		var showDots = $('.testimonials .slide').length > 1;

	  $('.careers-slideshow .slideshow').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: showDots,
            autoplay: false,
            autoplaySpeed: 4000,
            draggable: false,
            centerMode: true,
            infinite: false,
            centerPadding: '0px',
            responsive: [
		    {
		      breakpoint: 968,
		      settings: {
		        arrows: true,
		        centerMode: true,
		        centerPadding: '0px',
		        slidesToShow: 1
		      }
		    }
	  	]
		});

		if($('.careers-slideshow').length>0){
			$('.careers-slideshow .slide').click(function(e) {
        var vidID = $(this).attr('data-video-id');
        var event = new CustomEvent("SHOW_VIDEO", { "detail": {"videoID": vidID} });
			  //document.dispatchEvent(event);
        return false;
      });
		}
  }

  init();
});