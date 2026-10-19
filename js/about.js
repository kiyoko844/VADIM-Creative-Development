const aboutSection = document.querySelector(".about");

if (aboutSection) {
	const aboutTitle = aboutSection.querySelector(".about__title");
	const aboutIntro = aboutSection.querySelector(".about__intro");
	const aboutMiddle = aboutSection.querySelector(".about__middle");
	const aboutBottom = aboutSection.querySelector(".about__bottom");
	const aboutStackItems = aboutSection.querySelectorAll(
		".about__stack-list > div",
	);

	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	const revealElements = [
		aboutTitle,
		aboutIntro,
		aboutMiddle,
		aboutBottom,
	].filter(Boolean);

	if (!reduceMotion) {
		revealElements.forEach((element, index) => {
			element.style.opacity = "0";
			element.style.setProperty("--about-reveal-y", "40px");

			element.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s,
				transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
		});

		aboutStackItems.forEach((item, index) => {
			item.style.opacity = "0";
			item.style.setProperty("--about-reveal-x", "-20px");

			item.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s,
				transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`;
		});

		const aboutObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}

					entry.target.style.opacity = "1";

					entry.target.style.setProperty("--about-reveal-y", "0px");

					entry.target.style.setProperty("--about-reveal-x", "0px");

					observer.unobserve(entry.target);
				});
			},
			{
				threshold: 0.15,
			},
		);

		revealElements.forEach((element) => {
			aboutObserver.observe(element);
		});

		aboutStackItems.forEach((item) => {
			aboutObserver.observe(item);
		});
	}

	if (
		aboutTitle &&
		!reduceMotion &&
		window.matchMedia("(pointer: fine)").matches
	) {
		let animationFrame = null;

		aboutSection.addEventListener("mousemove", (event) => {
			if (animationFrame) {
				return;
			}

			animationFrame = requestAnimationFrame(() => {
				const rect = aboutSection.getBoundingClientRect();

				const x = (event.clientX - rect.left) / rect.width - 0.5;

				const y = (event.clientY - rect.top) / rect.height - 0.5;

				aboutTitle.style.setProperty("--about-x", `${x * 8}px`);

				aboutTitle.style.setProperty("--about-y", `${y * 5}px`);

				animationFrame = null;
			});
		});

		aboutSection.addEventListener("mouseleave", () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
				animationFrame = null;
			}

			aboutTitle.style.setProperty("--about-x", "0px");
			aboutTitle.style.setProperty("--about-y", "0px");
		});
	}
}
