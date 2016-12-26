$(function () {

    //绑定分页信息    
    var options = $('.resources_paging').data('paging');

    options.show_left_info = false;

    $('.resources_paging').paging(options);
});