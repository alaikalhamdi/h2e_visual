home = document.getElementById('home');
monitoring = document.getElementById('monitoring');

h2 = document.getElementById('m-h2');
co = document.getElementById('m-co');
co2 = document.getElementById('m-co2');
ch4 = document.getElementById('m-ch4');

monitor = false;

current_frame = home;

var animating = false;
var animation_id;
var allow_animate = true;

hamburger = document.getElementById('hamburger');

function animateFrame(newFrame){
    if(animating){return;}
    if(!allow_animate){return;}
    animating = true;
    newFrame.style.left = '100%';
    newFrame.style.visibility = 'visible';
    newFrame.style.zIndex = '1';
    if (newFrame == home){newFrame.style.zIndex = '2';}
    current_frame.style.zIndex = '0';
    var progress = 600;
    animation_id = setInterval(()=>{
        progress -= 10;
        newFrame.style.left = progress.toString();
        if(progress == 0){
            clearInterval(animation_id);
            animating = false;
            current_frame.style.visibility = 'hidden';
            if(current_frame==monitoring){stopMonitor();}
            if(newFrame==monitoring){startMonitor();}
            current_frame = newFrame;
        }
    }, 5);
}

function toggleVisible(div, visible){
    if(visible){
        div.style.opacity = 1;
        div.style.zIndex = 1;
    } else {
        div.style.opacity = 0;
        div.style.zIndex = -1;
    }
}

function redirectSmooth(url){
    if(animating){return;}
    animating = true;
    document.body.style.transition = '1s';
    document.body.style.opacity = 0;
    setTimeout(()=>{window.location.href = url;}, 1000);
}