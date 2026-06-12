// test select-flow: b-select -> klik character -> detail open -> terug -> bevestig
const fs=require('fs');
const h=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
let js=h.slice(h.indexOf('<script>')+8, h.lastIndexOf('</script>'));
let rafCb=[]; global.requestAnimationFrame=fn=>rafCb.push(fn);
let intervals=[]; global.setInterval=(fn)=>{intervals.push(fn);return intervals.length;}; global.setTimeout=()=>1; global.clearInterval=()=>{};
global.atob=s=>Buffer.from(s,'base64').toString('binary');
global.Uint8Array=Uint8Array; global.Blob=function(){}; global.URL={createObjectURL:()=>'blob:x'};
function mkCtx(){return{imageSmoothingEnabled:false,save(){},restore(){},translate(){},scale(){},rotate(){},clearRect(){},fillRect(){},fillText(){},strokeText(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},arc(){},arcTo(){},ellipse(){},quadraticCurveTo(){},closePath(){},fill(){},stroke(){},setLineDash(){},clip(){},rect(){},measureText(){return{width:9};},createLinearGradient(){return{addColorStop(){}};},createRadialGradient(){return{addColorStop(){}};},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set globalAlpha(v){},set font(v){},set textAlign(v){},set lineCap(v){},set lineDashOffset(v){}};}
let clsLog={};
function mkEl(id){ var cl={_h:false,add(){this._h=true;},remove(){this._h=false;},contains(){return this._h;}};
  var e={classList:cl,style:{},dataset:{},innerHTML:'',textContent:'',value:'X',disabled:false,loop:false,volume:1,currentTime:0,readyState:4,src:'',play(){return{catch(){}};},pause(){},load(){},children:[],appendChild(c){this.children.push(c);},querySelectorAll(){return [];},getContext:mkCtx,width:0,height:0,getBoundingClientRect(){return{left:0,top:0,width:800,height:450};},addEventListener(){}};
  Object.defineProperty(e,'onclick',{set(v){this._c=v;},get(){return this._c;}}); if(id)clsLog[id]=e; return e; }
let els={}; let made=[];
global.document={ getElementById(id){ if(!els[id])els[id]=mkEl(id); return els[id]; }, createElement(){var e=mkEl(); made.push(e); return e;}, querySelectorAll(){return[];}, addEventListener(){} };
global.AudioContext=function(){ return { state:'running', currentTime:0, resume(){}, createOscillator(){return{type:'',frequency:{value:0,setValueAtTime(){},linearRampToValueAtTime(){}},connect(){},start(){},stop(){}};}, createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}, destination:{} }; };
global.SpeechSynthesisUtterance=function(t){this.text=t;};
global.Audio=function(){return{play(){return{catch(){}};},pause(){}};};
global.window={ addEventListener(){}, innerWidth:1200, innerHeight:800, AudioContext:global.AudioContext, Blob:global.Blob, URL:global.URL,
  speechSynthesis:{cancel(){},speak(){},getVoices(){return[{lang:'nl-NL',name:'Xander'}];},set onvoiceschanged(v){}},
  storage:{get(){return Promise.resolve(null);},set(){return Promise.resolve({});}} };
try{
  eval(js);
  els['b-select']._c();                       // open keuzemenu (buildPickGrid)
  var tile=made.find(e=>e._c&&e.dataset);     // eerste pick-tegel
  // klik op een character-tegel
  var picks=made.filter(e=>e._c&&e.className&&String(e.className).indexOf('pick')>=0);
  if(picks.length<7) throw new Error('grid niet gebouwd: '+picks.length);
  picks[2]._c();                              // klik 3e character
  if(els['char-detail'].classList.contains('hidden')) throw new Error('detail niet geopend');
  if(!els['pick-view'].classList.contains('hidden')) throw new Error('grid niet verborgen');
  if(!els['det-traits'].children.length) throw new Error('geen eigenschappen gevuld');
  // detail-animatie frame draaien
  intervals.forEach(fn=>fn());
  els['b-det-back']._c();                     // terug
  if(!els['char-detail'].classList.contains('hidden')) throw new Error('detail niet gesloten');
  picks[4]._c();                              // ander character
  els['b-confirm']._c();                      // bevestig & start
  for(let i=0;i<300&&rafCb.length;i++){let c=rafCb;rafCb=[];c.forEach(f=>f());}
  console.log('OK: select-detail-flow (open, traits, terug, bevestig & start) werkt');
}catch(e){ console.log('ERROR:',e.message); process.exit(1); }
