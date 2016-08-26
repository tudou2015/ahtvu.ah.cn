$(function () {

    // tab
    $('.news-tab-title li').click(function () {
        var index = $(this).index();
        $('.news-tab-title li').removeClass('cur');
        $(this).addClass('cur');
        $(this).parents('.news-tab').children('.news-tab-content:eq(' + index + ')').show().siblings('.news-tab-content').hide();
    });

    // nav
    $(".nav li").on('click', function () {
        $(".nav li a").removeClass('act');
        $("a", $(this)).addClass("act");
    });

    // 栏目
    $(".column li").on('click', function () {
        $(".column li a").removeClass('act');
        $("a", $(this)).addClass("act");
    });
})