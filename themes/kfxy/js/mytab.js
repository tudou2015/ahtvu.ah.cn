$(function () {
    // tab
    $('.list-tab-title li, .list-tab-title-right li').click(function () {
        var _self = $(this),
            index = _self.index();
        _self.siblings().removeClass('current');
        _self.addClass('current');
        _self.parents('.list-tab').children('.news-tab-content:eq(' + index + ')').show().siblings('.news-tab-content').hide();
    });

});