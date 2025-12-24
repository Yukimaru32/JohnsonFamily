(() => {
    const root = document.querySelector("[data-carousel]");
    if (!root) return; // only runs on homepage
  
    const imgEl = root.querySelector("[data-carousel-img]");
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const dotsWrap = root.querySelector("[data-carousel-dots]");
  
    // Update these paths to match your real photos
    const images = [
      "images/family1.jpg",
      "images/family2.jpg",
      "images/family3.jpg",
    ];
  
    let index = 0;
  
    function renderDots() {
      dotsWrap.innerHTML = "";
      images.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dot";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", `Photo ${i + 1}`);
        b.setAttribute("aria-selected", String(i === index));
        b.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(b);
      });
    }
  
    function setActiveDot() {
      const dots = dotsWrap.querySelectorAll(".dot");
      dots.forEach((d, i) => d.setAttribute("aria-selected", String(i === index)));
    }
  
    function swapImage(newIndex) {
      index = (newIndex + images.length) % images.length;
  
      // Smooth swap
      imgEl.style.opacity = "0";
      imgEl.style.transition = "opacity 160ms ease";
  
      const nextSrc = images[index];
      const preload = new Image();
      preload.onload = () => {
        imgEl.src = nextSrc;
        requestAnimationFrame(() => (imgEl.style.opacity = "1"));
        setActiveDot();
      };
      preload.src = nextSrc;
    }
  
    function next() { swapImage(index + 1); }
    function prev() { swapImage(index - 1); }
    function goTo(i) { swapImage(i); }
  
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
  
    // Keyboard support (when page is focused)
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });
  
    // Init
    imgEl.src = images[index];
    renderDots();
  })();