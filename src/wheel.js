import OBR from '@owlbear-rodeo/sdk'

  let prizes = [
    { 
      text: "Nothing",
      fulltext: "Big ol' nothing",
      color: "hsl(43 74% 66%)",
      reaction: "shocked" 
    }
  ];
  const str = localStorage.getItem(localStorage.getItem("wheel"));
  prizes = JSON.parse(str)["prizes"];
    

  const wheel = document.querySelector(".deal-wheel");
  const spinner = wheel.querySelector(".spinner");
  const trigger = wheel.querySelector(".btn-spin");
  const soloTrigger = wheel.querySelector(".btn-solo-spin");
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
          <span class="text"></span>
        </li>`
      );
      let prize = document.getElementsByClassName('prize')[i];
      prize.textContent = text;
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
      url: "/src/popover.html?"+("&msg="+selected)+("&own=true"),
      height: 300,
      width: 300,
      anchorOrigin: {horizontal: "RIGHT", vertical: "CENTER"},
      transformOrigin: {horizontal: "RIGHT", vertical: "CENTER"},
      hidePaper: true,
      marginThreshold: 100
    });
  };
  
  const spoilerPrize = (stealth = false) => {
    const selected = Math.floor(rotation % 360 / prizeSlice);
    let histLogs = localStorage.getItem('history/'+OBR.room.id)
    if (histLogs == null) 
      histLogs = '{"logs":[' + JSON.stringify({time: Date.now(), fulltext: prizes[selected].fulltext, color: stealth ? "rgba(200, 192, 122, 0.87)" : "rgba(255, 247, 136, 0.87)"})
    else{
      histLogs = histLogs.slice(0, -2)
      histLogs += "," + JSON.stringify({time: Date.now(), fulltext: prizes[selected].fulltext, color: stealth ? "rgba(200, 192, 122, 0.87)" : "rgba(255, 247, 136, 0.87)"})
    }
    localStorage.setItem('history/'+OBR.room.id, histLogs + "]}")
  };

  trigger.addEventListener("click", () => {
    if (reaper.dataset.reaction !== "resting") {
      reaper.dataset.reaction = "resting";
    }
  
    trigger.disabled = true;
    soloTrigger.disabled = true;
    rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
    OBR.broadcast.sendMessage("com.onrender.wheel.spin", [""+rotation, str]);
    spoilerPrize();
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
    wheel.classList.add(spinClass);
    spinner.style.setProperty("--rotate", rotation);
    ticker.style.animation = "none";
    runTickerAnimation();
  });
  
  closer.addEventListener("click", ()=> {
    trigger.disabled = true;
    soloTrigger.disabled = true;
    closer.disabled = true;
    OBR.modal.close("com.onrender.wheel/modal")
    localStorage.removeItem("wheel")
  })

  spinner.addEventListener("transitionend", () => {
    cancelAnimationFrame(tickerAnim);
    trigger.disabled = false;
    soloTrigger.disabled = false;
    trigger.focus();
    rotation %= 360;
    selectPrize();
    wheel.classList.remove(spinClass);
    spinner.style.setProperty("--rotate", rotation);
  });
  
  soloTrigger.addEventListener("click", () => {
    if (reaper.dataset.reaction !== "resting") {
      reaper.dataset.reaction = "resting";
    }
  
    trigger.disabled = true;
    soloTrigger.disabled = true;
    rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
    spoilerPrize(true);
    //OBR.broadcast.sendMessage("com.onrender.wheel.spin", [""+rotation, str]);
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
    wheel.classList.add(spinClass);
    spinner.style.setProperty("--rotate", rotation);
    ticker.style.animation = "none";
    runTickerAnimation();
  });

  setupWheel();

  