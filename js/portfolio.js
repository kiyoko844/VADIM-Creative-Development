document.addEventListener("DOMContentLoaded", () => {
	"use strict";

	const items = [...document.querySelectorAll(".work-item")];

	const preview = document.querySelector(".work-preview");
	const previewImage = document.getElementById("work-preview-image");
	const previewNumber = document.getElementById("work-preview-number");
	const previewName = document.getElementById("work-preview-name");
	const previewCurrent = document.getElementById("work-preview-current");
	const previewTotal = document.getElementById("work-preview-total");

	const modal = document.querySelector(".project-modal");
	const modalBackdrop = document.querySelector(".project-modal__backdrop");
	const modalWindow = document.querySelector(".project-modal__window");
	const modalClose = document.querySelector(".project-modal__close");

	const modalImage = document.getElementById("project-modal-image");
	const modalImageStage = document.querySelector(".project-modal__image");
	const modalImageLoader = document.querySelector(
		".project-modal__image-loader",
	);
	const modalImageCounter = document.querySelector(
		".project-modal__image-index",
	);
	const modalProjectCounter = document.querySelector(".project-modal__counter");
	const modalTitle = document.querySelector(".project-modal__title");
	const modalType = document.querySelector(".project-modal__type");
	const modalYear = document.querySelector(".project-modal__year");

	const modalPrevImage = document.querySelector(".project-modal__arrow--prev");
	const modalNextImage = document.querySelector(".project-modal__arrow--next");

	const thumbsContainer = document.querySelector(".project-thumbs");
	const prevProject = document.querySelector(".project-modal__prev");
	const nextProject = document.querySelector(".project-modal__next");
	const progress = document.querySelector(".project-modal__progress span");

	if (!items.length) return;

	const pad = (value) => String(value).padStart(2, "0");

	const projects = items.map((item, index) => {
		const images = (item.dataset.images || "")
			.split("|")
			.map((image) => image.trim())
			.filter(Boolean);

		return {
			index,
			element: item,
			number: item.dataset.number || pad(index + 1),
			name:
				item.dataset.name ||
				item.querySelector(".work-item__project")?.textContent.trim() ||
				"Untitled project",
			type:
				item.dataset.type ||
				item.querySelector(".work-item__type")?.textContent.trim() ||
				"",
			year:
				item.dataset.year ||
				item.querySelector(".work-item__year")?.textContent.trim() ||
				"",
			images,
		};
	});

	let activeProjectIndex = 0;
	let modalImageIndex = 0;
	let activePreviewProject = null;
	let previousFocus = null;
	let previewFrame = 0;
	let mouseX = window.innerWidth / 2;
	let mouseY = window.innerHeight / 2;
	let previewX = mouseX;
	let previewY = mouseY;
	let imageLoadToken = 0;
	let previewLoadToken = 0;
	let touchStartX = 0;
	let touchStartY = 0;
	let isTouchGesture = false;

	const imageCache = new Map();

	function preloadImage(source) {
		if (!source) return Promise.reject(new Error("Missing image source"));

		if (imageCache.has(source)) {
			return imageCache.get(source);
		}

		const promise = new Promise((resolve, reject) => {
			const image = new Image();

			image.onload = () => resolve(source);
			image.onerror = () => reject(new Error(`Unable to load: ${source}`));
			image.src = source;

			if (image.complete && image.naturalWidth > 0) {
				resolve(source);
			}
		});

		imageCache.set(source, promise);

		promise.catch(() => {
			imageCache.delete(source);
		});

		return promise;
	}

	function warmImageCache(project, index) {
		if (!project || !project.images.length) return;

		const source = project.images[index];

		if (source) preloadImage(source).catch(() => {});

		const nextSource = project.images[index + 1];

		if (nextSource) preloadImage(nextSource).catch(() => {});
	}

	function updateActiveProject(index) {
		if (!projects[index]) return;

		activeProjectIndex = index;

		items.forEach((item, itemIndex) => {
			const active = itemIndex === index;

			item.classList.toggle("is-active", active);

			if (active) {
				item.setAttribute("aria-current", "true");
			} else {
				item.removeAttribute("aria-current");
			}
		});

		const project = projects[index];
		const currentNumber = document.querySelector(
			".work-sidebar__current-number",
		);
		const currentName = document.querySelector(".work-sidebar__current-name");

		if (currentNumber) currentNumber.textContent = project.number;
		if (currentName) currentName.textContent = project.name;
	}

	function positionPreview() {
		if (!preview || window.innerWidth <= 800) return;

		const previewWidth = preview.offsetWidth || 340;
		const previewHeight = preview.offsetHeight || 260;
		const gap = 22;

		let x = mouseX + gap;
		let y = mouseY + gap;

		if (x + previewWidth > window.innerWidth - 12) {
			x = mouseX - previewWidth - gap;
		}

		if (y + previewHeight > window.innerHeight - 12) {
			y = mouseY - previewHeight - gap;
		}

		x = Math.max(12, Math.min(x, window.innerWidth - previewWidth - 12));
		y = Math.max(12, Math.min(y, window.innerHeight - previewHeight - 12));

		previewX += (x - previewX) * 0.18;
		previewY += (y - previewY) * 0.18;

		document.documentElement.style.setProperty("--preview-x", `${previewX}px`);
		document.documentElement.style.setProperty("--preview-y", `${previewY}px`);

		if (Math.abs(x - previewX) > 0.5 || Math.abs(y - previewY) > 0.5) {
			previewFrame = requestAnimationFrame(positionPreview);
		} else {
			previewFrame = 0;
		}
	}

	function requestPreviewPosition() {
		if (!preview || window.innerWidth <= 800 || previewFrame) return;
		previewFrame = requestAnimationFrame(positionPreview);
	}

	document.addEventListener(
		"mousemove",
		(event) => {
			mouseX = event.clientX;
			mouseY = event.clientY;

			if (activePreviewProject) requestPreviewPosition();
		},
		{ passive: true },
	);

	function updatePreviewImage() {
		if (!activePreviewProject || !previewImage) return;

		const project = activePreviewProject;
		const source = project.images[0];

		if (!source) return;

		const token = ++previewLoadToken;

		previewImage.style.opacity = "0";

		preloadImage(source)
			.then(() => {
				if (token !== previewLoadToken) return;
				if (activePreviewProject !== project) return;

				previewImage.src = source;
				previewImage.alt = project.name;
				previewImage.style.opacity = "1";

				if (previewCurrent) previewCurrent.textContent = "01";

				if (previewTotal) {
					previewTotal.textContent = pad(project.images.length);
				}
			})
			.catch(() => {
				if (token !== previewLoadToken) return;

				previewImage.removeAttribute("src");
				previewImage.alt = `${project.name} — image unavailable`;
				previewImage.style.opacity = "1";
			});
	}

	function showPreview(project) {
		if (
			window.innerWidth <= 800 ||
			!preview ||
			!project ||
			!project.images.length ||
			modal?.classList.contains("is-open")
		) {
			return;
		}

		activePreviewProject = project;

		if (previewNumber) previewNumber.textContent = project.number;
		if (previewName) previewName.textContent = project.name;

		updatePreviewImage();

		preview.classList.add("is-visible");
		requestPreviewPosition();
	}

	function hidePreview() {
		activePreviewProject = null;
		previewLoadToken++;

		if (preview) preview.classList.remove("is-visible");

		if (previewFrame) {
			cancelAnimationFrame(previewFrame);
			previewFrame = 0;
		}
	}

	function updateModalImage() {
		const project = projects[activeProjectIndex];

		if (!project || !project.images.length || !modalImage) return;

		const source = project.images[modalImageIndex];
		const token = ++imageLoadToken;

		modalImage.style.opacity = "0";

		if (modalImageLoader) {
			modalImageLoader.hidden = false;
			modalImageLoader.style.display = "grid";
		}

		if (modalImageCounter) {
			modalImageCounter.textContent = `${pad(modalImageIndex + 1)} / ${pad(project.images.length)}`;
		}

		if (thumbsContainer) {
			[...thumbsContainer.querySelectorAll(".project-thumb")].forEach(
				(thumb, index) => {
					const active = index === modalImageIndex;

					thumb.classList.toggle("is-active", active);

					if (active) {
						thumb.setAttribute("aria-current", "true");
						thumb.scrollIntoView({
							behavior: "smooth",
							block: "nearest",
							inline: "nearest",
						});
					} else {
						thumb.removeAttribute("aria-current");
					}
				},
			);
		}

		preloadImage(source)
			.then(() => {
				if (token !== imageLoadToken) return;

				modalImage.src = source;
				modalImage.alt = `${project.name} — image ${modalImageIndex + 1}`;
				modalImage.style.opacity = "1";

				if (modalImageLoader) {
					modalImageLoader.style.display = "none";
				}
			})
			.catch(() => {
				if (token !== imageLoadToken) return;

				modalImage.removeAttribute("src");
				modalImage.alt = `${project.name} — image unavailable`;

				if (modalImageLoader) {
					modalImageLoader.style.display = "none";
				}
			});

		warmImageCache(project, modalImageIndex);
	}

	function renderThumbnails(project) {
		if (!thumbsContainer) return;

		const fragment = document.createDocumentFragment();

		project.images.forEach((source, index) => {
			const button = document.createElement("button");
			const image = document.createElement("img");

			button.className = "project-thumb";
			button.type = "button";
			button.dataset.imageIndex = String(index);
			button.setAttribute(
				"aria-label",
				`Show image ${index + 1} of ${project.name}`,
			);

			image.src = source;
			image.alt = "";
			image.loading = index < 4 ? "eager" : "lazy";
			image.decoding = "async";

			button.appendChild(image);
			fragment.appendChild(button);
		});

		thumbsContainer.replaceChildren(fragment);
	}

	function updateModalContent() {
		const project = projects[activeProjectIndex];

		if (!project) return;

		if (modalProjectCounter) {
			modalProjectCounter.textContent = `${project.number} / ${pad(projects.length)}`;
		}

		if (modalTitle) modalTitle.textContent = project.name;
		if (modalType) modalType.textContent = project.type;
		if (modalYear) modalYear.textContent = project.year;

		renderThumbnails(project);

		if (progress) {
			progress.style.width = `${((activeProjectIndex + 1) / projects.length) * 100}%`;
		}

		updateModalImage();
	}

	function openModal(index) {
		const project = projects[index];

		if (!project || !modal) return;

		previousFocus = document.activeElement;
		activeProjectIndex = index;
		modalImageIndex = 0;

		updateActiveProject(index);
		updateModalContent();
		hidePreview();

		modal.classList.add("is-open");
		modal.setAttribute("aria-hidden", "false");
		document.body.classList.add("modal-open");

		if (modalClose) {
			modalClose.focus({ preventScroll: true });
		} else if (modalWindow) {
			modalWindow.focus({ preventScroll: true });
		}
	}

	function closeModal() {
		if (!modal || !modal.classList.contains("is-open")) return;

		modal.classList.remove("is-open");
		modal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("modal-open");

		imageLoadToken++;

		if (previousFocus && typeof previousFocus.focus === "function") {
			previousFocus.focus({ preventScroll: true });
		}
	}

	function changeModalImage(direction) {
		const project = projects[activeProjectIndex];

		if (!project || project.images.length <= 1) return;

		modalImageIndex =
			(modalImageIndex + direction + project.images.length) %
			project.images.length;

		updateModalImage();
	}

	function changeProject(direction) {
		activeProjectIndex =
			(activeProjectIndex + direction + projects.length) % projects.length;

		modalImageIndex = 0;

		updateActiveProject(activeProjectIndex);
		updateModalContent();
	}

	items.forEach((item, index) => {
		item.addEventListener("mouseenter", () => {
			updateActiveProject(index);
			showPreview(projects[index]);
		});

		item.addEventListener("mouseleave", hidePreview);

		item.addEventListener("focus", () => {
			updateActiveProject(index);
		});

		item.addEventListener("click", () => {
			openModal(index);
		});

		item.addEventListener("keydown", (event) => {
			if (event.target !== item) return;

			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				openModal(index);
			}
		});
	});

	if (modalClose) {
		modalClose.addEventListener("click", closeModal);
	}

	if (modalBackdrop) {
		modalBackdrop.addEventListener("click", closeModal);
	}

	if (modalWindow) {
		modalWindow.addEventListener("click", (event) => {
			event.stopPropagation();
		});

		modalWindow.addEventListener("keydown", (event) => {
			if (event.key !== "Tab") return;

			const focusable = [
				...modalWindow.querySelectorAll(
					'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
				),
			].filter((element) => element.getClientRects().length > 0);

			if (!focusable.length) {
				event.preventDefault();
				modalWindow.focus();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		});
	}

	if (modalPrevImage) {
		modalPrevImage.addEventListener("click", (event) => {
			event.preventDefault();
			changeModalImage(-1);
		});
	}

	if (modalNextImage) {
		modalNextImage.addEventListener("click", (event) => {
			event.preventDefault();
			changeModalImage(1);
		});
	}

	if (thumbsContainer) {
		thumbsContainer.addEventListener("click", (event) => {
			const button = event.target.closest(".project-thumb");

			if (!button || !thumbsContainer.contains(button)) return;

			const index = Number(button.dataset.imageIndex);
			const project = projects[activeProjectIndex];

			if (
				!project ||
				!Number.isInteger(index) ||
				index < 0 ||
				index >= project.images.length
			) {
				return;
			}

			modalImageIndex = index;
			updateModalImage();
		});
	}

	if (prevProject) {
		prevProject.addEventListener("click", () => changeProject(-1));
	}

	if (nextProject) {
		nextProject.addEventListener("click", () => changeProject(1));
	}

	if (modalImageStage) {
		modalImageStage.addEventListener(
			"touchstart",
			(event) => {
				const touch = event.changedTouches[0];

				touchStartX = touch.clientX;
				touchStartY = touch.clientY;
				isTouchGesture = true;
			},
			{ passive: true },
		);

		modalImageStage.addEventListener(
			"touchend",
			(event) => {
				if (!isTouchGesture) return;

				isTouchGesture = false;

				const touch = event.changedTouches[0];
				const diffX = touch.clientX - touchStartX;
				const diffY = touch.clientY - touchStartY;

				if (Math.abs(diffX) < 45 || Math.abs(diffX) < Math.abs(diffY)) {
					return;
				}

				changeModalImage(diffX < 0 ? 1 : -1);
			},
			{ passive: true },
		);
	}

	document.addEventListener("keydown", (event) => {
		if (!modal?.classList.contains("is-open")) return;

		if (event.key === "Escape") {
			event.preventDefault();
			closeModal();
			return;
		}

		if (event.key === "ArrowLeft") {
			event.preventDefault();
			changeModalImage(-1);
		}

		if (event.key === "ArrowRight") {
			event.preventDefault();
			changeModalImage(1);
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			changeProject(-1);
		}

		if (event.key === "ArrowDown") {
			event.preventDefault();
			changeProject(1);
		}
	});

	window.addEventListener(
		"resize",
		() => {
			if (window.innerWidth <= 800) {
				hidePreview();
				return;
			}

			if (activePreviewProject) requestPreviewPosition();
		},
		{ passive: true },
	);

	projects.forEach((project) => {
		if (project.images[0]) {
			preloadImage(project.images[0]).catch(() => {});
		}
	});

	updateActiveProject(0);
});
