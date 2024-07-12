import OBR from '@owlbear-rodeo/sdk'
/**
 * Prize data will space out evenly on the deal wheel based on the amount of items available.
 * @param text [string] name of the prize
 * @param color [string] background color of the prize
 * @param reaction ['resting' | 'dancing' | 'laughing' | 'shocked'] Sets the reaper's animated reaction
 */
  let prizes = [];
  
  const str = localStorage.getItem("wheel");
  prizes = JSON.parse(str)["prizes"];


  const wheel = document.querySelector(".deal-wheel");
  const spinner = wheel.querySelector(".spinner");
  const trigger = wheel.querySelector(".btn-spin");
  const closer = wheel.querySelector(".btn-close");
  const ticker = wheel.querySelector(".ticker");
  const reaper = wheel.querySelector(".grim-reaper");
  const prizeSlice = 360 / prizes.length;
  const prizeOffset = Math.floor(180 / prizes.length);
  const spinClass = "is-spinning";
  const selectedClass = "selected";
  const spinnerStyles = window.getComputedStyle(spinner);
  let tickerAnim;
  let rotation = 0;
  let currentSlice = 0;
  let prizeNodes;
  
  const createPrizeNodes = () => {
    prizes.forEach(({ text, color, reaction }, i) => {
      const rotation = ((prizeSlice * i) * -1) - prizeOffset;
      
      spinner.insertAdjacentHTML(
        "beforeend",
        `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
          <span class="text">${text}</span>
        </li>`
      );
    });
  };
  
  const createConicGradient = () => {
    spinner.setAttribute(
      "style",
      `background: conic-gradient(
        from -90deg,
        ${prizes
          .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
          .reverse()
        }
      );`
    );
  };
  
  
  const setupWheel = () => {
    createConicGradient();
    createPrizeNodes();
    prizeNodes = wheel.querySelectorAll(".prize");
  };
  
  const spinertia = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const runTickerAnimation = () => {
    // https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
    const a = values[0];
    const b = values[1];  
    let rad = Math.atan2(b, a);
    
    if (rad < 0) rad += (2 * Math.PI);
    
    const angle = Math.round(rad * (180 / Math.PI));
    const slice = Math.floor(angle / prizeSlice);
  
    if (currentSlice !== slice) {
      ticker.style.animation = "none";
      setTimeout(() => ticker.style.animation = null, 10);
      currentSlice = slice;
    }
  
    tickerAnim = requestAnimationFrame(runTickerAnimation);
  };
  
  const selectPrize = () => {
    const selected = Math.floor(rotation / prizeSlice);
    prizeNodes[selected].classList.add(selectedClass);
    reaper.dataset.reaction = prizeNodes[selected].dataset.reaction;
    OBR.popover.open({
      id: "com.onrender.wheel/pop",
      url: "/src/popover.html?"+("&msg="+encodeURIComponent(prizes[selected].fulltext)),
      height: 300,
      width: 300,
      anchorOrigin: {horizontal: "RIGHT", vertical: "BOTTOM"},
      transformOrigin: {horizontal: "RIGHT", vertical: "BOTTOM"},
      hidePaper: true,
      marginThreshold: 50
    });
  };
  
  window.addEventListener("load", () => {
    if (reaper.dataset.reaction !== "resting") {
      reaper.dataset.reaction = "resting";
    }
  
    trigger.disabled = true;
    const urlp=[];let s=location.toString().split('?');s=s[1].split('&');for(let i=0;i<s.length;i++){let u=s[i].split('=');urlp[u[0]]=u[1];}
    rotation = urlp['rotation'];
    
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
    wheel.classList.add(spinClass);
    spinner.style.setProperty("--rotate", rotation);
    ticker.style.animation = "none";
    runTickerAnimation();
  });
  
  closer.addEventListener("click", ()=> {
    trigger.disabled = true;
    closer.disabled = true;
    OBR.popover.close("com.onrender.wheel/pop_wheel")
  })

  spinner.addEventListener("transitionend", () => {
    cancelAnimationFrame(tickerAnim);
    trigger.disabled = false;
    trigger.focus();
    rotation %= 360;
    selectPrize();
    wheel.classList.remove(spinClass);
    spinner.style.setProperty("--rotate", rotation);
  });
  
  setupWheel();
  