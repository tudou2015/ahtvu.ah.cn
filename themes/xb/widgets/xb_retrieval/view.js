$(function () {

    //滚动图标隐藏显示
    var list = $('#scrolllist').find('li');

    list.length > 8 ? $('#scrollarrow').show() : $('#scrollarrow').hide();
});