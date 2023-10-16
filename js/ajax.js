jQuery(document).ready(function($) {
  $(function(){
    var $mainContent = $('#main-content'),
        $cat_links = $('ul.categories-filters li a');

    $cat_links.on('click', function(e){
      e.preventDefault();
      $el = $(this);
      var value = $el.attr("href");
      $mainContent.animate({opacity: "0.5"});
      $mainContent.load(value + " #inside", function(){
        $mainContent.animate({opacity: "1"});
      });
    });
  });
});

