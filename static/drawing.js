function scaleByWidth(elem, width) {
    var prop = elem.offsetHeight / elem.offsetWidth;
    elem.style.width = width;
    elem.style.height = width * prop;
}

function fullUserTapsLine() {
    scaleByWidth(document.getElementById('usertaps'), '100%');
    drawPattern(game.pattern);
}

fullUserTapsLine();

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
    closepatterns(event);
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

function openpatterns(event) {
    closeSettings(event);
    show($('#patterns'));
    $('#patternBtn')
        .unbind('click', openpatterns)
        .bind('click', closepatterns);
    event.stopPropagation()
}

function closepatterns(event) {
    hide($("#patterns"));
    $('#patternBtn')
        .unbind('click', closepatterns)
        .bind('click', openpatterns);
    event.stopPropagation()
}

function drawLine(x1, y1, x2, y2, colour, context) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 3;
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

function drawNote(note, line, part) {
    line.append('<img class="note" src="../static/Images/Notes/' + note.toString() + '.png" style="left: ' + (part * 100).toString() + '%">');
}

function drawPattern(pattern) {
    var line = $('#notes');
    line.html('');
    if (!('part' in pattern)) return;
    for (var i in pattern.notes) {
        drawNote(pattern.notes[i], line, pattern.part[i]);
    }
}

function clearTapLine(signature, part_pattern) {
    userCanvContext.clearRect(0, 0, usertaps.width, usertaps.height);
    var lip = 30; //px
    drawLine(dx - lip, y, dx * 9 + lip, y, 'black', userCanvContext);
    var d = tap_line_length / signature.beats_num;

    function drawMetrBeats(width = 5) {
        for (var i = 0; i < signature.beats_num + 1; ++i) {
            var x = dx + d * i;
            drawLine(x, y - width, x, y + width, 'black', userCanvContext);
        }
    }
    function drawPatternLines(part_pattern, width = 30) {
        for (var i in part_pattern) {
            var x = part_pattern[i] * tap_line_length + dx;
            drawLine(x, y - width, x, y + width, '#4CAF50', userCanvContext);
            //drawNote('2', part_pattern[i]);
        }
    }
    drawPatternLines(part_pattern);
    drawMetrBeats();
}

