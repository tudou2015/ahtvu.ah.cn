$(function () {

    //滚动图标隐藏显示
    var list = $('#scrolllist').find('li');

    if (list.length > 8) {
        $('#scrollarrow').show();
    } else {
        $('#scrollarrow').hide();
        list.parent().css("width","100%");
    }
});