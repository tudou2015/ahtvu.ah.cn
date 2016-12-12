(function ($) {

    setTimeout(function () {
        $('[data-id=' + $('#current_info').val() + ']').addClass('act');
    }, 10);

})(jQuery);