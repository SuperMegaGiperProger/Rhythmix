function strong() {
    $("#strongBeat")[0].play();
}

function weak() {
    $("#weakBeat")[0].play();
}

function Metronome(interval) {
    var intervalId = null;
    var shortIntervalId = null;
    this.play = function () {
        strong();
        shortIntervalId = setInterval(weak, interval);
        setTimeout(clearInterval, interval * 3, shortIntervalId);
    };
    this.start = function () {
        intervalId = setInterval(this.play, interval * 4);
    };
    this.stop = function () {
        clearInterval(shortIntervalId);
        clearInterval(intervalId);
    };
}