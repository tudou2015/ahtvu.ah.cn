$(function () {

    //绑定分页信息    
    var options = $('.services_paging').data('paging');

    options.show_left_info = false;

    $('.services_paging').paging(options);
});