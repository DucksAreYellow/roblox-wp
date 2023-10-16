
    $( document ).ready(function() {

     //make chosen js accessible   
    $('.chosen-single').attr('role', 'button').attr('aria-haspopup', 'listbox').attr('aria-expanded', 'false');
    $('ul.chosen-results').attr('role', 'listbox');
    $('ul.chosen-results li').attr('role', 'option');
    $('.chosen-disabled').children('a').attr('aria-disabled', 'true');
   
  
    //faq testimonial slider
    $('.testimonials .slick-arrow').on('click', function() {
        $('.testimonials .slick-list').find('.slick-active').focus();
    });

    //language selector options
    $('.language-switcher ul li').attr('role', 'option');
    $('.language-switcher ul').attr('role', 'listbox'); 

    if ($('body').hasClass('page-template-page-for_parents')) { $('.slick-dots').attr('aria-hidden', 'true'); };


    });
 