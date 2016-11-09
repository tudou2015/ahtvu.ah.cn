$(function () {

    // tab
    $('.news-tab-title li').click(function () {
        var index = $(this).index();
        $('.news-tab-title li').removeClass('cur');
        $(this).addClass('cur');
        $(this).parents('.news-tab').children('.news-tab-content:eq(' + index + ')').show().siblings('.news-tab-content').hide();
    });

    // 栏目
    $(".column li").on('click', function () {
        $(".column li a").removeClass('act');
        $("a", $(this)).addClass("act");
    });

    var li = $('.nav li');

    li.mouseover(function () {

        $(this).find('a:first').addClass("act");
        $(this).find('.sub-nav:first').show();
    });

    li.mouseleave(function () {

        $(this).find('a:first').removeClass("act");
        $(this).find('.sub-nav:first').hide();
    });
})