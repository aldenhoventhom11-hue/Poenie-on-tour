const fs=require('fs');
const h=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
let js=h.slice(h.indexOf('<script>')+8, h.lastIndexOf('</script>'));
js=js.replace('(function(){','').slice(0, js.lastIndexOf('})();')-12);
let rafCb=[]; global.requestAnimationFrame=fn=>rafCb.push(fn);
global.setInterval=(fn)=>1; global.setTimeout=(fn,ms)=>{ return 1; }; global.clearInterval=()=>{};
global.atob=s=>Buffer.from(s,'base64').toString('binary');
global.Uint8Array=Uint8Array; global.Blob=function(){}; global.URL={createObjectURL:()=>'blob:fake'};
function mkCtx(){return{imageSmoothingEnabled:false,save(){},restore(){},translate(){},scale(){},rotate(){},clearRect(){},fillRect(){},fillText(){},strokeText(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},arc(){},arcTo(){},ellipse(){},quadraticCurveTo(){},closePath(){},fill(){},stroke(){},setLineDash(){},measureText(){return{width:10};},getBoundingClientRect(){return{left:0,top:0,width:800,height:450};},createLinearGradient(){return{addColorStop(){}};},createRadialGradient(){return{addColorStop(){}};},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set globalAlpha(v){},set font(v){},set textAlign(v){},set lineCap(v){},set lineDashOffset(v){}};}
function mkEl(txt){ var e={classList:{add(){},remove(){},contains(){return false;}},style:{},dataset:{},innerHTML:'',textContent:txt||'',value:'Speler',disabled:false,loop:false,volume:1,currentTime:0,readyState:4,src:'',play(){return {then(f){f&&f();return{catch(){}};},catch(){}};},pause(){},load(){},appendChild(){},querySelectorAll(){return [];},getContext:mkCtx,width:0,height:0,getBoundingClientRect(){return{left:0,top:0,width:800,height:450};},addEventListener(){}}; Object.defineProperty(e,'onclick',{set(v){this._c=v;},get(){return this._c;}}); return e; }
let canvasEl=mkEl(); let els={};
global.document={ getElementById(id){ if(id==='game')return canvasEl; if(id==='bg-music-data')return mkEl('SUQzBAAA'); if(!els[id])els[id]=mkEl(); return els[id]; }, createElement(){return mkEl();}, querySelectorAll(){return[];}, addEventListener(){} };
global.AudioContext=function(){ return { state:'running', currentTime:0, resume(){}, createOscillator(){return{type:'',frequency:{value:0,setValueAtTime(){},linearRampToValueAtTime(){}},connect(){},start(){},stop(){}};}, createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}, destination:{} }; };
global.SpeechSynthesisUtterance=function(t){this.text=t;};
global.Audio=function(){ return {play(){return{catch(){}};},pause(){}}; };
let storeData={};
global.window={ addEventListener(){}, innerWidth:1200, innerHeight:800, AudioContext:global.AudioContext, Blob:global.Blob, URL:global.URL,
  speechSynthesis:{ cancel(){}, speak(){}, getVoices(){return [{lang:'nl-NL',name:'A'},{lang:'nl-NL',name:'B'}];}, set onvoiceschanged(v){} },
  storage:{ get(k){return Promise.resolve(storeData[k]?{value:storeData[k]}:null);}, set(k,v){storeData[k]=v;return Promise.resolve({});} } };
function pump(n){ for(let i=0;i<n && rafCb.length;i++){ let cbs=rafCb; rafCb=[]; cbs.forEach(cb=>cb()); } }
try{
  eval(js);
  // start de nieuwe wereld via de hoofdmenu-knop
  els['b-world']._c();
  if(typeof gameWorld==='undefined' || gameWorld!=='festival'){ console.log('FAIL: festival niet gestart'); process.exit(1); }
  // speel met afwisselende invoer; haal alle baan/sprong/rol-paden aan
  let runs=0;
  for(let r=0;r<3;r++){
    if(mode!=='play'){ festStart(); }
    for(let i=0;i<2500 && rafCb.length;i++){
      if(i%17===0) festMove(Math.random()<0.5?-1:1);
      if(i%23===0) festJump();
      if(i%29===0) festRoll();
      let cbs=rafCb; rafCb=[]; cbs.forEach(cb=>cb());
    }
    runs++;
  }
  // forceer ook een keer een power-up + magneet/jetpack-pad
  festStart(); fest.pows.push({z:30,lane:Math.round(fest.laneF),type:'jet'}); pump(40);
  festStart(); fest.pows.push({z:30,lane:Math.round(fest.laneF),type:'magnet'}); pump(40);
  // gepakt -> finish-scherm
  festStart(); fest.obs.push({z:8,lane:Math.round(fest.laneF),type:'block',hit:false}); pump(120);
  if(mode!=='over'){ console.log('FAIL: festival-gepakt leidt niet tot eindscherm'); process.exit(1); }
  console.log('OK: festival-wereld (start, banen, sprong, rol, magneet, jetpack, gepakt) zonder crash');
}catch(e){ console.log('ERROR:',e.message,'\n',e.stack.split('\n').slice(1,6).join('\n')); process.exit(1); }
