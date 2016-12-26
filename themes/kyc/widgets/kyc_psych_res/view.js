$(function () {

    //绑定分页信息    
    var options = $('.res_paging').data('paging');

    options.show_left_info = false;

    $('.res_paging').paging(options);
});