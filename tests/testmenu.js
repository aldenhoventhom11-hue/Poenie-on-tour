const fs=require('fs');
const h=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
let js=h.slice(h.indexOf('<script>')+8, h.lastIndexOf('</script>'));
let rafCb=[]; global.requestAnimationFrame=fn=>rafCb.push(fn);
global.setInterval=(fn)=>1; global.setTimeout=(fn,ms)=>1; global.clearInterval=()=>{};
global.atob=s=>Buffer.from(s,'base64').toString('binary');
global.Uint8Array=Uint8Array; global.Blob=function(){}; global.URL={createObjectURL:()=>'blob:fake'};
function mkCtx(){return{imageSmoothingEnabled:false,save(){},restore(){},translate(){},scale(){},rotate(){},clearRect(){},fillRect(){},fillText(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},arc(){},arcTo(){},ellipse(){},quadraticCurveTo(){},closePath(){},fill(){},stroke(){},setLineDash(){},clip(){},rect(){},measureText(){return{width:10};},getBoundingClientRect(){return{left:0,top:0,width:800,height:450};},createLinearGradient(){return{addColorStop(){}};},createRadialGradient(){return{addColorStop(){}};},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set globalAlpha(v){},set font(v){},set textAlign(v){},set lineCap(v){},set lineDashOffset(v){}};}
function mkEl(txt){ var e={classList:{add(){},remove(){},contains(){return false;}},style:{},dataset:{},innerHTML:'',textContent:txt||'',value:'X',disabled:false,loop:false,volume:1,currentTime:0,readyState:4,src:'',play(){return {catch(){}};},pause(){},load(){},appendChild(){},querySelectorAll(){return [];},getContext:mkCtx,width:0,height:0,getBoundingClientRect(){return{left:0,top:0,width:800,height:450};},addEventListener(){}}; Object.defineProperty(e,'onclick',{set(v){this._c=v;},get(){return this._c;}}); return e; }
let canvasEl=mkEl(); let els={};
global.document={ getElementById(id){ if(id==='game')return canvasEl; if(id==='bg-music-data')return mkEl('SUQzBAAA'); if(!els[id])els[id]=mkEl(); return els[id]; }, createElement(){return mkEl();}, querySelectorAll(){return[];}, addEventListener(){} };
global.AudioContext=function(){ return { state:'running', currentTime:0, resume(){}, createOscillator(){return{type:'',frequency:{value:0},connect(){},start(){},stop(){}};}, createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}, destination:{} }; };
global.SpeechSynthesisUtterance=function(t){this.text=t;};
global.Audio=function(){ return {play(){return{catch(){}};},pause(){}}; };
global.window={ addEventListener(){}, innerWidth:1200, innerHeight:800, AudioContext:global.AudioContext, Blob:global.Blob, URL:global.URL,
  speechSynthesis:{ cancel(){}, speak(){}, getVoices(){return [{lang:'nl-NL',name:'A'}];}, set onvoiceschanged(v){} },
  storage:{ get(){return Promise.resolve(null);}, set(){return Promise.resolve({});} } };
try{
  eval(js);
  // GEEN b-start: alleen menu-modus 400 frames (test de doorlopende menu-achtergrond)
  for(let i=0;i<400 && rafCb.length;i++){ let cbs=rafCb; rafCb=[]; cbs.forEach(cb=>cb()); }
  console.log('OK: menu-achtergrond (doorlopend) draait zonder crash');
}catch(e){ console.log('ERROR:',e.message,'\n',e.stack.split('\n').slice(1,5).join('\n')); process.exit(1); }
