// Random color generator
function getColor() {
	return (
		"#" +
		Math.random()
			.toString(16)
			.slice(2, 8)
	);
}

// Current date string generator `YYYY-MM-DD`
function getDateString() {
	var now = new Date();
	var month = (now.getMonth() + 1);
	var day = now.getDate();
	if (month < 10)
		month = "0" + month;
	if (day < 10)
		day = "0" + day;
	return (now.getFullYear() + '-' + month + '-' + day);
}
