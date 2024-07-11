import OBR from '@owlbear-rodeo/sdk'
import '/style.css'

document.querySelector("#app").innerHTML= `
<div>
    <form id="upload">
        <input type="file" id="file" accept=".json">
        <button>Upload</button>    
    </form>
</div>
`
OBR.onReady(() => {
    const select = document.getElementById('wheels')
    const form = document.getElementById('upload')
    const file = document.getElementById('file')

    form.addEventListener('submit', handleSubmit)

    function handleSubmit(event){
        event.preventDefault();
        if (!file.value.length) return;
        let reader = new FileReader();
        reader.onload = logFile;
        reader.readAsText(file.files[0]);

    }

    function logFile (event) {
        let str = event.target.result;
        let json = JSON.parse(str);
        //console.log('string', str);
        //console.log('json', json["prizes"]);
        localStorage.setItem("wheel", str)
        OBR.modal.open({
            id: "com.onrender.wheel/modal",
            url: "/wheel.html",
            hidePaper: true,
            hideBackdrop: true,
            fullScreen: true
        });
        
    }
    
    OBR.broadcast.onMessage("com.onrender.wheel.spin", (event) => {
        const getName = (party) => {
            let name = 'unknown';
            for (let i = 0; i < party.length; i++){
                if (party[i].connectionId == event.connectionId){
                    name = party[i].name
                    break
                }
            }
            localStorage.setItem("wheel", event.data[1]);
            OBR.popover.open({
                id: "com.onrender.wheel/pop_wheel",
                url: "/wheel_viewer.html?"+("&rotation="+event.data[0])+("&wheel_owner="+encodeURIComponent(name)),
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
