const serviceItems = document.querySelectorAll(".services__item");

const serviceTitle = document.querySelector("#services-title");

const serviceText = document.querySelector("#services-text");

const serviceCurrent = document.querySelector("#services-current");

const serviceIndex = document.querySelector("#services-index");

const serviceData = {
	en: [
		{
			title: "WEB DESIGN",
			text: "CREATING VISUAL SYSTEMS THAT GIVE A DIGITAL PRODUCT ITS OWN CHARACTER.",
		},
		{
			title: "FRONT-END",
			text: "TURNING VISUAL CONCEPTS INTO FAST, RESPONSIVE AND PRECISE INTERFACES.",
		},
		{
			title: "INTERACTION",
			text: "ADDING MOTION, MICRO-INTERACTIONS AND DETAILS THAT MAKE INTERFACES FEEL ALIVE.",
		},
		{
			title: "RESPONSIVE",
			text: "BUILDING EXPERIENCES THAT REMAIN CLEAR, FAST AND CONSISTENT ON EVERY SCREEN.",
		},
	],

	ru: [
		{
			title: "ВЕБ-ДИЗАЙН",
			text: "СОЗДАЮ ВИЗУАЛЬНЫЕ СИСТЕМЫ, КОТОРЫЕ ПРИДАЮТ ЦИФРОВОМУ ПРОДУКТУ СОБСТВЕННЫЙ ХАРАКТЕР.",
		},
		{
			title: "FRONT-END",
			text: "ПРЕВРАЩАЮ ВИЗУАЛЬНЫЕ КОНЦЕПЦИИ В БЫСТРЫЕ, АДАПТИВНЫЕ И ТОЧНЫЕ ИНТЕРФЕЙСЫ.",
		},
		{
			title: "ВЗАИМОДЕЙСТВИЕ",
			text: "ДОБАВЛЯЮ АНИМАЦИЮ, МИКРОВЗАИМОДЕЙСТВИЯ И ДЕТАЛИ, КОТОРЫЕ ОЖИВЛЯЮТ ИНТЕРФЕЙС.",
		},
		{
			title: "АДАПТИВ",
			text: "СОЗДАЮ ИНТЕРФЕЙСЫ, КОТОРЫЕ ОСТАЮТСЯ ПОНЯТНЫМИ, БЫСТРЫМИ И ПОСЛЕДОВАТЕЛЬНЫМИ НА ЛЮБОМ ЭКРАНЕ.",
		},
	],
};

let activeService = 0;
let serviceTimer = null;

function updateService(index, animate = true) {
	const language = localStorage.getItem("language") || "en";

	const languageData = serviceData[language] || serviceData.en;

	if (!serviceItems[index] || !languageData[index]) {
		return;
	}

	if (
		index === activeService &&
		serviceItems[index].classList.contains("is-active") &&
		animate
	) {
		return;
	}

	activeService = index;

	serviceItems.forEach((item, itemIndex) => {
		item.classList.toggle("is-active", itemIndex === index);
	});

	const service = languageData[index];

	if (serviceTitle) {
		if (animate) {
			serviceTitle.style.opacity = "0";

			setTimeout(() => {
				serviceTitle.textContent = service.title;

				serviceTitle.style.opacity = "1";
			}, 140);
		} else {
			serviceTitle.textContent = service.title;

			serviceTitle.style.opacity = "1";
		}
	}

	if (serviceText) {
		if (animate) {
			serviceText.style.opacity = "0";

			setTimeout(() => {
				serviceText.textContent = service.text;

				serviceText.style.opacity = "1";
			}, 140);
		} else {
			serviceText.textContent = service.text;

			serviceText.style.opacity = "1";
		}
	}

	if (serviceCurrent) {
		serviceCurrent.textContent = String(index + 1).padStart(2, "0");
	}

	if (serviceIndex) {
		serviceIndex.textContent = String(index + 1).padStart(2, "0");
	}
}

document.addEventListener("languageChanged", () => {
	updateService(activeService, false);
});

serviceItems.forEach((item, index) => {
	item.addEventListener("mouseenter", () => {
		clearTimeout(serviceTimer);

		serviceTimer = setTimeout(() => {
			updateService(index);
		}, 40);
	});

	item.addEventListener("focus", () => {
		updateService(index);
	});

	item.addEventListener("click", () => {
		updateService(index);
	});
});

const servicesSection = document.querySelector(".services");

if (
	servicesSection &&
	window.matchMedia("(pointer: fine)").matches &&
	!window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
	const servicesTitle = servicesSection.querySelector(".services__title");

	if (servicesTitle) {
		let animationFrame = null;

		servicesSection.addEventListener("mousemove", (event) => {
			if (animationFrame) {
				return;
			}

			animationFrame = requestAnimationFrame(() => {
				const rect = servicesSection.getBoundingClientRect();

				const x = (event.clientX - rect.left) / rect.width - 0.5;

				const y = (event.clientY - rect.top) / rect.height - 0.5;

				servicesTitle.style.transform = `translate3d(${x * 8}px, ${
					y * 5
				}px, 0)`;

				animationFrame = null;
			});
		});

		servicesSection.addEventListener("mouseleave", () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);

				animationFrame = null;
			}

			servicesTitle.style.transform = "translate3d(0, 0, 0)";
		});
	}
}

updateService(0, false);
