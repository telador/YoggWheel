import OBR from '@owlbear-rodeo/sdk'
import '/src/style.css'
let app = document.querySelector("#app");
app.innerHTML= `
<div class="app-panel panel">
    <button class="create-wheel btn-cr" style="min-width: 150px">Create Wheel</button>
    <div class="delete-sure-panel">
        <input class="delete-sure-input" type="text" maxlenght="7" placeholder="Type DETETE to confirm">
        <button class="delete-sure btn-cr">I'm sure.</button>
    </div>
    <input class="name-input" type="text" maxlength="20" placeholder="Wheel Name" />
    <input class="file-input" type="file" accept=".json" />
    <button class="upload-button btn-cr">Upload</button>
    <select class="wheel-select">
        <option value="">None</option>
    </select>
    <button class="open-wheel btn-cr">Open</button>
    <button class="download-wheel btn-cr">Download</button>
    <button class="edit-wheel btn-cr">Edit</button>
    <button class="delete-wheel btn-cr">Delete</button>
</div>
<div class="create-panel panel" style="display: none;">
    <button class="create-wheel btn-cr" style="min-width: 150px">Spin Wheel</button>
    <input class="name-input" type="text" maxlength="20" placeholder="Wheel Name" />
    <input type="number" id="sector_count" value=0 hidden></input>
    <input type="number" id="sector_id" value=1 hidden></input>
    <div class="sector" style="display:none">
        <input class="text-input" type="text" placeholder="text"></input>
        <input class="fulltext-input" type="text" placeholder="fulltext"></input>
        <input class="color-input" type="color"></input>
        <select class="reaction-select">
            <option value="resting">Resting</option>
            <option value="dancing">Dancing</option>
            <option value="laughing">Laughing</option>
            <option value="shocked">Shocked</option>
        </select>
        <button class="delete-sector btn-cr">
<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.7069 7.79289C19.0974 8.18342 19.0974 8.81658 18.7069 9.20711L15.914 12L18.7069 14.7929C19.0974 15.1834 19.0974 15.8166 18.7069 16.2071C18.3163 16.5976 17.6832 16.5976 17.2926 16.2071L14.4998 13.4142L11.7069 16.2071C11.3163 16.5976 10.6832 16.5976 10.2926 16.2071C9.90212 15.8166 9.90212 15.1834 10.2926 14.7929L13.0855 12L10.2926 9.20711C9.90212 8.81658 9.90212 8.18342 10.2926 7.79289C10.6832 7.40237 11.3163 7.40237 11.7069 7.79289L14.4998 10.5858L17.2926 7.79289C17.6832 7.40237 18.3163 7.40237 18.7069 7.79289Z" fill="#fff788"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.30958 3.54424C7.06741 2.56989 8.23263 2 9.46699 2H20.9997C21.8359 2 22.6103 2.37473 23.1614 2.99465C23.709 3.61073 23.9997 4.42358 23.9997 5.25V18.75C23.9997 19.5764 23.709 20.3893 23.1614 21.0054C22.6103 21.6253 21.8359 22 20.9997 22H9.46699C8.23263 22 7.06741 21.4301 6.30958 20.4558L0.687897 13.2279C0.126171 12.5057 0.126169 11.4943 0.687897 10.7721L6.30958 3.54424ZM9.46699 4C8.84981 4 8.2672 4.28495 7.88829 4.77212L2.2666 12L7.88829 19.2279C8.2672 19.7151 8.84981 20 9.46699 20H20.9997C21.2244 20 21.4674 19.9006 21.6665 19.6766C21.8691 19.4488 21.9997 19.1171 21.9997 18.75V5.25C21.9997 4.88294 21.8691 4.5512 21.6665 4.32337C21.4674 4.09938 21.2244 4 20.9997 4H9.46699Z" fill="#fff788"></path> </g></svg>
</div>
    <button class="add-sector btn-cr">+</button>
    <button class="generate-wheel btn-cr">Generate</button>
    <div class="scrollable-div"></div>
</div>
`
OBR.onReady(() => {
    const select = document.getElementsByClassName('wheel-select')[0]
    const open = document.getElementsByClassName('open-wheel')[0]
    const form = document.getElementsByClassName('upload-button')[0]
    const file = document.getElementsByClassName('file-input')[0]
    const name = document.getElementsByClassName('name-input')[0]
    const switch_btn = document.getElementsByClassName('create-wheel')
    const add = document.getElementsByClassName('add-sector')[0]
    const gen = document.getElementsByClassName('generate-wheel')[0]
    const save = document.getElementsByClassName('download-wheel')[0]
    const edit = document.getElementsByClassName('edit-wheel')[0]
    const del = document.getElementsByClassName('delete-wheel')[0]
    const del_a = document.getElementsByClassName('delete-sure')[0]
    let panels = document.getElementsByClassName('panel')
    
    for (let i = 0; i < switch_btn.length; i++){
        
        switch_btn[i].addEventListener("click", () => {
            for (let j = 1; j <= panels.length; j++){
                panels[j%panels.length].style.display =  ((i == j-1) ? "grid" : "none");
            }
            app.style.alignSelf = ((i == 0) ? "normal" : "center");
        });
    }

    edit.addEventListener("click", () => {
        if (select.value != ''){
            switch_btn[0].click()
            let newName = document.getElementsByClassName('name-input')[1]
            newName.value = select.value.slice(0, -2);
            const prizes = JSON.parse(localStorage.getItem(select.value))["prizes"];
            let sectors = document.getElementsByClassName('sector')
            /*
            const len = sectors.length
            for (let i = 1; i < len; i++){
                console.log(sectors[1].children)
                sectors[1].children[4].click()
            }
            */
            for (let i = 0; i < prizes.length; i++){
                add.click()
                const count = document.getElementById('sector_count').value;
                let sector = (sectors[sectors.length-1].children);
                sector[0].value = prizes[i]["text"]
                sector[1].value = prizes[i]["fulltext"]
                sector[2].value = prizes[i]["color"]
                sector[3].value = prizes[i]["reaction"];
            }
        }
    });

    del.addEventListener("click", () => {
        if (select.value != ''){
            let sure_panel = document.getElementsByClassName('delete-sure-panel')[0]
            sure_panel.style.display = "grid";
        }
    });

    del_a.addEventListener("click", () => {
        let sure = document.getElementsByClassName('delete-sure-input')[0]
        if (sure.value === "DELETE"){
            localStorage.removeItem(select.value)
            //console.log('delete confirmed', select.value)
            updateSelect()
            let sure_panel = document.getElementsByClassName('delete-sure-panel')[0]
            sure_panel.style.display = "none";
        }
        sure.value = ""
    });

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
        const newName = document.getElementsByClassName('name-input')[1]
        const sectors = document.getElementsByClassName('scrollable-div')[0]
        if(counter.value != 0 && newName.value != ''){
            const k = sectors.children
            let str = '{\n\t"prizes":['
                console.log(k)
            for (let t = 0; t < k.length; t++){
                let p = k[t].children
                console.log(p)
                if (str.slice(-1) != '[')
                    str += ','
                str += "\n"+JSON.stringify({text: p[0].value, fulltext: p[1].value, color: p[2].value, reaction: p[3].value});
                
            }
            
            str += '\n\t]\n}'
            localStorage.setItem(newName.value+"SW", str);
            updateSelect();
            select.value = newName.value+"SW"
            save.click()
            switch_btn[1].click()
        }
    });

    add.addEventListener("click", () => {
        let or = document.getElementsByClassName('sector')[0]
        let sector_id = document.getElementById('sector_id')
        let sector_count = document.getElementById('sector_count')
        let el = or.cloneNode(true)
        el.style.display = "grid"

        el.children[0].value = ""+sector_id.value
        el.children[2].value = getRandomColor()
        const del_b = el.children[4]
        del_b.addEventListener("click", () => {
            let sector_count = document.getElementById('sector_count')
            sector_count--
            el.remove()
        });
        sector_id.value++
        sector_count.value++
        const tar = document.getElementsByClassName("scrollable-div")[0]
        tar.appendChild(el) 
    });

    function updateSelect() {
        let ops = select.children
        for (let i = 1; i < ops.length; i++){
            ops[i].remove()
        }
        for (let key in localStorage){
            if (key.slice(-2)=="SW"){
                let el = document.createElement("option")
                el.text = key.slice(0, key.length-2)
                el.value = key
                el.id = el.value
                select.appendChild(el)
            }
        }
    }
    updateSelect()

    form.addEventListener('click', handleSubmit)

    function handleSubmit(event){
        event.preventDefault();
        if (!file.value.length) return;
        let reader = new FileReader();
        reader.onload = logFile;
        reader.readAsText(file.files[0]);

    };

    function logFile (event) {
        let str = event.target.result;
        localStorage.setItem(name.value+"SW", str)
        
        updateSelect()
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
