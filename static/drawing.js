function hide(jqelem) {
    jqelem
        .css('transform', 'scaleY(0)')
        .css('height', '0');
}

function show(jqelem, height = 'auto') {
    jqelem
        .css('height', height)
        .css('transform', 'scaleY(1)');
}

function openSettings(event) {
    show($("#settings"));
    $('#setBtn')
        .unbind('click', openSettings)
        .bind('click', closeSettings);
    event.stopPropagation()
}

function closeSettings(event) {
    hide($("#settings"));
    $('#setBtn')
        .unbind('click', closeSettings)
        .bind('click', openSettings);
    event.stopPropagation()
}

function drawLine(x1, y1, x2, y2, colour, context) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 2;
    context.strokeStyle = colour;
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
var tap_line_length = dx * 8;
var y = usertaps.height / 2;
var userCanvContext = usertaps.getContext('2d');

function drawTapCycle(part, valid) {
    drawCicle(dx + tap_line_length * part, y, 6, valid ? 'lime' : 'red', userCanvContext);
}

function clearTapLine(signature, pattern) {
    userCanvContext.clearRect(0, 0, usertaps.width, usertaps.height);
    var lip = 30; //px
    drawLine(dx - lip, y, dx * 9 + lip, y, 'black', userCanvContext);
    var d = tap_line_length / signature.beats_num;

    function drawMetrBeats(width = 3) {
        for (var i = 0; i < signature.beats_num + 1; ++i) {
            var x = dx + d * i;
            drawLine(x, y - width, x, y + width, 'black', userCanvContext);
        }
    }
    function drawPattern(pattern, width = 8) {
        for (var i in pattern) {
            var x = pattern[i] * tap_line_length + dx;
            drawLine(x, y - width, x, y + width, 'LightSeaGreen', userCanvContext);
        }
    }
    drawPattern(pattern);
    drawMetrBeats();
}