import OBR from '@owlbear-rodeo/sdk'

const urlp=[];let s=location.toString().split('?');s=s[1].split('&');for(let i=0;i<s.length;i++){let u=s[i].split('=');urlp[u[0]]=u[1];}  
const link = urlp['link']
document.querySelector('#app').innerHTML=`<button id="cls-btn">x</button>
<iframe style="max-width:100%" src="https://wordwall.net/embed/`+link+`?themeId=43&templateId=8&fontStackId=0" width="500" height="380" frameborder="0" allowfullscreen></iframe>
`    
const btn = document.getElementById('cls-btn')
btn.addEventListener('click', () => {
    OBR.popover.close('com.onrender.yogg-wheel')
})