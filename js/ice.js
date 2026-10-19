(function () {
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	const small = window.matchMedia("(max-width: 759px)").matches;
	const mobile = !fine || small;

	const bar = document.createElement("div");
	bar.className = "ice-progress";
	document.body.appendChild(bar);

	function onScroll() {
		const h = document.documentElement.scrollHeight - window.innerHeight;
		bar.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
	}

	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	if (!reduce && "IntersectionObserver" in window) {
		const sel =
			".work__intro, .about__intro, .about__statement, .about__stack, .services__intro, .process__intro, .contact__statement, .testimonials__hero";

		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.classList.add("ice-in");
						io.unobserve(e.target);
					}
				}),
			{ threshold: 0.15 },
		);

		document.querySelectorAll(sel).forEach((el) => {
			el.classList.add("ice-reveal");
			io.observe(el);
		});
	}

	if (reduce || mobile) return;

	const canvas = document.createElement("canvas");
	canvas.id = "ice-snow";
	document.body.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		canvas.remove();
		return;
	}

	let W = 0;
	let H = 0;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);

	function resize() {
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W * dpr;
		canvas.height = H * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	resize();
	window.addEventListener("resize", resize, { passive: true });

	const COUNT = 110;
	const flakes = [];

	function makeFlake(top) {
		const layer = Math.random();

		const r =
			layer < 0.7
				? 0.8 + Math.random() * 1.6
				: layer < 0.94
					? 2.4 + Math.random() * 1.8
					: 6 + Math.random() * 5;

		return {
			x: Math.random() * W,
			y: top ? -20 : Math.random() * H,
			r,
			vy: 0.25 + r * 0.16 + Math.random() * 0.3,
			sway: Math.random() * Math.PI * 2,
			swaySpeed: 0.004 + Math.random() * 0.01,
			rot: Math.random() * Math.PI,
			vr: (Math.random() - 0.5) * 0.01,
			a: r > 5 ? 0.55 : 0.35 + Math.random() * 0.45,
			big: r > 5,
		};
	}

	for (let i = 0; i < COUNT; i++) {
		flakes.push(makeFlake(false));
	}

	const sparks = [];

	function burst(x, y, n) {
		for (let i = 0; i < n; i++) {
			const a = Math.random() * Math.PI * 2;
			const s = 1 + Math.random() * 4.5;

			sparks.push({
				x,
				y,
				vx: Math.cos(a) * s,
				vy: Math.sin(a) * s - 0.6,
				life: 1,
				d: 0.016 + Math.random() * 0.02,
				r: 1 + Math.random() * 2.4,
				shard: Math.random() < 0.55,
				rot: Math.random() * 6,
			});
		}
	}

	function drawFlake(f) {
		ctx.save();
		ctx.translate(f.x, f.y);
		ctx.rotate(f.rot);
		ctx.globalAlpha = f.a;

		if (f.big) {
			ctx.strokeStyle = "rgba(214,238,252,1)";
			ctx.lineWidth = 1;
			ctx.lineCap = "round";
			ctx.shadowColor = "rgba(124,195,234,.9)";
			ctx.shadowBlur = 8;

			for (let i = 0; i < 6; i++) {
				ctx.rotate(Math.PI / 3);
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(0, f.r);
				ctx.moveTo(0, f.r * 0.55);
				ctx.lineTo(f.r * 0.3, f.r * 0.8);
				ctx.moveTo(0, f.r * 0.55);
				ctx.lineTo(-f.r * 0.3, f.r * 0.8);
				ctx.stroke();
			}
		} else {
			ctx.fillStyle = "#eef8ff";

			if (f.r > 2.2) {
				ctx.shadowColor = "rgba(124,195,234,.9)";
				ctx.shadowBlur = 6;
			}

			ctx.beginPath();
			ctx.arc(0, 0, f.r, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.restore();
	}

	const mouse = {
		x: -999,
		y: -999,
		px: -999,
		py: -999,
	};

	window.addEventListener(
		"mousemove",
		(e) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		},
		{ passive: true },
	);

	window.addEventListener("click", (e) => {
		burst(e.clientX, e.clientY, 22);
	});

	let t = 0;
	let lastTrail = 0;

	function frame(now) {
		t++;
		ctx.clearRect(0, 0, W, H);

		const wind = Math.sin(t * 0.004) * 0.35;

		for (const f of flakes) {
			f.sway += f.swaySpeed;
			f.x += Math.sin(f.sway) * 0.4 + wind * (0.4 + f.r * 0.1);
			f.y += f.vy;
			f.rot += f.vr;

			const dx = f.x - mouse.x;
			const dy = f.y - mouse.y;
			const d2 = dx * dx + dy * dy;

			if (d2 < 9000) {
				const d = Math.sqrt(d2) || 1;
				f.x += (dx / d) * 1.6;
				f.y += (dy / d) * 0.8;
			}

			if (f.y > H + 20 || f.x < -30 || f.x > W + 30) {
				Object.assign(f, makeFlake(true), {
					x: Math.random() * W,
				});
			}

			drawFlake(f);
		}

		if (
			now - lastTrail > 38 &&
			Math.abs(mouse.x - mouse.px) + Math.abs(mouse.y - mouse.py) > 6
		) {
			sparks.push({
				x: mouse.x,
				y: mouse.y,
				vx: (Math.random() - 0.5) * 0.7,
				vy: 0.3 + Math.random() * 0.6,
				life: 0.9,
				d: 0.025,
				r: 0.8 + Math.random() * 1.4,
				shard: false,
				rot: 0,
			});

			mouse.px = mouse.x;
			mouse.py = mouse.y;
			lastTrail = now;
		}

		for (let i = sparks.length - 1; i >= 0; i--) {
			const s = sparks[i];

			s.x += s.vx;
			s.y += s.vy;
			s.vy += 0.07;
			s.vx *= 0.985;
			s.life -= s.d;
			s.rot += 0.1;

			if (s.life <= 0) {
				sparks.splice(i, 1);
				continue;
			}

			ctx.save();
			ctx.globalAlpha = Math.max(0, s.life);
			ctx.translate(s.x, s.y);
			ctx.shadowColor = "rgba(124,195,234,1)";
			ctx.shadowBlur = 8;
			ctx.fillStyle = "#e6f6ff";

			if (s.shard) {
				ctx.rotate(s.rot);
				ctx.beginPath();
				ctx.moveTo(0, -s.r * 2.6);
				ctx.lineTo(s.r, 0);
				ctx.lineTo(0, s.r * 1.4);
				ctx.lineTo(-s.r, 0);
				ctx.closePath();
				ctx.fill();
			} else {
				ctx.beginPath();
				ctx.arc(0, 0, s.r, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.restore();
		}

		if (sparks.length > 260) {
			sparks.splice(0, sparks.length - 260);
		}

		requestAnimationFrame(frame);
	}

	requestAnimationFrame(frame);

	const flakeSvg = `<svg viewBox="-12 -12 24 24" fill="none" stroke="#eef8ff" stroke-width="1.4" stroke-linecap="round" aria-hidden="true">${[0, 60, 120, 180, 240, 300].map((a) => `<g transform="rotate(${a})"><path d="M0 0V-11M0 -6L-3 -9M0 -6L3 -9M0 -3.2L-2 -5M0 -3.2L2 -5"/></g>`).join("")}<circle r="1.4" fill="#eef8ff" stroke="none"/></svg>`;

	const cur = document.createElement("div");
	cur.className = "ice-cursor";
	cur.innerHTML = flakeSvg;

	const ring = document.createElement("div");
	ring.className = "ice-cursor__ring";

	document.body.append(ring, cur);
	document.documentElement.classList.add("has-ice-cursor");

	let cx = -100;
	let cy = -100;
	let rx = -100;
	let ry = -100;

	window.addEventListener(
		"mousemove",
		(e) => {
			cx = e.clientX;
			cy = e.clientY;

			cur.classList.add("is-on");
			ring.classList.add("is-on");

			const hot =
				e.target.closest &&
				e.target.closest(
					"a, button, input, textarea, label, select, [data-open-case], .work-project, .process__step, .services__item, .testimonial",
				);

			cur.classList.toggle("is-hover", !!hot);
			ring.classList.toggle("is-hover", !!hot);
		},
		{ passive: true },
	);

	window.addEventListener("mousedown", () => {
		cur.classList.add("is-down");
	});

	window.addEventListener("mouseup", () => {
		cur.classList.remove("is-down");
	});

	document.addEventListener("mouseleave", () => {
		cur.classList.remove("is-on");
		ring.classList.remove("is-on");
	});

	(function loop() {
		rx += (cx - rx) * 0.16;
		ry += (cy - ry) * 0.16;

		cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
		ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

		requestAnimationFrame(loop);
	})();
})();
