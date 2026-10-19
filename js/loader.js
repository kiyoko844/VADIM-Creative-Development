document.addEventListener("DOMContentLoaded", () => {
	const loader = document.getElementById("siteLoader");

	if (!loader) {
		return;
	}

	setTimeout(() => {
		loader.classList.add("is-exiting");

		setTimeout(() => {
			loader.classList.add("is-hidden");
		}, 650);
	}, 1600);
});
