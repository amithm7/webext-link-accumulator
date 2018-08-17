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

// Unique ID generator - UUID / GUID
// https://stackoverflow.com/a/2117523/3861350
// https://www.ietf.org/rfc/rfc4122.txt
function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function(c) {
		return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
	});
}

// Unique ID generator - Simpler
function ID() {
	return Math.random().toString(36).substr(2, 9);
}
