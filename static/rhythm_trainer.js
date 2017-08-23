function TapInspector(interval, signature) {
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
    this.tap = function () {
        var spentTime = Date.now() - startTime;
        var mod = spentTime % interval;
        var delta = Math.min(interval - mod, mod);
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
        startTime = Date.now();
    };
    this.drawLastTaps = function () {
        lastTaps.forEach(function (elt) {
            drawTapCycle(elt[0], elt[1]);
        });
    };
}

const CLICK = 'ontouchstart' in window ? 'touchstart' : 'click';

function Cycle(interval, signature = {note_value: 4, beats_num: 4}) {
    interval /= signature.note_value / 4;
    var metr = new Metronome(interval, signature);
    var insp = new TapInspector(interval, signature);
    var intervalId = null;
    this.play = function () {
        clearTapLine(signature);
        insp.drawLastTaps();
        insp.reset();
        metr.play();
    };
    function tap(event) {
        var ignoredTags = new Set(['INPUT', 'BUTTON']);
        if (ignoredTags.has(event.target.tagName)) return;
        insp.tap();
    }

    this.start = function () {
        $("#tapzone").bind(CLICK, tap);
        $('body').bind('keydown', tap);
        this.play();
        intervalId = setInterval(this.play, interval * signature.beats_num);
    };
    this.stop = function () {
        metr.stop();
        $("#tapzone").unbind(CLICK, tap);
        $("body").unbind('keydown', tap);
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
            this.cell.css('height', '0px');
        },
        stop: function () {
            this.elem
                .unbind('click', startGame)
                .html('<b>Stop</b>')
                [0].onclick = stopGame; // .bind doesn't work
            this.cell.css('height', '20px');
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
        var signature = {
            beats_num: parseAndLimit($('form[name="signature"] > input[name="beats_num"]')[0], 1, 4, 64),
            note_value: parseAndLimit($('form[name="signature"] > input[name="note_value"]')[0], 1, 4, 64)
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