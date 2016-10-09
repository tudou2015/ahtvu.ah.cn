(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    // 菜单点击事件
    $(".xtjs-menu li a").each(function () {
        
        var _cmenu = $(this),
            id = $(this).data('id'),
            infoId = $.getUrlParam('id');
        
        if (id == infoId) {
            $(this).addClass('act');
        } else {
            $(this).removeClass('act');
        }
    });
})(jQuery);