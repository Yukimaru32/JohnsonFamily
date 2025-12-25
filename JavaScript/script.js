(() => {
    const root = document.querySelector("[data-carousel]");
    if (!root) return; // only runs on homepage
  
    const imgEl = root.querySelector("[data-carousel-img]");
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const dotsWrap = root.querySelector("[data-carousel-dots]");
  
    // Update these paths to match your real photos
    const images = [
      "images/Johnsonphoto1.jpg",
      "images/Johnsonphoto2.jpg",
      "images/Johnsonphoto3.jpg",
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

    async function loadSLCForecast() {
      const grid = document.querySelector("[data-weather-grid]");
      const updatedEl = document.querySelector("[data-weather-updated]");
      if (!grid || !updatedEl) return;
    
      // Salt Lake City coordinates
      const lat = 40.7608;
      const lon = -111.8910;
    
      // Open-Meteo (no key required)
      const url =
        "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${lat}&longitude=${lon}` +
        "&daily=temperature_2m_max,temperature_2m_min,weathercode" +
        "&temperature_unit=fahrenheit" +
        "&timezone=America%2FDenver";
    
      try {
        updatedEl.textContent = "Loading…";
    
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
    
        const data = await res.json();
    
        const days = data.daily.time;
        const maxT = data.daily.temperature_2m_max;
        const minT = data.daily.temperature_2m_min;
        const codes = data.daily.weathercode;
    
        const dow = (iso) =>
          new Date(iso + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });
    
        const codeText = (code) => {
          // very small mapping (you can expand later)
          if (code === 0) return "Clear";
          if ([1, 2, 3].includes(code)) return "Cloudy";
          if ([45, 48].includes(code)) return "Fog";
          if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
          if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
          if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
          if ([80, 81, 82].includes(code)) return "Showers";
          if ([95, 96, 99].includes(code)) return "Thunder";
          return `Code ${code}`;
        };
    
        grid.innerHTML = days.slice(0, 7).map((d, i) => `
          <div class="weather-day">
            <p class="weather-dow">${dow(d)}</p>
            <p class="weather-temp">
              <strong>${Math.round(maxT[i])}°</strong> / ${Math.round(minT[i])}°
            </p>
            <p class="weather-code">${codeText(codes[i])}</p>
          </div>
        `).join("");
    
        updatedEl.textContent = `Updated: ${new Date().toLocaleString()}`;
      } catch (err) {
        console.error(err);
        updatedEl.textContent = "Couldn’t load forecast.";
        grid.innerHTML = "";
      }
    }
    
    // run on page load
    loadSLCForecast();
  })();

