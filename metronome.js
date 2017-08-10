function strong() {
    $("#strongBeat")[0].play();
}

function weak() {
    $("#weakBeat")[0].play();
}

function Metronome(interval) {
    this.play = function () {
        strong();
        setTimeout(clearInterval, interval * 3, setInterval(weak, interval));
    };
    this.start = function () {
        this.intervalId = setInterval(this.play, interval * 4);
    };
    this.stop = function () {
        clearInterval(this.intervalId);
    };
}