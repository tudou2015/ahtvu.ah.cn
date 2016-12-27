$(function () {

    //绑定分页信息    

    var options = $('.periodical_paging').data('paging');

    options.show_left_info = false;

    $('.periodical_paging').paging(options);
});