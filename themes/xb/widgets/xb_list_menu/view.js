(function ($) {

    setTimeout(function () {
        $('[data-id=' + $('#current_category').val() + ']').addClass('act');
    }, 10);
    
})(jQuery);