document.addEventListener("DOMContentLoaded", () => {
	const modal = document.getElementById("contactModal");
	const form = document.getElementById("contactForm");
	const status = document.getElementById("contactFormStatus");

	if (!modal) return;

	/*
	 * ========================================
	 * OPEN / CLOSE MODAL
	 * ========================================
	 */

	const openModal = () => {
		modal.classList.add("is-open");
		modal.setAttribute("aria-hidden", "false");

		document.body.classList.add("contact-modal-open");

		// Put focus into the first field
		setTimeout(() => {
			const nameInput = document.getElementById("contactName");

			if (nameInput) {
				nameInput.focus();
			}
		}, 300);
	};

	const closeModal = () => {
		const activeElement = document.activeElement;

		if (modal.contains(activeElement)) {
			activeElement.blur();
		}

		modal.classList.remove("is-open");
		modal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("contact-modal-open");
	};

	/*
	 * ========================================
	 * OPEN BUTTON
	 * ========================================
	 *
	 * Works with:
	 *
	 * <a href="mailto:..." class="contact__cta">
	 *
	 * So we don't need to change your existing HTML.
	 */

	const contactButtons = document.querySelectorAll(".contact__cta");

	contactButtons.forEach((button) => {
		button.addEventListener("click", (event) => {
			event.preventDefault();

			openModal();
		});
	});

	/*
	 * ========================================
	 * CLOSE BUTTON / OVERLAY
	 * ========================================
	 */

	const closeButtons = modal.querySelectorAll("[data-contact-close]");

	closeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			closeModal();
		});
	});

	/*
	 * ========================================
	 * ESC KEY
	 * ========================================
	 */

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && modal.classList.contains("is-open")) {
			closeModal();
		}
	});

	/*
	 * ========================================
	 * FORM
	 * ========================================
	 */

	if (!form) return;

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(form);

		const name = formData.get("name")?.trim();
		const contact = formData.get("contact")?.trim();
		const message = formData.get("message")?.trim();

		/*
		 * Honeypot
		 * If this field is filled, it's probably a bot.
		 */

		const honeypot = formData.get("website");

		if (honeypot) {
			return;
		}

		/*
		 * Basic validation
		 */

		if (!name || !contact || !message) {
			showStatus("Please fill in all fields.", "error");

			return;
		}

		/*
		 * ========================================
		 * TELEGRAM
		 * ========================================
		 *
		 * We'll put your Cloudflare Worker URL here
		 * later.
		 */

		const WORKER_URL =
			"https://rough-rice-5893portfolio-contact.k8hv2jwv4z.workers.dev";

		/*
		 * Prevent sending before Telegram
		 * is connected.
		 */

		if (WORKER_URL === "YOUR_CLOUDFLARE_WORKER_URL") {
			showStatus("The contact form is not connected yet.", "error");

			return;
		}

		/*
		 * Disable button while sending
		 */

		const submitButton = form.querySelector(".contact-form__submit");

		const submitText = submitButton?.querySelector("span");

		if (submitButton) {
			submitButton.disabled = true;
		}

		if (submitText) {
			submitText.textContent = "SENDING...";
		}

		try {
			const response = await fetch(WORKER_URL, {
				method: "POST",

				headers: {
					"Content-Type": "application/json",
				},

				body: JSON.stringify({
					name,
					contact,
					message,
				}),
			});

			if (!response.ok) {
				throw new Error("Request failed");
			}

			/*
			 * Success
			 */

			showStatus("Message sent successfully. Thank you!", "success");

			form.reset();

			/*
			 * Close modal after a short delay
			 */

			setTimeout(() => {
				closeModal();

				setTimeout(() => {
					status.textContent = "";
					status.classList.remove("is-visible");
				}, 400);
			}, 1800);
		} catch (error) {
			console.error("Contact form error:", error);

			showStatus("Something went wrong. Please try again.", "error");
		} finally {
			if (submitButton) {
				submitButton.disabled = false;
			}

			if (submitText) {
				submitText.textContent = "SEND MESSAGE";
			}
		}
	});

	/*
	 * ========================================
	 * STATUS MESSAGE
	 * ========================================
	 */

	function showStatus(message, type) {
		if (!status) return;

		status.textContent = message;

		status.classList.add("is-visible");

		status.dataset.status = type;
	}
});
