function TapInspector(interval) {
    var startTime = Date.now();
    const variation = {'easy': 30, 'middle': 15, 'hard': 5, 'super': 1}[$('input:radio[name="complexity"]:checked')[0].value]; //ms
    var lastTaps = [];
    this.tap = function () {
        var spentTime = Date.now() - startTime;
        var mod = spentTime % interval;
        var delta = Math.min(interval - mod, mod);
        var intervalNum = spentTime / interval;
        if (intervalNum > 3.8) {
            drawTapCycle(intervalNum - 4.0, delta < variation);
            lastTaps.push([intervalNum - 4.0, delta < variation]);
        }
        drawTapCycle(intervalNum, delta < variation);
    };
    this.reset = function () {
        lastTaps = [];
        startTime = Date.now();
    };
    this.drawLastTaps = function () {
        lastTaps.forEach(function (elt) { drawTapCycle(elt[0], elt[1]); });
    };
}

function Cycle(interval) {
    var metr = new Metronome(interval);
    var insp = new TapInspector(interval);
    var intervalId = null;
    this.play = function () {
        clearTapLine();
        insp.drawLastTaps();
        insp.reset();
        metr.play();
    };
    function tap() {
        insp.tap();
    }
    this.start = function () {
        $("#tapzone").bind('click', tap);
        $('body').bind('keydown', tap);
        this.play();
        intervalId = setInterval(this.play, interval * 4);
    };
    this.stop = function () {
        metr.stop();
        $("#tapzone").unbind('click', tap);
        $("body").unbind('keydown', tap);
        clearInterval(intervalId);
    };
}

var game = {
    cycle: null,
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
        this.btn.stop();
        var tempo = parseInt($('form[name="tempo"] > input')[0].value);
        // alert(tempo);
        // alert(typeof tempo);
        if (isNaN(tempo)) {
            $('form[name="tempo"] > input')[0].value = "60";
            tempo = 60;
        } else if (tempo > 280) {
            $('form[name="tempo"] > input')[0].value = "280";
            tempo = 280;
        }
        this.cycle = new Cycle(1000 * 60 / tempo);
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