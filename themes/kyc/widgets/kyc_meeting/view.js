$(function () {

    //绑定分页信息    

    var options = $('.meeting_paging').data('paging');

    options.show_left_info = false;

    $('.meeting_paging').paging(options);
});