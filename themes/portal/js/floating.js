//广告漂浮窗口  
function FloatAding(selector) {  
    var obj = $(selector);  
    if (obj.find(".item").length == 0) return;
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var dirX = -1.5;
    var dirY = -1.5;
                  
    var delay = 30; 
    obj.css({ left: windowWidth / 4 - obj.width() / 3 + "px", top: windowHeight / 5 - obj.height() / 2 + "px" });
    obj.show();
    var handler = setInterval(moveing, delay);
                  
    obj.hover(function() {
        clearInterval(handler);
    }, function() {  
        handler = setInterval(moveing, delay);  
    });  
  
    obj.find(".close").click(function() {
        closeing();  
    });  
    $(window).resize(function() {
        windowHeight = $(window).height();
        windowWidth = $(window).width();
    });  
    function moveing() {
        var currentPos = obj.position();
        var nextPosX = currentPos.left + dirX;  
        var nextPosY = currentPos.top + dirY; 
  
        if (nextPosX <= 0 || nextPosX >= windowWidth - obj.width()) { 
            dirX = dirX * -1;
            nextPosX = currentPos.left + dirX;  
        }  
        if (nextPosY <= 0 || nextPosY >= windowHeight - obj.height() - 5) {              
            dirY = dirY * -1; 
            nextPosY = currentPos.top + dirY;
        }  
        obj.css({ left: nextPosX + "px", top: nextPosY + "px" });
    }  
  
    function closeing() {//停止漂浮，并销毁漂浮窗口  
        clearInterval(handler);  
        obj.remove();  
    }  
}  