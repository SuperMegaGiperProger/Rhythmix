function TapInspector(interval, signature, pattern) {
    function search(val, left = 0, arr = pattern, right = arr.length - 1) { //it must be replaced on O(1) search !!!!!!
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
        'easy': 30,
        'middle': 15,
        'hard': 5,
        'super': 2
    }[$('input:radio[name="complexity"]:checked')[0].value]; //ms
    var lastTaps = [];
    var prevBeatNum = 0;
    this.tap = function () {
        var spentTime = Date.now() - startTime;
        prevBeatNum = search(spentTime, prevBeatNum);
        var delta = Math.abs(pattern[prevBeatNum] - spentTime);
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

function Cycle(interval, signature = {note_value: 4, beats_num: 4}, pattern = null) {
    if (pattern === null) {
        pattern = {};
        for (var i = 0; i < signature.beats_num; ++i) {
            pattern[i] = [1];
        }
    }
    interval /= signature.note_value / 4;
    const duration = interval * signature.beats_num;

    function getLinearPattern(pattern, interval, time = 0) {
        var lin_pat = {'time': [], 'part': []};
        for (var part_num in pattern) {
            var subpattern = pattern[part_num];
            if (subpattern[0] === 1) {
                var beat_time = time + part_num * interval;
                lin_pat['time'].push(beat_time);
                lin_pat['part'].push(beat_time / duration);
            } else {
                var new_lin_pat = getLinearPattern(subpattern[1], interval / subpattern[0], time + part_num * interval);
                for (var key in lin_pat) lin_pat[key] = lin_pat[key].concat(new_lin_pat[key]);
            }
        }
        return lin_pat;
    }

    pattern = getLinearPattern(pattern, interval);
    var metr = new Metronome(interval, signature);
    var insp = new TapInspector(interval, signature, pattern['time']);
    var intervalId = null;
    this.play = function () {
        clearTapLine(signature, pattern['part']);
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
        intervalId = setInterval(this.play, interval * signature.beats_num);
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
    btn: {
        elem: $('#playBtn'),
        cell: $('#tapLine'),
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
            show(this.cell, '20px');
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

        this.btn.stop();
        var tempo = parseAndLimit($('form[name="tempo"] > input')[0], 10, 60, 280);
        var form = $('form[name="signature"]');
        var signature = {
            beats_num: parseAndLimit(form.find('input[name="beats_num"]')[0], 1, 4, 64),
            note_value: parseAndLimit(form.find('input[name="note_value"]')[0], 1, 4, 64)
        };
        this.cycle = new Cycle(1000 * 60 / tempo, signature);
        this.cycle.start();
    },
    stop: function () {
        this.btn.play();
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
    if (game.cycle !== undefined) {
        stopGame();
        startGame();
    }
    event.stopPropagation();
}
