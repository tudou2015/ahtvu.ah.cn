$(function () {

    //绑定分页信息    
    var options = $('.english_paging').data('paging');

    options.show_left_info = false;

    $('.english_paging').paging(options);
});