function strong() {
    $("#strongBeat")[0].play();
}

function weak() {
    $("#weakBeat")[0].play();
}

function Metronome(interval, signature = {note_value: 4, beats_num: 4}) {
    var intervalId = null;
    var shortIntervalId = null;
    const duration = interval * signature.beats_num;
    this.play = function () {
        strong();
        shortIntervalId = setInterval(weak, interval);
        setTimeout(clearInterval, duration, shortIntervalId);
    };
    this.start = function () {
        intervalId = setInterval(this.play, duration + interval);
    };
    this.stop = function () {
        clearInterval(shortIntervalId);
        clearInterval(intervalId);
    };
}