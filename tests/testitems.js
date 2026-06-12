const fs=require('fs');
const h=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
let js=h.slice(h.indexOf('<script>')+8, h.lastIndexOf('</script>'));
js=js.replace('(function(){','').slice(0, js.lastIndexOf('})();')-12);
let rafCb=[]; global.requestAnimationFrame=fn=>rafCb.push(fn);
global.setInterval=(fn)=>1; global.setTimeout=(fn,ms)=>{ return 1; }; global.clearInterval=()=>{};
global.atob=s=>Buffer.from(s,'base64').toString('binary');
global.Uint8Array=Uint8Array; global.Blob=function(){}; global.URL={createObjectURL:()=>'blob:fake'};
function mkCtx(){return{imageSmoothingEnabled:false,save(){},restore(){},clip(){},translate(){},scale(){},rotate(){},clearRect(){},fillRect(){},fillText(){},strokeText(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},arc(){},arcTo(){},ellipse(){},quadraticCurveTo(){},closePath(){},fill(){},stroke(){},setLineDash(){},measureText(){return{width:10};},getBoundingClientRect(){return{left:0,top:0,width:800,height:450};},createLinearGradient(){return{addColorStop(){}};},createRadialGradient(){return{addColorStop(){}};},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set globalAlpha(v){},set font(v){},set textAlign(v){},set lineCap(v){},set lineDashOffset(v){}};}
function mkEl(txt){ var e={classList:{add(){},remove(){},contains(){return false;}},style:{},dataset:{},innerHTML:'',textContent:txt||'',value:'Speler',disabled:false,loop:false,volume:1,currentTime:0,readyState:4,src:'',play(){return {then(f){f&&f();return{catch(){}};},catch(){}};},pause(){},load(){},appendChild(){},querySelectorAll(){return [];},getContext:mkCtx,width:0,height:0,getBoundingClientRect(){return{left:0,top:0,width:800,height:450};},addEventListener(){}}; Object.defineProperty(e,'onclick',{set(v){this._c=v;},get(){return this._c;}}); return e; }
let canvasEl=mkEl(); let els={};
global.document={ getElementById(id){ if(id==='game')return canvasEl; if(id==='bg-music-data')return mkEl('SUQzBAAA'); if(!els[id])els[id]=mkEl(); return els[id]; }, createElement(){return mkEl();}, querySelectorAll(){return[];}, addEventListener(){} };
global.AudioContext=function(){ return { state:'running', currentTime:0, resume(){}, createOscillator(){return{type:'',frequency:{value:0},connect(){},start(){},stop(){}};}, createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}, destination:{} }; };
global.SpeechSynthesisUtterance=function(t){this.text=t;};
global.Audio=function(){ return {play(){return{catch(){}};},pause(){}}; };
global.fetch=()=>Promise.resolve({ok:true,json:()=>Promise.resolve({scores:[]})});
let storeData={};
global.window={ addEventListener(){}, innerWidth:1200, innerHeight:800, AudioContext:global.AudioContext, Blob:global.Blob, URL:global.URL,
  speechSynthesis:{ cancel(){}, speak(){}, getVoices(){return [{lang:'nl-NL',name:'A'},{lang:'nl-NL',name:'B'}];}, set onvoiceschanged(v){} },
  storage:{ get(k){return Promise.resolve(storeData[k]?{value:storeData[k]}:null);}, set(k,v){storeData[k]=v;return Promise.resolve({});} } };
function frames(n){ for(let i=0;i<n && rafCb.length;i++){ try{ if(typeof obstacles!=='undefined') obstacles.length=0; }catch(e){} let cbs=rafCb; rafCb=[]; cbs.forEach(cb=>cb()); } }
function ok(cond,msg){ if(!cond){ console.log('FAIL:',msg); process.exit(1);} }
try{
  eval(js);
  els['b-start']._c(); els['b-tut-start']._c(); frames(60);

  // ===== JULIAN: gewichten op alle drie de achtervolger-soorten =====
  [[0,'agent'],[2,'motor'],[4,'heli']].forEach(function(pair){
    selectedKey='julian'; startRun(); frames(30);
    chase.phase=pair[0];
    if(pair[0]===2){ chase.motorX=8; } if(pair[0]===4){ chase.heliX=130; }
    frames(5);
    heldItem='weights'; useItem();
    ok(julianAct && julianAct.phase==='reach', 'julian reach start ('+pair[1]+')');
    ok(chaserDown>400, 'chaser uitgeschakeld tijdens julian-act ('+pair[1]+')');
    frames(30); ok(julianAct && julianAct.phase==='carry', 'julian carry ('+pair[1]+')');
    frames(185); ok(julianAct && julianAct.phase==='throw', 'julian throw ('+pair[1]+')');
    frames(90); ok(julianAct===null, 'julian act klaar ('+pair[1]+')');
    frames(420); ok(chaserDown===0, 'achtervolger terug na 5 s ('+pair[1]+')');
  });
  console.log('OK: Julian gewichten (agent/motor/heli) volledig doorlopen');

  // ===== TIMO: wok -> 5 s vuur, chaser blijft volgen =====
  selectedKey='timo'; startRun(); frames(40);
  heldItem='wok'; useItem();
  ok(wokFly!==null, 'wok vliegt');
  frames(80); ok(burnT>0, 'achtervolger staat in de fik');
  ok(chaserDown===0, 'achtervolger blijft volgen tijdens het vuur');
  frames(320); ok(burnT===0, 'vuur dooft na 5 s');
  console.log('OK: Timo wok — vuur 5 s, blijft volgen, dooft');

  // ===== DAAN: pil -> 10 s woest en onkwetsbaar =====
  selectedKey='daan'; startRun(); frames(40);
  heldItem='pill'; useItem();
  ok(pillAnim>0, 'slik-animatie loopt');
  frames(50); ok(rageT>500, 'rage actief na doorslikken');
  ok(hitPlayer()===false, 'onkwetsbaar tijdens rage');
  ok(mode==='play', 'run loopt door na hit tijdens rage');
  frames(650); ok(rageT===0, 'rage stopt na 10 s');
  ok(mode==='play', 'run loopt nog');
  console.log('OK: Daan pil — slikken, 10 s woest en onkwetsbaar');

  // ===== THOM: mega-bier -> 2 s drinken, 5 s alles stil =====
  selectedKey='thom'; startRun(); frames(40);
  heldItem='megabeer'; useItem();
  ok(drinkT>0, 'drink-animatie loopt');
  frames(130); ok(freezeT>0, 'wereld bevroren na het drinken');
  var m1=meters; var f1=chase.phase; frames(60);
  ok(meters===m1, 'meters staan stil tijdens de freeze');
  frames(260); ok(freezeT===0, 'freeze voorbij na 5 s');
  frames(30); ok(meters>m1, 'wereld loopt daarna gewoon door');
  console.log('OK: Thom mega-bier — drinken, alles 5 s stil, daarna verder');

  console.log('ALLE ITEM-TESTS GESLAAGD');
}catch(e){ console.log('ERROR:',e.message,'\n',e.stack.split('\n').slice(1,6).join('\n')); process.exit(1); }
