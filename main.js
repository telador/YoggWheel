import OBR from '@owlbear-rodeo/sdk'
import '/style.css'

document.querySelector("#app").innerHTML= `
<div class="select">
    <select id="wheels">
        <option value="">None</option>
        <option value="cfbb850558774e0ea1647cd3213595cc">[Spark of Chaos]</option>
        <option value="popover" hidden>testing</option>
        <option value="colorNo8" hidden>[Color No. 8]</option>
    </select>
</div>
<br>
<div>
    <button id="open-btn">Open</button>
</div>
`
const select = document.getElementById('wheels')
const open = document.getElementById('open-btn')
const close = document.getElementById('close-btn')
open.addEventListener('click', () => {
    OBR.popover.close('com.onrender.yogg-wheel')
    if(select.value != '')
    OBR.popover.open({
        id: 'com.onrender.yogg-wheel',
        url: '/popover.html?'+('link='+select.value),
        height: 425,
        width: 500,
        anchorOrigin: {horizontal: "CENTER", vertical: "CENTER"},
        transformOrigin: {horizontal: "CENTER", vertical: "CENTER"},
        disableClickAway: true,
        hidePaper: true
    })
})