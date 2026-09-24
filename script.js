(() => {
  const loading = document.getElementById("loading");
  const scene1 = document.getElementById("scene1");
  const scene2 = document.getElementById("scene2");
  const moon = document.getElementById("moon");
  const heartFrame = document.getElementById("heartFrame");
  const space = document.getElementById("space");
  const textCloud = document.getElementById("textCloud");
  const floatLanterns = document.getElementById("floatLanterns");
  const dragHint = document.querySelector(".drag-hint");

  // ---------- Stars ----------
  function createStars(container, count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = Math.random() * 2.2 + 0.6;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.setProperty("--d", 2 + Math.random() * 4 + "s");
      s.style.setProperty("--delay", Math.random() * 3 + "s");
      container.appendChild(s);
    }
  }

  createStars(document.getElementById("stars1"), 80);
  createStars(document.getElementById("stars2"), 120);

  // ---------- Loading → Scene 1 ----------
  setTimeout(() => {
    loading.classList.add("hidden");
    scene1.classList.remove("hidden");
  }, 2200);

  // ---------- Long-press on moon ----------
  let holdTimer = null;
  let holding = false;
  const HOLD_MS = 850;

  function startHold(e) {
    e.preventDefault();
    if (holding) return;
    holding = true;
    heartFrame.classList.add("pressed");

    holdTimer = setTimeout(() => {
      goToScene2();
    }, HOLD_MS);
  }

  function endHold() {
    if (!holding) return;
    holding = false;
    heartFrame.classList.remove("pressed");
    clearTimeout(holdTimer);
  }

  moon.addEventListener("pointerdown", startHold);
  moon.addEventListener("pointerup", endHold);
  moon.addEventListener("pointerleave", endHold);
  moon.addEventListener("pointercancel", endHold);
  // prevent context menu
  moon.addEventListener("contextmenu", (e) => e.preventDefault());

  // ---------- Scene 2 content ----------
  const phrases = [
    { t: "Trung thu vui vẻ", cls: "pink" },
    { t: "Iu em nhiều lắm", cls: "purple" },
    { t: "Trung thu vui vẻ", cls: "cyan" },
    { t: "Iu em nhiều lắm", cls: "white" },
    { t: "Trung thu vui vẻ", cls: "gold" },
    { t: "Iu em nhiều lắm", cls: "pink" },
    { t: "Trung thu vui vẻ", cls: "purple" },
    { t: "Iu em nhiều lắm", cls: "cyan" },
  ];

  function populateTexts() {
    textCloud.innerHTML = "";
    const total = 48;
    for (let i = 0; i < total; i++) {
      const p = phrases[i % phrases.length];
      const el = document.createElement("div");
      el.className = "float-text " + p.cls;
      el.textContent = p.t;

      const size = 0.75 + Math.random() * 1.1;
      el.style.fontSize = size + "rem";
      el.style.left = Math.random() * 110 - 5 + "%";
      el.style.top = Math.random() * 110 - 5 + "%";
      el.style.setProperty("--z", (Math.random() * 200 - 80) + "px");
      el.style.setProperty("--tx", (Math.random() * 80 - 40) + "px");
      el.style.setProperty("--ty", (Math.random() * 60 - 50) + "px");
      el.style.setProperty("--r", (Math.random() * 20 - 10) + "deg");
      el.style.setProperty("--dur", 10 + Math.random() * 14 + "s");
      el.style.setProperty("--delay", -Math.random() * 10 + "s");
      el.style.opacity = 0.45 + Math.random() * 0.5;

      textCloud.appendChild(el);
    }
  }

  function populateLanterns() {
    floatLanterns.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const l = document.createElement("div");
      l.className = "f-lantern";
      l.style.left = 8 + Math.random() * 84 + "%";
      l.style.top = 10 + Math.random() * 70 + "%";
      l.style.transform = `scale(${0.6 + Math.random() * 0.7})`;
      l.style.animationDelay = Math.random() * 4 + "s";
      l.style.animationDuration = 6 + Math.random() * 5 + "s";
      floatLanterns.appendChild(l);
    }
  }

  function goToScene2() {
    endHold();
    populateTexts();
    populateLanterns();

    // expand effect
    heartFrame.style.transition = "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s";
    heartFrame.style.transform = "scale(3.5)";
    heartFrame.style.opacity = "0";

    setTimeout(() => {
      scene1.classList.add("hidden");
      scene2.classList.remove("hidden");
      // reset for possible future (not needed)
      heartFrame.style.transform = "";
      heartFrame.style.opacity = "";
    }, 550);

    setTimeout(() => {
      dragHint.classList.add("fade");
    }, 4500);
  }

  // ---------- 3D drag rotate ----------
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let rotX = 8, rotY = 0;
  const maxRot = 28;

  function onPointerDown(e) {
    isDragging = true;
    lastX = e.clientX ?? e.touches?.[0]?.clientX;
    lastY = e.clientY ?? e.touches?.[0]?.clientY;
    space.style.transition = "none";
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    if (x == null) return;

    const dx = x - lastX;
    const dy = y - lastY;
    lastX = x;
    lastY = y;

    rotY += dx * 0.12;
    rotX -= dy * 0.12;
    rotX = Math.max(-maxRot, Math.min(maxRot, rotX));
    rotY = Math.max(-maxRot * 1.4, Math.min(maxRot * 1.4, rotY));

    space.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function onPointerUp() {
    isDragging = false;
    space.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
    // gentle settle
    rotX *= 0.75;
    rotY *= 0.75;
    space.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  scene2.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  // initial tilt
  space.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
})();
