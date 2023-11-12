let timerId;

function startTimer(duration) {
    clearInterval(timerId);
    let timer = duration * 60, minutes, seconds;
    timerId = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('timer-display').textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerId);
            document.getElementById('alarm-sound').play();
        }
    }, 1000);
}
