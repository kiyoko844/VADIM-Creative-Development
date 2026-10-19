const processSteps = document.querySelectorAll(".process__step");

const processCurrent = document.querySelector("#process-current");
const processNumber = document.querySelector("#process-number");
const processLabel = document.querySelector("#process-label");
const processTitle = document.querySelector("#process-title");
const processText = document.querySelector("#process-text");

const processData = {
	en: [
		{
			label: "01 / DISCOVER",
			title: "START WITH THE IDEA.",
			text: "UNDERSTAND THE PURPOSE, DEFINE THE DIRECTION AND BUILD A CLEAR FOUNDATION FOR THE PROJECT.",
		},
		{
			label: "02 / DESIGN",
			title: "GIVE IT A DIRECTION.",
			text: "BUILD THE VISUAL LANGUAGE, STRUCTURE THE CONTENT AND CREATE A CLEAR DIGITAL EXPERIENCE.",
		},
		{
			label: "03 / DEVELOP",
			title: "TURN DESIGN INTO CODE.",
			text: "BRING THE INTERFACE TO LIFE WITH CLEAN HTML, CSS AND JAVASCRIPT.",
		},
		{
			label: "04 / REFINE",
			title: "POLISH EVERY DETAIL.",
			text: "IMPROVE MOTION, INTERACTION, RESPONSIVENESS AND THE SMALL DETAILS THAT COMPLETE THE EXPERIENCE.",
		},
	],

	ru: [
		{
			label: "01 / ИССЛЕДОВАНИЕ",
			title: "НАЧИНАЕМ С ИДЕИ.",
			text: "ПОНИМАЕМ ЦЕЛЬ, ОПРЕДЕЛЯЕМ НАПРАВЛЕНИЕ И СОЗДАЁМ ПОНЯТНУЮ ОСНОВУ ДЛЯ ПРОЕКТА.",
		},
		{
			label: "02 / ДИЗАЙН",
			title: "ЗАДАЁМ НАПРАВЛЕНИЕ.",
			text: "СОЗДАЁМ ВИЗУАЛЬНЫЙ ЯЗЫК, ВЫСТРАИВАЕМ КОНТЕНТ И ФОРМИРУЕМ ПОНЯТНЫЙ ЦИФРОВОЙ ОПЫТ.",
		},
		{
			label: "03 / РАЗРАБОТКА",
			title: "ПРЕВРАЩАЕМ ДИЗАЙН В КОД.",
			text: "ОЖИВЛЯЕМ ИНТЕРФЕЙС С ПОМОЩЬЮ ЧИСТОГО HTML, CSS И JAVASCRIPT.",
		},
		{
			label: "04 / ДОРАБОТКА",
			title: "ДОВОДИМ КАЖДУЮ ДЕТАЛЬ.",
			text: "УЛУЧШАЕМ АНИМАЦИЮ, ВЗАИМОДЕЙСТВИЕ, АДАПТИВНОСТЬ И МЕЛКИЕ ДЕТАЛИ, КОТОРЫЕ ЗАВЕРШАЮТ ОПЫТ.",
		},
	],
};

let activeProcess = 0;
let processTimer = null;

function updateProcess(index, animate = true) {
	const language = localStorage.getItem("language") || "en";

	const languageData = processData[language] || processData.en;

	if (!processSteps[index] || !languageData[index]) {
		return;
	}

	if (
		index === activeProcess &&
		processSteps[index].classList.contains("is-active") &&
		animate
	) {
		return;
	}

	activeProcess = index;

	processSteps.forEach((step, stepIndex) => {
		step.classList.toggle("is-active", stepIndex === index);
	});

	const data = languageData[index];

	const animatedElements = [
		processNumber,
		processLabel,
		processTitle,
		processText,
	].filter(Boolean);

	if (animate) {
		animatedElements.forEach((element) => {
			element.style.opacity = "0";
		});
	}

	const updateContent = () => {
		if (processNumber) {
			processNumber.textContent = String(index + 1).padStart(2, "0");
		}

		if (processCurrent) {
			processCurrent.textContent = String(index + 1).padStart(2, "0");
		}

		if (processLabel) {
			processLabel.textContent = data.label;
		}

		if (processTitle) {
			processTitle.textContent = data.title;
		}

		if (processText) {
			processText.textContent = data.text;
		}

		animatedElements.forEach((element) => {
			element.style.opacity = "1";
		});
	};

	if (animate) {
		setTimeout(updateContent, 140);
	} else {
		updateContent();
	}
}

document.addEventListener("languageChanged", () => {
	updateProcess(activeProcess, false);
});

processSteps.forEach((step, index) => {
	step.addEventListener("mouseenter", () => {
		clearTimeout(processTimer);

		processTimer = setTimeout(() => {
			updateProcess(index);
		}, 40);
	});

	step.addEventListener("focus", () => {
		updateProcess(index);
	});

	step.addEventListener("click", () => {
		updateProcess(index);
	});
});

const processSection = document.querySelector(".process");

if (
	processSection &&
	!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
	window.matchMedia("(pointer: fine)").matches
) {
	const processVisualNumber = processSection.querySelector(
		".process__visual-number",
	);

	if (processVisualNumber) {
		let animationFrame = null;

		processSection.addEventListener("mousemove", (event) => {
			if (animationFrame) {
				return;
			}

			animationFrame = requestAnimationFrame(() => {
				const rect = processSection.getBoundingClientRect();

				const x = (event.clientX - rect.left) / rect.width - 0.5;

				const y = (event.clientY - rect.top) / rect.height - 0.5;

				processVisualNumber.style.transform = `translate(calc(-50% + ${
					x * 18
				}px), calc(-52% + ${y * 12}px))`;

				animationFrame = null;
			});
		});

		processSection.addEventListener("mouseleave", () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
				animationFrame = null;
			}

			processVisualNumber.style.transform = "translate(-50%, -52%)";
		});
	}
}

if (processSection) {
	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	if (!reduceMotion) {
		const revealElements = [
			processSection.querySelector(".process__intro"),
			processSection.querySelector(".process__content"),
			processSection.querySelector(".process__bottom"),
		].filter(Boolean);

		revealElements.forEach((element, index) => {
			element.style.opacity = "0";
			element.style.transform = "translateY(35px)";

			element.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${
				index * 0.1
			}s,
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
		});

		const processObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}

					entry.target.style.opacity = "1";
					entry.target.style.transform = "translateY(0)";

					observer.unobserve(entry.target);
				});
			},
			{
				threshold: 0.12,
			},
		);

		revealElements.forEach((element) => {
			processObserver.observe(element);
		});
	}
}

updateProcess(0, false);
