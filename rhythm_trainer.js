function TapInspector(interval) {
    var startTime = Date.now();
    const variation = 30; //ms
    this.tap = function () {
        var spentTime = Date.now() - startTime;
        var mod = spentTime % interval;
        var delta = Math.min(interval - mod, mod);
        drawTapCycle(spentTime / interval, delta < variation);
    };
    this.reset = function () {
        startTime = Date.now();
    }
}

function Cycle(interval) {
    var metr = new Metronome(interval);
    var insp = new TapInspector(interval);
    var intervalId = null;
    this.play = function () {
        clearTapLine();
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
        play: function () {
            this.elem
                .unbind('click', stopGame)
                .html('Play')
                [0].onclick = startGame; // .bind doesn't work
        },
        stop: function () {
            this.elem
                .unbind('click', startGame)
                .html('Stop')
                [0].onclick = stopGame; // .bind doesn't work
        }
    },
    start: function () {
        this.btn.stop();
        this.cycle = new Cycle(1000);
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