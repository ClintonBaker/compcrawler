window.onload = function(){
    var c = document.getElementById('canvas');
    c.width = c.parentElement.offsetWidth;
    
    var ctx = c.getContext('2d');
    var img = document.getElementById('post');
    var ratio = img.width/img.height;
    var imgWidth = c.width;
    var imgHeight = imgWidth/ratio;
    var angle = parseInt(img.getAttribute('angle'), 0);
    if(angle === 90 || angle === 270){
        if(imgWidth > imgHeight){
            c.height = imgWidth * ratio;
        } else {
            c.height = imgWidth * ratio;
        }
    } else {
        c.height = imgHeight;
    }
    
    angle = Math.PI * angle/180;

    //Save context
    ctx.save();
    //Clear context
    ctx.clearRect(0, 0, c.width, c.height);
    //Rotate context
    ctx.translate(c.width/2, c.height/2);
    ctx.rotate(angle);
    if(angle === Math.PI/2 || angle === 3*Math.PI/2 || angle === -Math.PI/2 || angle === -3*Math.PI/2){
        imgHeight = c.width;
        imgWidth = imgHeight*ratio;
    } else {
        imgWidth = c.width;
        imgHeight = imgWidth/ratio;
    }
    //Draw Image
    ctx.drawImage(img, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
    //Reset Context
    ctx.restore();
};