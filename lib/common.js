// Random color generator
function getColor() {
	return (
		"#" +
		Math.random()
			.toString(16)
			.slice(2, 8)
	);
}
