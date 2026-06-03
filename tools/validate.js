const fs = require('fs');
const W = 1080, H = 1920, noop = () => {};
function makeCtx(){return new Proxy({},{get(t,p){if(p==='measureText')return()=>({width:10});if(p==='createLinearGradient'||p==='createRadialGradient')return()=>({addColorStop:noop});if(p==='canvas')return{width:W,height:H};if(p in t)return t[p];return noop;},set(t,p,v){t[p]=v;return true;}});}
function makeEl(extra){const base={style:{},classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},addEventListener:noop,removeEventListener:noop,appendChild:c=>c,removeChild:noop,setAttribute:noop,getAttribute:()=>null,getContext:()=>makeCtx(),captureStream:()=>({getAudioTracks:()=>[],addTrack:noop}),width:W,height:H,value:'',textContent:'',innerHTML:'',checked:false,onclick:null,oninput:null,onchange:null,href:'',download:''};return new Proxy(Object.assign(base,extra||{}),{get(t,p){if(p in t)return t[p];return noop;},set(t,p,v){t[p]=v;return true;}});}
global.performance={now:()=>Date.now()};global.requestAnimationFrame=()=>0;global.cancelAnimationFrame=noop;global.URL={createObjectURL:()=>''};global.Blob=function(){};
global.document={getElementById:id=>makeEl(id==='cv'?{width:W,height:H}:{}),createElement:()=>makeEl(),addEventListener:noop,fonts:{ready:Promise.resolve()},body:makeEl()};
global.window=global;
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const inner=html.match(/<script>([\s\S]*)<\/script>/)[1];
const hook=`;globalThis.__ENGINE__={ABILITIES:ABILITIES,runMatch:function(abA,abB){cfg.A.ability=abA;cfg.B.ability=abB;cfg.sound=false;cfg.autorec=false;cfg.pick=false;ensureParams('A',abA);ensureParams('B',abB);reset();running=true;finished=false;winnerSide=null;phase='fight';alertT=0;var ticks=0,MAX=60*200,bt=-1;while(!finished&&ticks<MAX){elapsed=ticks*FIXED/1000;var pp=phase;simTick();if(pp!=='boss'&&phase==='boss')bt=ticks;ticks++;}return{winner:winnerSide,seconds:+(ticks*FIXED/1000).toFixed(2),bossAt:bt>=0?+(bt*FIXED/1000).toFixed(2):null,finished:finished,ultA:!lanes[0].ultReady,ultB:!lanes[1].ultReady};}};`;
const cut=inner.lastIndexOf('})();');
eval(inner.slice(0,cut)+hook+inner.slice(cut));
const E=global.__ENGINE__, ABS=E.ABILITIES;
function many(a,b,n){let d=[],aw=0,bw=0,dr=0,bs=0,bn=0,unf=0,ults=0;for(let i=0;i<n;i++){const r=E.runMatch(a,b);d.push(r.seconds);if(!r.finished)unf++;if(r.winner==='A')aw++;else if(r.winner==='B')bw++;else dr++;if(r.ultA)ults++;if(r.ultB)ults++;if(r.bossAt!=null){bs+=r.bossAt;bn++;}}return{avg:+(d.reduce((x,y)=>x+y,0)/n).toFixed(1),min:Math.min(...d),max:Math.max(...d),aw,bw,dr,unf,ultRate:+(ults/(2*n)).toFixed(2),boss:bn?+(bs/bn).toFixed(1):null};}

console.log('MIRROR (baked defaults)  N=8');
console.log('ability     avg   min   max   over60?');
let allOver=true;
for(const ab of ABS){const r=many(ab,ab,8);const ok=r.min>=60;if(!ok)allOver=false;console.log('  '+ab.padEnd(9),String(r.avg).padStart(5),String(r.min).padStart(5),String(r.max).padStart(5),'ult'+r.ultRate,ok?'yes':'<60');}
console.log('all mirrors min>=60s:', allOver);

console.log('\nCROSS MATCHUPS  N=14');
const pairs=[['FART','FROG TONGUE'],['BEAM','SNIPER'],['ORBIT','PUCK'],['NUKE','SKELETON'],['SHOTGUN','MINIGUN'],['BLACKHOLE','FART'],['PUCK','SKELETON'],['FROG TONGUE','ORBIT'],['SNIPER','MINIGUN'],['BEAM','NUKE']];
console.log('matchup                 A%    avg   min');
for(const [a,b] of pairs){const r=many(a,b,14);console.log((a+' vs '+b).padEnd(22),String(Math.round(100*r.aw/14)).padStart(3)+'%',String(r.avg).padStart(6),String(r.min).padStart(5));}
