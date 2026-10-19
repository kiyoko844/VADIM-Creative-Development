document.addEventListener("DOMContentLoaded", () => {
	const workProjects = document.querySelectorAll(".work-project");
	const previewImages = document.querySelectorAll(".work-preview-image");

	const previewCurrent = document.querySelector(".work__preview-current");
	const previewTotal = document.querySelector(".work__preview-total");
	const previewTitle = document.querySelector(".work__preview-title");
	const previewDescription = document.querySelector(
		".work__preview-description",
	);
	const previewOpen = document.querySelector(".work__preview-open");

	const caseStudy = document.getElementById("caseStudy");
	const caseWindow = caseStudy?.querySelector(".case-study__window");
	const caseClose = caseStudy?.querySelector(".case-study__close");
	const caseOverlay = caseStudy?.querySelector(".case-study__overlay");

	const caseNumber = caseStudy?.querySelector(".case-study__number");
	const caseCount = caseStudy?.querySelector(".case-study__count");
	const caseTitle = caseStudy?.querySelector(".case-study__title");
	const caseDescription = caseStudy?.querySelector(".case-study__description");
	const caseStats = caseStudy?.querySelectorAll(".case-study__stat strong");
	const caseGallery = caseStudy?.querySelector(".case-study__gallery");

	const projects = [
		{
			title: "ATELIER 17",
			description: "Creative restaurant",
			number: "01",
			pages: "8 pages",
			stats: ["8", "8", "2026", "HTML / CSS / JS"],
			images: [
				["./images/ATELIER/ATELIER-01.webp", "Home"],
				["./images/ATELIER/ATELIER-02.webp", "Menu"],
				["./images/ATELIER/ATELIER-03.webp", "Seasonal"],
				["./images/ATELIER/ATELIER-04.webp", "About"],
				["./images/ATELIER/ATELIER-05.webp", "Atmosphere"],
				["./images/ATELIER/ATELIER-06.webp", "Home"],
				["./images/ATELIER/ATELIER-07.webp", "Kitchen"],
				["./images/ATELIER/ATELIER-08.webp", "Contact"],
			],
		},

		{
			title: "AUREL — Fine Fragrance",
			description: "Perfume / Fragrance",
			number: "02",
			pages: "11 pages",
			stats: ["11", "11", "2026", "HTML / CSS / JS"],
			images: [
				["./images/Aurel/Aurel-01.webp", "Home"],
				["./images/Aurel/Aurel-02.webp", "Our philosophy"],
				["./images/Aurel/Aurel-03.webp", "Featured fragrances"],
				["./images/Aurel/Aurel-04.webp", "Collections"],
				["./images/Aurel/Aurel-05.webp", "The craft"],
				["./images/Aurel/Aurel-06.webp", "Journal"],
				["./images/Aurel/Aurel-07.webp", "Journal"],
				["./images/Aurel/Aurel-08.webp", "Scent Finder"],
				["./images/Aurel/Aurel-09.webp", "Scent Finder"],
				["./images/Aurel/Aurel-10.webp", "Private notes"],
				["./images/Aurel/Aurel-11.webp", "End note"],
			],
		},

		{
			title: "NØRTH OBJECT",
			description: "Contemporary Fashion",
			number: "03",
			pages: "12 pages",
			stats: ["12", "12", "2026", "HTML / CSS / JS"],
			images: [
				["./images/NORTH/North-01.webp", "Home"],
				["./images/NORTH/North-02.webp", "Editorial"],
				["./images/NORTH/North-03.webp", "Shop by mood"],
				["./images/NORTH/North-04.webp", "Men"],
				["./images/NORTH/North-05.webp", "Women"],
				["./images/NORTH/North-06.webp", "New arrivals"],
				["./images/NORTH/North-07.webp", "Campaign"],
				["./images/NORTH/North-08.webp", "Lookbook"],
				["./images/NORTH/North-09.webp", "Selected brands"],
				["./images/NORTH/North-10.webp", "Journal"],
				["./images/NORTH/North-11.webp", "Contact"],
			],
		},

		{
			title: "KORI ARENA",
			description: "Computer Club",
			number: "04",
			pages: "7 pages",
			stats: ["7", "7", "2026", "HTML / CSS / JS"],
			images: [
				["./images/KORI-Arena/KORI-01.webp", "Home"],
				["./images/KORI-Arena/KORI-02.webp", "About"],
				["./images/KORI-Arena/KORI-03.webp", "Rooms"],
				["./images/KORI-Arena/KORI-04.webp", "Room"],
				["./images/KORI-Arena/KORI-05.webp", "PC5"],
				["./images/KORI-Arena/KORI-06.webp", "Fridge"],
				["./images/KORI-Arena/KORI-07.webp", "Price"],
			],
		},
	];

	let previousBodyOverflow = "";
	let previouslyFocusedElement = null;

	function setPreview(index) {
		const project = projects[index];

		if (!project) return;

		workProjects.forEach((item, itemIndex) => {
			item.classList.toggle("is-active", itemIndex === index);
		});

		if (previewTitle) {
			previewTitle.textContent = project.title;
		}

		if (previewDescription) {
			previewDescription.textContent = project.description;
		}

		if (previewCurrent) {
			previewCurrent.textContent = "01";
		}

		if (previewTotal) {
			previewTotal.textContent = String(
				Math.max(project.images.length, 1),
			).padStart(2, "0");
		}

		previewImages.forEach((image) => {
			image.classList.toggle(
				"is-active",
				image.dataset.project === String(index),
			);
		});

		if (previewOpen) {
			previewOpen.dataset.openCase = index;
		}
	}

	function openCaseStudy(index) {
		const project = projects[index];

		if (!project || !caseStudy) return;

		previouslyFocusedElement = document.activeElement;

		if (caseNumber) {
			caseNumber.textContent = project.number;
		}

		if (caseCount) {
			caseCount.textContent = project.pages;
		}

		if (caseTitle) {
			caseTitle.textContent = project.title;
		}

		if (caseDescription) {
			caseDescription.textContent = project.description;
		}

		caseStats?.forEach((stat, index) => {
			stat.textContent = project.stats[index] || "—";
		});

		if (caseGallery) {
			caseGallery.innerHTML = project.images
				.map(
					([src, title], index) => `
						<figure class="case-study__image">
							<img
								src="${src}"
								alt="${project.title} ${title}"
							/>

							<figcaption>
								<span>${String(index + 1).padStart(2, "0")}</span>
								<span>${title}</span>
							</figcaption>
						</figure>
					`,
				)
				.join("");
		}

		previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		caseStudy.classList.add("is-open");
		caseStudy.setAttribute("aria-hidden", "false");

		if (caseWindow) {
			caseWindow.scrollTop = 0;
		}

		const caseContent = caseStudy.querySelector(".case-study__content");

		if (caseContent) {
			caseContent.scrollTop = 0;
		}
	}

	function closeCaseStudy() {
		if (!caseStudy) return;

		previouslyFocusedElement?.focus();

		caseStudy.classList.remove("is-open");
		caseStudy.setAttribute("aria-hidden", "true");
		document.body.style.overflow = previousBodyOverflow;

		previouslyFocusedElement = null;
	}

	workProjects.forEach((project, index) => {
		project.addEventListener("mouseenter", () => setPreview(index));
		project.addEventListener("click", () => openCaseStudy(index));
	});

	previewOpen?.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();

		openCaseStudy(Number(previewOpen.dataset.openCase || 0));
	});

	caseClose?.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();

		closeCaseStudy();
	});

	caseOverlay?.addEventListener("click", closeCaseStudy);

	caseWindow?.addEventListener("click", (event) => {
		event.stopPropagation();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && caseStudy?.classList.contains("is-open")) {
			closeCaseStudy();
		}
	});

	setPreview(0);
});
