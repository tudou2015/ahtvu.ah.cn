$(function () {
    // tab
    $('.tabList li').click(function () {
        var index = $(this).index();
        $('.tabList li').removeClass('cur');
        $(this).addClass('cur');
        $(this).parents('#tab').children('.tabCon:eq(' + index + ')').show().siblings('.tabCon').hide();
    });
});