const contactSection = document.querySelector(".contact");

if (contactSection) {
	const contactContent = contactSection.querySelector(".contact__content");
	const contactBottom = contactSection.querySelector(".contact__bottom");
	const contactStatement = contactSection.querySelector(".contact__statement");
	const contactCta = contactSection.querySelector(".contact__cta");

	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	if (!reduceMotion) {
		const revealElements = [contactContent, contactBottom].filter(Boolean);

		revealElements.forEach((element, index) => {
			element.style.opacity = "0";
			element.style.transform = "translateY(40px)";
			element.style.transition = `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s,
			transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`;
		});

		const observer = new IntersectionObserver(
			(entries, observerInstance) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}

					entry.target.style.opacity = "1";
					entry.target.style.transform = "translateY(0)";

					observerInstance.unobserve(entry.target);
				});
			},
			{
				threshold: 0.15,
			},
		);

		revealElements.forEach((element) => {
			observer.observe(element);
		});
	}

	if (
		contactSection &&
		contactStatement &&
		!reduceMotion &&
		window.matchMedia("(pointer: fine)").matches
	) {
		let animationFrame = null;

		contactSection.addEventListener("mousemove", (event) => {
			if (animationFrame) {
				return;
			}

			animationFrame = requestAnimationFrame(() => {
				const rect = contactSection.getBoundingClientRect();

				const x = (event.clientX - rect.left) / rect.width - 0.5;

				const y = (event.clientY - rect.top) / rect.height - 0.5;

				contactStatement.style.transform = `translate3d(${x * 8}px, ${y * 5}px, 0)`;

				animationFrame = null;
			});
		});

		contactSection.addEventListener("mouseleave", () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
				animationFrame = null;
			}

			contactStatement.style.transform = "translate3d(0, 0, 0)";
		});
	}

	if (contactCta && !reduceMotion) {
		contactCta.addEventListener("mousemove", (event) => {
			if (!window.matchMedia("(pointer: fine)").matches) {
				return;
			}

			const rect = contactCta.getBoundingClientRect();

			const x = (event.clientX - rect.left) / rect.width - 0.5;

			const y = (event.clientY - rect.top) / rect.height - 0.5;

			const arrow = contactCta.querySelector("strong");

			if (arrow) {
				arrow.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0) rotate(45deg)`;
			}
		});

		contactCta.addEventListener("mouseleave", () => {
			const arrow = contactCta.querySelector("strong");

			if (arrow) {
				arrow.style.transform = "translate3d(0, 0, 0)";
			}
		});
	}
}
