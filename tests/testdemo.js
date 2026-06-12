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
try{
  eval(js);
  var mock=mkCtx();
  ['julian','olle','timo','daan','jarno','bram','thom'].forEach(function(key){
    selectedKey=key;
    ['sk','item'].forEach(function(tp){
      detDemo={type:tp, t:0};
      var done=false, guard=0;
      while(!done && guard<400){ done=drawDetailDemo(mock,190,250,guard); detDemo.t++; guard++; }
      if(guard>=400){ console.log('FAIL: demo eindigt niet:',key,tp); process.exit(1); }
    });
  });
  console.log('OK: alle 14 detail-demo\'s spelen volledig af zonder crash');
}catch(e){ console.log('ERROR:',e.message,'\n',e.stack.split('\n').slice(1,5).join('\n')); process.exit(1); }
