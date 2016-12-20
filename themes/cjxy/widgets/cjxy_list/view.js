$(function () {

    //绑定分页信息    

    var options = $('.paging').data('paging');

    options.show_left_info = false;

    $('.paging').paging(options);
});