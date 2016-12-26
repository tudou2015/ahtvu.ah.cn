$(function () {

    //绑定分页信息    
    var options = $('.series_paging').data('paging');

    options.show_left_info = false;

    $('.series_paging').paging(options);
});