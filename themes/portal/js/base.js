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

    //导航nav
    var li = $('.nav li');

    li.mouseover(function () {

        $(this).find('a:first').addClass("act");
        $(this).find('.sub-nav:first').show();
    });

    li.mouseleave(function () {

        $(this).find('a:first').removeClass("act");
        $(this).find('.sub-nav:first').hide();
    });

    // xtdt-tab
    $('.xtdt-tab-title li').click(function () {
        var index = $(this).index();
        $('.xtdt-tab-title li').removeClass('cur');
        $(this).addClass('cur');
        $(this).parents('.xtdt-box').children('.list-box:eq(' + index + ')').show().siblings('.list-box').hide();
    });

    $('#sub').on('click', function () {

        var keyword = $("input[name='search']").val();

        if (!keyword) {
            alert('请输入关键字！');
            $("input[name='search']").focus();
            return false;
        }
    })

    FloatAd("#floatAD");//调用  
    FloatAding("#floatKH");//调用  
});