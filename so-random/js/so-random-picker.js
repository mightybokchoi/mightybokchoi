function chooseRandomly() {
	choices = document.getElementById("random-items").value.split("\n");
	if (choices.length == 0) return;
	document.getElementById("random-answer").value = choices[Math.floor(Math.random() * choices.length)];
}