$(function () {
    // tab
    $('.resource-tab-title li, .resource-tab-title-two li').click(function () {
        var _self = $(this),
            index = _self.index();
        _self.siblings().removeClass('cur');
        _self.addClass('cur');
        _self.parents('.resource-tab').children('.resource-tab-content:eq(' + index + ')').show().siblings('.resource-tab-content').hide();
    });
});