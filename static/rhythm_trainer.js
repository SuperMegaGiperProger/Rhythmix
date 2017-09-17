function TapInspector(interval, signature, time_pattern) {
    function search(val, left = 0, arr = time_pattern, right = arr.length - 1) { //it must be replaced on O(1) search !!!!!!
        while (left < right) {
            var mid = (left + right) / 2;
            mid = Math.floor(mid);
            if (val > arr[mid]) left = mid + 1;
            else right = mid;
        }
        return val - arr[left] < arr[right] - val ? left : right;
    }

    var startTime = Date.now();
    interval = Math.round(interval);
    const duplicate_part = 0.04; //experimentally; it must fill only line
    const variation = {
        'easy': 50,
        'middle': 30,
        'hard': 15,
        'super': 5
    }[$('input:radio[name="complexity"]:checked')[0].value]; //ms
    var lastTaps = [];
    var prevBeatNum = 0;
    this.tap = function () {
        var spentTime = Date.now() - startTime;
        prevBeatNum = search(spentTime, prevBeatNum);
        var delta = Math.abs(time_pattern[prevBeatNum] - spentTime);
        var part = spentTime / interval;
        part /= signature.beats_num;
        if (part > 1 - duplicate_part) {
            drawTapCycle(part - 1.0, delta < variation);
            lastTaps.push([part - 1.0, delta < variation]);
        }
        drawTapCycle(part, delta < variation);
    };
    this.reset = function () {
        lastTaps = [];
        prevBeatNum = 0;
        startTime = Date.now();
    };
    this.drawLastTaps = function () {
        lastTaps.forEach(function (elt) {
            drawTapCycle(elt[0], elt[1]);
        });
    };
}

const CLICK = 'ontouchstart' in window ? 'touchstart' : 'click';
// if ('ontouchstart' in window) {
//     document.ondouble
// }


function Cycle(interval, signature = {note_value: 4, beats_num: 4}, pattern = undefined) {
    function getMetrPattern() { // metronome beats pattern
        var notes = [];
        for (var i = 0; i < signature.beats_num - 1; ++i) {
            notes.push(signature.note_value);
        }
        if (Number.isInteger(signature.beats_num)) notes.push(signature.note_value);
        else notes.push(signature.note_value / (signature.beats_num - Math.floor(signature.beats_num)));
        return {notes: notes};
    }

    if (pattern === undefined) pattern = getMetrPattern();
    const duration = interval * signature.beats_num;

    pattern.getTimeNPart = function () {
        this.time = [];
        this.part = [];
        var curr_time = 0;
        for (var note in this.notes) {
            this.time.push(curr_time);
            this.part.push(curr_time / duration);
            curr_time += interval * signature.note_value / this.notes[note];
        }
        this.time.push(duration);
        this.time.push(1.0);
    };

    pattern.getTimeNPart();
    drawPattern(pattern);

    var metr = new Metronome(interval, signature);
    var insp = new TapInspector(interval, signature, pattern.time);
    var intervalId = null;
    this.play = function () {
        clearTapLine(signature, pattern.part);
        insp.drawLastTaps();
        insp.reset();
        metr.play();
    };

    function tap(event) {
        var ignoredTags = new Set(['INPUT', 'BUTTON']);
        if (ignoredTags.has(event.target.tagName)) return;
        insp.tap();
    }

    var tapzone = $(document);
    this.start = function () {
        tapzone.bind(CLICK, tap);
        $(document).bind('keydown', tap);
        this.play();
        intervalId = setInterval(this.play, duration);
    };
    this.stop = function () {
        metr.stop();
        tapzone.unbind(CLICK, tap);
        $(document).unbind('keydown', tap);
        clearInterval(intervalId);
    };
}

var game = {
    cycle: undefined,
    pattern: {notes: [4, 4, 4, 4]},
    playBtn: {
        elem: $('#playBtn'),
        cell: $('#actionZone'),
        play: function () {
            this.elem
                .unbind('click', stopGame)
                .html('<b>Play</b>')
                [0].onclick = startGame; // .bind doesn't work
            hide(this.cell);
        },
        stop: function () {
            this.elem
                .unbind('click', startGame)
                .html('<b>Stop</b>')
                [0].onclick = stopGame; // .bind doesn't work
            show(this.cell, '100px');
        }
    },
    start: function () {
        function parseAndLimit(elem, min, mid, max) {
            var num = parseFloat(elem.value);
            if (isNaN(num)) elem.value = num = mid;
            else if (num < min) elem.value = num = min;
            else if (num > max) elem.value = num = max;
            return num;
        }

        this.playBtn.stop();
        var tempo = parseAndLimit($('form[name="tempo"] > input')[0], 10, 60, 280);
        var form = $('form[name="signature"]');
        var signature = {
            beats_num: parseAndLimit(form.find('input[name="beats_num"]')[0], 1, 4, 64),
            note_value: parseAndLimit(form.find('input[name="note_value"]')[0], 1, 4, 64)
        };
        this.cycle = new Cycle(1000 * 60 / tempo, signature, this.pattern);
        this.cycle.start();
    },
    stop: function () {
        this.playBtn.play();
        this.cycle.stop();
        delete this.cycle;
    }
};

function startGame() {
    game.start();
}

function stopGame() {
    game.stop();
}

function reloadGame(event) {
    event.stopPropagation();
    if (game.cycle !== undefined) {
        stopGame();
        startGame();
        return true;
    }
    return false;
}

function setPattern(event, note_pattern = undefined) {
    game.pattern = {notes: note_pattern};
    $('div.pattern').css('background-color', 'white');
    event.currentTarget.style.background = '#A5D7A7';
    if (!reloadGame(event)) startGame();
}