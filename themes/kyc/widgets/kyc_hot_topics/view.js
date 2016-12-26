$(function () {

    //绑定分页信息    

    var options = $('.topices_paging').data('paging');

    options.show_left_info = false;

    $('.topices_paging').paging(options);
});