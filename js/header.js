const headerMenuButton = document.querySelector("#header-menu-button");
const headerMenu = document.querySelector("#header-menu");
const headerMenuLinks = document.querySelectorAll(".header__menu-link");

if (headerMenuButton && headerMenu) {
	function openHeaderMenu() {
		headerMenu.classList.add("is-open");
		headerMenuButton.classList.add("is-active");

		headerMenuButton.setAttribute("aria-expanded", "true");
		headerMenu.setAttribute("aria-hidden", "false");

		document.body.classList.add("menu-open");
	}

	function closeHeaderMenu() {
		headerMenu.classList.remove("is-open");
		headerMenuButton.classList.remove("is-active");

		headerMenuButton.setAttribute("aria-expanded", "false");
		headerMenu.setAttribute("aria-hidden", "true");

		document.body.classList.remove("menu-open");
	}

	function toggleHeaderMenu() {
		if (headerMenu.classList.contains("is-open")) {
			closeHeaderMenu();
		} else {
			openHeaderMenu();
		}
	}

	headerMenuButton.addEventListener("click", toggleHeaderMenu);

	headerMenuLinks.forEach((link) => {
		link.addEventListener("click", closeHeaderMenu);
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && headerMenu.classList.contains("is-open")) {
			closeHeaderMenu();
		}
	});

	headerMenu.addEventListener("click", (event) => {
		if (event.target === headerMenu) {
			closeHeaderMenu();
		}
	});
}
