import OBR from '@owlbear-rodeo/sdk'
  const str = localStorage.getItem("tempWheel");
  let wheelJson = JSON.parse(str);
  let i = 0;
  function nextI() {
    i += 1;
    return i;
  }
  
  function getRandomColor() {
    let r, g, b, brightness;
    do {
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
      brightness = (r * 299 + g * 587 + b * 114) / 1000;
    } while (brightness < 60 || brightness > 200);
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }
  
  const defaultValues = {
    text: 1,
    fulltext: "Nothing :)",
    reaction: "resting",
    color: "green",
    fraction: 1
  };
  
  function process() {
    let prizes = [];
    for (let sector of wheelJson["prizes"]) {
      let newSector = structuredClone(defaultValues);
      for (let key of Object.keys(defaultValues)) {
          if (sector[key] !== undefined){
            newSector[key] = sector[key];
          } else {
            if (key === "text")
              newSector[key] = nextI();
            else if (key === "color")
              newSector[key] = getRandomColor();
            else
              newSector[key] = defaultValues[key]; 
          }
      }
      prizes.push(newSector);
    }
    return prizes;
  }

  let prizes = process();


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
    const fontSize = (-0.0186 * prizes.length + 1.9721)/2;
    prizes.forEach(({ text, color, reaction }, i) => {
      const rotation = ((prizeSlice * i) * -1) - prizeOffset;
      
      spinner.insertAdjacentHTML(
        "beforeend",
        `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg; font-size: ${fontSize}rem;">
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
      url: "/src/popover.html?"+("&msg="+selected)+("&own=false"),
      height: 300,
      width: 300,
      anchorOrigin: {horizontal: "RIGHT", vertical: "BOTTOM"},
      transformOrigin: {horizontal: "RIGHT", vertical: "BOTTOM"},
      hidePaper: true,
      marginThreshold: 50
    });
  };
  
  const spoilerPrize = () => {
    const selected = Math.floor(rotation % 360 / prizeSlice);
    let histLogs = localStorage.getItem('history/'+OBR.room.id)
    if (histLogs == null) 
      histLogs = '{"logs":[' + JSON.stringify({time: Date.now(), fulltext: prizes[selected].fulltext, color: "rgba(68, 236, 143, 0.87)", owner: localStorage.getItem("tempWheelOwner")})
    else{
      histLogs = histLogs.slice(0, -2)
      histLogs += "," + JSON.stringify({time: Date.now(), fulltext: prizes[selected].fulltext, color: "rgba(68, 236, 143, 0.87)", owner: localStorage.getItem("tempWheelOwner")})
    }
    localStorage.setItem('history/'+OBR.room.id, histLogs + "]}")
  };

  window.addEventListener("load", () => {
    if (reaper.dataset.reaction !== "resting") {
      reaper.dataset.reaction = "resting";
    }
  
    trigger.disabled = true;
    const urlp=[];let s=location.toString().split('?');s=s[1].split('&');for(let i=0;i<s.length;i++){let u=s[i].split('=');urlp[u[0]]=u[1];}
    rotation = urlp['rotation'];
    spoilerPrize();
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
    localStorage.removeItem("wheel")
    localStorage.removeItem("tempWheel")
    localStorage.removeItem("tempWheelOwner")
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
  