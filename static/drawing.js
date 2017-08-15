function drawLine(x1, y1, x2, y2, context) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function drawCicle(x, y, r, colour, context) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.lineWidth = 0;
    context.fillStyle = colour;
    context.fill();
}

var usertaps = $("#usertaps")[0];
var dx = usertaps.width / 10;
var y = usertaps.height / 2;
var userCanvContext = usertaps.getContext('2d');

function drawTapCycle(intervalCount, valid) {
    drawCicle(dx + dx * 2 * intervalCount, y, 6, valid ? 'lime' : 'red', userCanvContext);
}

function clearTapLine() {
    userCanvContext.clearRect(0, 0, usertaps.width, usertaps.height);
    var lip = 30; //px
    drawLine(dx - lip, y, dx * 9 + lip, y, userCanvContext);
    for (var i = 0, width = 8; i < 5; ++i) {
        var x = dx + dx * 2 * i;
        drawLine(x, y - width, x, y + width, userCanvContext);
    }
}

clearTapLine();