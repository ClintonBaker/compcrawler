
window.onload = function() {
    var save = document.getElementsByTagName('form');
    var url = save[0].getAttribute('action');
    save[0].setAttribute('action', url + 0);
    
    var c = document.getElementById('canvas');
    c.width = c.parentElement.offsetWidth;
    
    var ctx = c.getContext('2d');
    var img = document.getElementById('post');
    var ratio = img.width/img.height;
    var imgWidth = c.width;
    var imgHeight = imgWidth/ratio;
    c.height = imgWidth > imgHeight ? imgWidth * ratio: imgHeight;
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    var angle = Math.PI * parseInt(img.getAttribute('angle'), 0)/180;
    
    var left = document.getElementById('left');
    left.onclick = function(){
        angle = (angle - Math.PI/2);
        if(angle < 0){
            angle = -((-angle) % (2*Math.PI));
        }
        rotate(angle);
    };
    
    var right = document.getElementById('right');
    right.onclick = function(){
        angle = (angle + Math.PI/2) % (2*Math.PI);
        rotate(angle);
    };
    
    var rotate = function(angle){
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
        if(angle >= 0){
            save[0].setAttribute('action', url + (angle*180/Math.PI));
            
        } else {
            save[0].setAttribute('action', url + (360+(angle*180/Math.PI)));
        }
        
    };
  
    rotate(angle);
};