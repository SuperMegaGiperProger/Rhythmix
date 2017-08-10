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
    this.play = function () {
        clearTapLine();
        insp.reset();
        metr.play();
    };
    this.start = function() {
        $("#tapzone").click(insp.tap);
        document.onkeydown = function () {
            insp.tap();
        };
        this.play();
        this.intervalId = setInterval(this.play, interval * 4);
    };
    this.stop = function () {
        $("#tapzone").off('click');
        clearInterval(this.intervalId);
    };
}

var c = new Cycle(1000);
c.start();