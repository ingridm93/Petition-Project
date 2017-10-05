var canvas = document.getElementById('signature');
var sig = document.getElementById('sig');
var ctx = canvas.getContext('2d');
var offsetX = canvas.style.left;
var offsetY = canvas.style.top;
var dataURL;


canvas.addEventListener('mousedown', mouseDown);


function mouseDown(e) {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    console.log(offsetX, offsetY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#900';
    document.body.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', mouseMove);
}

function mouseMove (event) {
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    offsetX = event.offsetX;
    offsetY = event.offsetY;
    console.log(offsetX, offsetY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
}

function mouseUp () {
    console.log('mouseup activated');
    dataURL = canvas.toDataURL();
    canvas.removeEventListener('mousemove', mouseMove);
    document.body.removeEventListener('mousedown', mouseDown);
    sig.value = dataURL;
    console.log('dataURL', sig.value);
}
