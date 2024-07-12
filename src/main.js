import OBR from '@owlbear-rodeo/sdk'
import '/src/style.css'

document.querySelector("#app").innerHTML= `
<div>
<button id="switch-btn">Create Wheel</button>
</div>
<div id="spin-div">
<div>
    <form id="upload">
        <input type="text" id="name" maxlenght="20">
        <input type="file" id="file" accept=".json">
        <button>Upload</button>    
    </form>
</div>
<br>

<div>
    <select id="wheels">
        <option value="">None</option>
    </select>
</div>
<div>
    <button id="open-btn">Open</button>
    <button id="save-btn">Download</button>
</div>
</div>
<div id="create-div" hidden>
    <input type="text" id="newName" maxlenght="20">
    <input type="number" id="sector_count" hidden></input>
    <input type="number" id="sector_id" value=1 hidden></input>
    <div id="sector_0" hidden>
        <input type="text" id="text" placeholder="text"></input>
        <br>
        <input type="text" id="fulltext" placeholder="fulltext"></input>
        <br>
        <input type="color" id="color"></input>
        <br>
        <select id="reaction">
            <option value="resting">Resting</option>
            <option value="dancing">Dancing</option>
            <option value="laughing">Laughing</option>
            <option value="shocked">Shocked</option>
        </select>
        <br>
        <button id="del-btn">delete</button>
    </div>
    <button id="add-btn">add</button>
    <button id="gen-btn">Generate</button>
</div>
`

 // @param reaction ['resting' | 'dancing' | 'laughing' | 'shocked'] Sets the reaper's animated reaction
OBR.onReady(() => {
    const select = document.getElementById('wheels')
    const open = document.getElementById('open-btn')
    const form = document.getElementById('upload')
    const file = document.getElementById('file')
    const name = document.getElementById('name')
    const switch_btn = document.getElementById('switch-btn')
    const add = document.getElementById('add-btn')
    const gen = document.getElementById('gen-btn')
    const save = document.getElementById('save-btn')

    save.addEventListener("click", () => {
        if (select.value != ''){
            const t = localStorage.getItem(select.value);
            //const jsonString = JSON.stringify(t);
            const blob = new Blob([t], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = select.value.slice(0, -2);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    gen.addEventListener("click", () => {
        const counter = document.getElementById('sector_count')
        const newName = document.getElementById('newName')
        const create_div = document.getElementById('create-div')
        if(counter.value != 0 && newName.value != ''){
            const k = create_div.children
            //console.log(k.length)
            let str = '{\n\t"prizes":['
            for (let t=0;t<k.length;t++){
                if (k[t].id.slice(0, 7) == "sector_" && k[t].id != "sector_0" && k[t].id != "sector_id" && k[t].id != "sector_count"){
                    let p = k[t].children
                    //console.log(k[t].id);
                    if (str.slice(-1) != '[')
                        str += ','
                    str += '\n\t\t{\n\t\t\t"text":"'+p[0].value+'",\n\t\t\t"fulltext":"'+p[2].value+'",\n\t\t\t"color":"'+p[4].value+'",\n\t\t\t"reaction":"'+p[6].value+'"\n\t\t}'
                }
            }
            str += '\n\t]\n}'
            localStorage.setItem(newName.value+"SW", str);
            let el = document.createElement("option")
            el.text = newName.value
            el.value = newName.value+"SW"
            el.id = el.value
            select.appendChild(el)
            select.value = el.value
            save.click()
            switch_btn.click()
        }
    });

    add.addEventListener("click", () => {
        let or = document.getElementById('sector_0')
        let sector_id = document.getElementById('sector_id')
        let sector_count = document.getElementById('sector_count')
        let el = or.cloneNode(true)
        el.id = 'sector_'+sector_id.value
        el.removeAttribute('hidden')
        el.childNodes[1].value = ""+sector_id.value
        el.childNodes[9].value = getRandomColor()
        const del_b = el.childNodes[17]
        del_b.addEventListener("click", (e) => {
            let sector_count = document.getElementById('sector_count')
            sector_count--    
            let parentDiv = e.target.parentElement;
            parentDiv.remove()
        });
        sector_id.value++
        sector_count.value++
        const tar = document.getElementById("create-div")
        tar.appendChild(el)
    });

    switch_btn.addEventListener("click", () => {
        if (switch_btn.textContent == "Create Wheel"){
            let a = document.getElementById('spin-div')
            a.setAttribute('hidden', '')
            let b = document.getElementById('create-div')
            b.removeAttribute('hidden')
            switch_btn.textContent = "Spin or Import Wheel"
        }
        else {
            let a = document.getElementById('spin-div')
            a.removeAttribute('hidden')
            let b = document.getElementById('create-div')
            b.setAttribute('hidden', '')
            switch_btn.textContent = "Create Wheel"
        }
    });

    for (let key in localStorage){
        if (key.slice(-2)=="SW"){
            let el = document.createElement("option")
            el.text = key.slice(0, key.length-2)
            el.value = key
            el.id = el.value
            select.appendChild(el)
        }
    }

    form.addEventListener('submit', handleSubmit)

    function handleSubmit(event){
        event.preventDefault();
        if (!file.value.length) return;
        let reader = new FileReader();
        reader.onload = logFile;
        reader.readAsText(file.files[0]);

    };

    function logFile (event) {
        let str = event.target.result;
        let json = JSON.parse(str);
        //console.log('string', str);
        //console.log('name', name.value);
        localStorage.setItem(name.value+"SW", str)
        let el = document.createElement("option")
        el.text = name.value
        el.value = name.value+"SW"
        el.id = el.value
        select.appendChild(el)  
    };

    open.addEventListener("click", () => {
        if (select.value != ''){
            localStorage.setItem("wheel", select.value);
            OBR.modal.open({
                id: "com.onrender.wheel/modal",
                url: "/src/wheel.html",
                hidePaper: true,
                hideBackdrop: true,
                fullScreen: true
            });
        }
    });
    
    OBR.broadcast.onMessage("com.onrender.wheel.spin", (event) => {
        const getName = (party) => {
            let name = 'unknown';
            for (let i = 0; i < party.length; i++){
                if (party[i].connectionId == event.connectionId){
                    name = party[i].name
                    break
                }
            }
            localStorage.setItem("tempWheel", event.data[1]);
            OBR.popover.open({
                id: "com.onrender.wheel/pop_wheel",
                url: "/src/wheel_viewer.html?"+("&rotation="+event.data[0])+("&wheel_owner="+encodeURIComponent(name)),
                hidePaper: true,
                //hideBackdrop: true,
                width: 400,
                height: 500,
                disableClickAway: true,
                anchorOrigin: {horizontal:"CENTER", vertical:"BOTTOM"},
                marginThreshold: 50
            });
        }
        OBR.party.getPlayers().then((party) => getName(party))
        
    });
});
