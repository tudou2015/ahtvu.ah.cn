$(function () {

    //绑定分页信息    

    var options = $('.project_paging').data('paging');

    options.show_left_info = false;

    $('.project_paging').paging(options);
});