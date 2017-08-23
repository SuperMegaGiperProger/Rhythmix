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

function drawTapCycle(part, valid) {
    drawCicle(dx + dx * 8 * part, y, 6, valid ? 'lime' : 'red', userCanvContext);
}

function clearTapLine(signature = {note_value: 4, beats_num: 4}) {
    userCanvContext.clearRect(0, 0, usertaps.width, usertaps.height);
    var lip = 30; //px
    drawLine(dx - lip, y, dx * 9 + lip, y, userCanvContext);
    var d = dx * 8 / signature.beats_num;
    for (var i = 0, width = 8; i < signature.beats_num + 1; ++i) {
        var x = dx + d * i;
        drawLine(x, y - width, x, y + width, userCanvContext);
    }
}

clearTapLine();