$(function () {

    jQuery.getJSON("http://218.22.21.242:2345/?callback=?", function (msg) {
        $('.today_num').text(msg.today + 1);
        $('.total_num').text(msg.total + 1);
    });

    $.getScript('http://218.22.21.242:2345/socket.io/socket.io.js', function () {
        $.getScript('http://218.22.21.242:2345/boot.js');
    });

    var get_current_time = function (time) {

        var date;

        try {

            date = new Date(time)
        } catch (error) {
            date = new Date();
        }

        date.setSeconds(date.getSeconds() + 1);

        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

        return {
            year: year,
            month: month < 10 ? '0' + month : month,
            day: day < 10 ? '0' + day : day,
            hours: hours < 10 ? '0' + hours : hours,
            minutes: minutes < 10 ? '0' + minutes : minutes,
            seconds: seconds < 10 ? '0' + seconds : seconds,
            ticks: date.getTime()
        };
    }

    setInterval(function () {

        var ticks = $('#current_time').data('ticks'),
            date = get_current_time(ticks),
            time;

        time = date.year + '年';
        time += date.month + '月';
        time += date.day + '日 ';
        time += date.hours + ':';
        time += date.minutes + ':';
        time += date.seconds;

        $('#current_time').data('ticks', date.ticks).html(time);
    }, 1000);
});