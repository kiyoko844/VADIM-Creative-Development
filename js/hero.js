const hero = document.querySelector(".hero");
const canvas = document.querySelector("#main-canvas");
const backgroundImage = document.querySelector(".hero__background-image");

const cursor = document.querySelector("#custom-cursor");
const circleSymbol = document.querySelector("#circle-symbol");

const outroInfo = document.querySelector("#outro-info");
const outroButton = document.querySelector("#outro-buy");
const caption = document.querySelector(".hero__caption");

const isTouchDevice = window.matchMedia(
	"(hover: none), (pointer: coarse)",
).matches;

const symbols = ["❄", "❅", "❆", "✦", "✧"];

let mouseX = window.innerWidth / 2;
let lastScrollTime = 0;

/* =========================================
   BACKGROUND IMAGE
========================================= */

function showBackground() {
	if (!canvas || !backgroundImage) {
		return;
	}

	if (backgroundImage.complete) {
		canvas.classList.add("is-loaded");
		return;
	}

	backgroundImage.addEventListener(
		"load",
		() => {
			canvas.classList.add("is-loaded");
		},
		{ once: true },
	);

	backgroundImage.addEventListener(
		"error",
		() => {
			console.warn("Failed to load hero background:", backgroundImage.src);

			canvas.classList.add("is-loaded");
		},
		{ once: true },
	);
}

showBackground();

/* =========================================
   CUSTOM CURSOR
========================================= */

function updateMousePosition(event) {
	mouseX = event.clientX;

	if (!cursor) {
		return;
	}

	cursor.style.left = `${event.clientX}px`;
	cursor.style.top = `${event.clientY}px`;

	cursor.classList.add("is-visible");
}

if (!isTouchDevice) {
	window.addEventListener("mousemove", updateMousePosition);
}

/* =========================================
   HERO UI
========================================= */

function updateHeroUI() {
	if (isTouchDevice) {
		outroInfo?.classList.remove("is-hidden");
		outroButton?.classList.remove("is-hidden");
		caption?.classList.remove("is-hidden");
		cursor?.classList.add("is-hidden");
		return;
	}

	const scrollY = window.scrollY;
	const isScrolled = scrollY > 20;

	if (outroInfo) {
		outroInfo.classList.toggle("is-hidden", isScrolled);
	}

	if (outroButton) {
		outroButton.classList.toggle("is-hidden", isScrolled);
	}

	if (caption) {
		caption.classList.toggle("is-hidden", isScrolled);
	}

	if (cursor) {
		cursor.classList.toggle("is-hidden", isScrolled);
	}

	if (circleSymbol) {
		const now = performance.now();

		if (now - lastScrollTime > 80) {
			const randomIndex = Math.floor(Math.random() * symbols.length);

			circleSymbol.textContent = symbols[randomIndex];

			lastScrollTime = now;
		}
	}
}

window.addEventListener("scroll", updateHeroUI, {
	passive: true,
});

/* =========================================
   RESIZE
========================================= */

window.addEventListener("resize", () => {
	mouseX = window.innerWidth / 2;
});

/* =========================================
   INITIALIZATION
========================================= */

updateHeroUI();
