function strong() {
    $("#strongBeat")[0].play();
}

function weak() {
    $("#weakBeat")[0].play();
}

function Metronome(interval, signature = {note_value: 4, beats_num: 4}) {
    var intervalId = null;
    var shortIntervalId = null;
    this.play = function () {
        strong();
        shortIntervalId = setInterval(weak, interval);
        setTimeout(clearInterval, interval * signature.beats_num, shortIntervalId);
    };
    this.start = function () {
        intervalId = setInterval(this.play, interval * (signature.beats_num + 1));
    };
    this.stop = function () {
        clearInterval(shortIntervalId);
        clearInterval(intervalId);
    };
}