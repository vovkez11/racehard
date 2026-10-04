const C=$('c'),X=C.getContext('2d'),W=400,H=600,L=55,R=345;
function $(i){return document.getElementById(i)}
const B=[
 {n:'Neon City',sky:['#12002b','#3a0066'],road:'#1d1630',edge:'#ff2bd6',line:'#27e8ff',e:'🌴'},
 {n:'Desert Sunset',sky:['#4a1230','#ff7b3a'],road:'#3b2a24',edge:'#ffd36b',line:'#fff2c9',e:'🌵'},
 {n:'Frozen Pass',sky:['#06223d','#58b4e6'],road:'#26384a',edge:'#bfefff',line:'#fff',e:'🌲'},
 {n:'Deep Space',sky:['#000','#10053a'],road:'#12121f',edge:'#7dff6b',line:'#b9ffb0',e:'☄️'}];
const COLORS=['#ff3355','#27e8ff','#ffd400','#7dff6b','#b26bff'];
const stars=Array.from({length:40},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.5}));
let st='menu',car,th=[],pt=[],pp=[],deco=[],sc=0,dist=0,spd=5,nitro=0,combo=0,comboT=0,coins=0,bestCombo=0,
 shield=0,slow=0,magnet=0,slick=0,shake=0,flash=0,bt=0,spawn=0,off=0,biome=0,banner='',px=null,nit=false,
 keys={},held=false,AC=null,muted=false,
 best=+localStorage.rf2best||0,color=localStorage.rf2col||COLORS[0];

let lock=false,py=0;
function beep(f,d,t='square',v=.05){if(muted||!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}
function burst(x,y,c,n){for(let i=0;i<n;i++)pt.push({x,y,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*9,l:30,c})}
function pop(t){pp.push({t,y:car.y-20,l:60})}

function reset(){car={x:182,y:480,w:36,h:64,vx:0,vy:0};th=[];pt=[];pp=[];deco=[];sc=0;dist=0;spd=5;nitro=30;lock=false;combo=0;comboT=0;coins=0;bestCombo=0;
 shield=slow=magnet=slick=shake=flash=0;spawn=0;biome=0;banner=B[0].n;bt=120}

function spawnWave(){
 const r=Math.random(),x=()=>L+10+Math.random()*(R-L-70);
 if(r<.36)th.push({t:'cone',x:x(),y:-50,w:44,h:36});
 else if(r<.62)th.push({t:'rival',x:x(),y:-80,w:36,h:64,vx:(Math.random()-.5)*2,c:`hsl(${Math.random()*360},80%,55%)`,s:.55,ph:Math.random()*6});
 else if(r<.72)th.push({t:'oil',x:x(),y:-50,w:70,h:44});
 else if(r<.9){const cx=x();for(let i=0;i<5;i++)th.push({t:'coin',x:cx+Math.sin(i)*18,y:-30-i*34,w:20,h:20})}
 else th.push({t:'pu',k:['shield','slow','magnet'][Math.random()*3|0],x:x(),y:-40,w:30,h:30});
}

function updPt(f){
 for(const p of pt){p.x+=p.vx*f;p.y+=p.vy*f;p.l-=f}pt=pt.filter(p=>p.l>0);
 for(const p of pp){p.y-=.8*f;p.l-=f}pp=pp.filter(p=>p.l>0);flash*=.92;
}

function upd(f){
 const bi=Math.floor(dist/2000)%B.length;
 if(bi!==biome){biome=bi;banner=B[bi].n;bt=150;beep(880,.3,'sine',.08)}
 const want=held||keys[' ']||keys.shift;
 if(nitro<=0&&!lock){lock=true;pop('OVERHEATED!');beep(120,.4,'sawtooth',.1)}
 if(lock&&nitro>=20&&!want)lock=false;
 nit=want&&!lock&&nitro>0;
 spd=(5+Math.min(dist/700,7))*(nit?1.6:1)*(slow>0?.55:1);
 nitro=nit?Math.max(0,nitro-.5*f):Math.min(100,nitro+.06*f);
 let d=(keys.arrowright||keys.d?1:0)-(keys.arrowleft||keys.a?1:0);
 if(px!==null)d=Math.max(-1,Math.min(1,(px-(car.x+car.w/2))/30));
 car.vx+=(d*7-car.vx)*(slick>0?.04:.22)*f;car.x+=car.vx*f;
 if(car.x<L){car.x=L;car.vx=0}if(car.x>R-car.w){car.x=R-car.w;car.vx=0}
 let e=(keys.arrowdown||keys.s?1:0)-(keys.arrowup||keys.w?1:0);
 if(px!==null)e=Math.max(-1,Math.min(1,(py-70-(car.y+car.h/2))/30));
 car.vy+=(e*6-car.vy)*(slick>0?.04:.22)*f;car.y+=car.vy*f;
 if(car.y<130){car.y=130;car.vy=0}if(car.y>H-car.h-12){car.y=H-car.h-12;car.vy=0}
 const ms=f*16.67;shield-=ms;slow-=ms;magnet-=ms;slick-=ms;bt-=f;comboT-=f;if(comboT<=0)combo=0;
 off+=spd*f;dist+=spd*f/10;sc+=spd*f*.12*(1+Math.min(combo,10)*.2)*(1+.4*(1-(car.y-130)/394));
 spawn-=spd*f;if(spawn<=0){spawnWave();spawn=(170-Math.min(dist/40,70))*(.6+Math.random()*.8)}
 if(Math.random()<.07*f)deco.push({x:Math.random()<.5?5+Math.random()*25:R+10+Math.random()*25,y:-30,e:B[biome].e});
 deco.forEach(o=>o.y+=spd*f);deco=deco.filter(o=>o.y<H+40);
 if(nit||spd>10)pt.push({x:car.x+10+Math.random()*16,y:car.y+car.h,vx:(Math.random()-.5)*.8,vy:3,l:14,c:nit?'#27e8ff':'#999'});
 else if(Math.random()<.5)pt.push({x:car.x+12+Math.random()*12,y:car.y+car.h,vx:0,vy:2,l:12,c:'#666'});
 for(const o of th){
  o.y+=spd*f*(o.t==='rival'?o.s:1);
  if(o.t==='rival'){o.ph+=.04*f;o.x=Math.max(L,Math.min(R-o.w,o.x+Math.sin(o.ph)*o.vx*1.5*f))}
  if(o.t==='coin'&&magnet>0){const dx=car.x+18-o.x-10,dy=car.y+32-o.y-10,dd=Math.hypot(dx,dy)||1;if(dd<170){o.x+=dx/dd*9*f;o.y+=dy/dd*9*f}}
  if(o.dead)continue;
  const hit=car.x+4<o.x+o.w&&car.x+car.w-4>o.x&&car.y+4<o.y+o.h&&car.y+car.h-4>o.y,cx=o.x+o.w/2,cy=o.y+o.h/2;
  if(hit){
   if(o.t==='coin'){coins++;sc+=25;o.dead=1;burst(cx,cy,'#ffd400',6);beep(1000+Math.min(coins,25)*30,.08,'sine')}
   else if(o.t==='pu'){o.dead=1;if(o.k==='shield')shield=6000;if(o.k==='slow')slow=4000;if(o.k==='magnet')magnet=6000;
    pop(o.k.toUpperCase()+'!');burst(cx,cy,'#fff',12);beep(700,.25,'sine',.08)}
   else if(o.t==='oil'){if(slick<=0){beep(150,.3,'sawtooth');pop('SLIPPERY!')}slick=1800}
   else if(o.t==='cone'&&nit){o.dead=1;sc+=50;shake=8;burst(cx,cy,'#f80',14);beep(200,.1,'sawtooth',.08);pop('SMASH +50')}
   else if(shield>0){shield=0;o.dead=1;shake=14;combo=0;burst(cx,cy,'#27e8ff',22);beep(300,.2,'triangle',.1);pop('SHIELD BROKE')}
   else{crash();return}
  }else if(o.t==='cone'||o.t==='rival'){
   if(o.y+o.h>car.y&&o.y<car.y+car.h){if(Math.max(o.x-car.x-car.w,car.x-o.x-o.w)<14)o.near=1}
   else if(o.y>=car.y+car.h&&o.near&&!o.paid){o.paid=1;combo++;comboT=360;bestCombo=Math.max(bestCombo,combo);
    nitro=Math.min(100,nitro+14);sc+=40*combo;pop('CLOSE CALL x'+combo);beep(500+combo*60,.12,'triangle');navigator.vibrate&&navigator.vibrate(15)}
  }
 }
 th=th.filter(o=>!o.dead&&o.y<H+80);updPt(f);
 $('s').textContent=sc|0;$('k').textContent=spd*18|0;$('n').textContent=coins;$('nf').style.width=nitro+'%';$('nf').style.background=lock?'#f33':'';$('nit').style.opacity=lock?.5:1;
}

function crash(){
 st='over';burst(car.x+18,car.y+32,'#f53',40);burst(car.x+18,car.y+32,'#fd0',20);shake=24;flash=1;beep(90,.6,'sawtooth',.15);navigator.vibrate&&navigator.vibrate(200);
 const f=sc|0,nb=f>best;if(nb){best=f;localStorage.rf2best=f}$('b').textContent=best;
 setTimeout(()=>ov('over',nb),700);
}

function drawCar(x,y,w,h,c,t){
 X.save();X.translate(x+w/2,y+h/2);X.rotate(t);X.shadowColor=c;X.shadowBlur=14;X.fillStyle=c;X.beginPath();X.roundRect(-w/2,-h/2,w,h,9);X.fill();X.shadowBlur=0;
 X.fillStyle='#0009';X.beginPath();X.roundRect(-w/2+5,-h/2+14,w-10,16,4);X.fill();X.fillRect(-w/2+5,h/2-18,w-10,10);
 X.fillStyle='#fff';X.fillRect(-w/2+3,-h/2,7,4);X.fillRect(w/2-10,-h/2,7,4);X.restore();
}
function emo(e,x,y,s){X.font=s+'px serif';X.textAlign='center';X.textBaseline='middle';X.fillText(e,x,y)}

function draw(){
 const b=B[biome];X.setTransform(S,0,0,S,0,0);X.save();
 if(shake>0){X.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.9;if(shake<.5)shake=0}
 const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,b.sky[0]);g.addColorStop(1,b.sky[1]);X.fillStyle=g;X.fillRect(-20,-20,W+40,H+40);
 X.fillStyle='#fff8';for(const s of stars)X.fillRect(s.x,(s.y+off*.2*s.r)%H,s.r,s.r);
 deco.forEach(o=>emo(o.e,o.x,o.y,28));
 X.fillStyle=b.road;X.fillRect(L,0,R-L,H);
 X.fillStyle=b.edge;X.shadowColor=b.edge;X.shadowBlur=14;X.fillRect(L-4,0,4,H);X.fillRect(R,0,4,H);X.shadowBlur=0;
 X.strokeStyle=b.line;X.lineWidth=3;X.setLineDash([30,30]);X.lineDashOffset=-off;
 for(let i=1;i<3;i++){const lx=L+(R-L)*i/3;X.beginPath();X.moveTo(lx,0);X.lineTo(lx,H);X.stroke()}X.setLineDash([]);
 if(nit||spd>9){X.strokeStyle='#fff3';X.lineWidth=2;for(let i=0;i<8;i++){const lx=L+Math.random()*(R-L),ly=Math.random()*H;X.beginPath();X.moveTo(lx,ly);X.lineTo(lx,ly+50);X.stroke()}}
 for(const o of th){const cx=o.x+o.w/2,cy=o.y+o.h/2;
  if(o.t==='cone')emo('🚧',cx,cy,38);
  else if(o.t==='rival')drawCar(o.x,o.y,o.w,o.h,o.c,0);
  else if(o.t==='oil'){X.fillStyle='#000b';X.beginPath();X.ellipse(cx,cy,o.w/2,o.h/2,0,0,7);X.fill();X.strokeStyle=`hsl(${off%360},80%,60%)`;X.lineWidth=2;X.stroke()}
  else if(o.t==='coin'){X.fillStyle='#fc0';X.shadowColor='#fc0';X.shadowBlur=8;X.beginPath();X.arc(cx,cy,9,0,7);X.fill();X.shadowBlur=0;X.fillStyle='#c90';X.fillRect(cx-2,cy-5,4,10)}
  else{X.fillStyle={shield:'#0ff',slow:'#6f6',magnet:'#f6f'}[o.k];X.shadowColor=X.fillStyle;X.shadowBlur=12;X.beginPath();X.arc(cx,cy,16,0,7);X.fill();X.shadowBlur=0;emo({shield:'🛡️',slow:'⏳',magnet:'🧲'}[o.k],cx,cy,18)}}
 if(car){
  for(const p of pt){X.globalAlpha=Math.max(0,p.l/30);X.fillStyle=p.c;X.fillRect(p.x,p.y,4,4)}X.globalAlpha=1;
  if(st!=='over'){
   if(nit){X.fillStyle='#27e8ff';X.shadowColor='#27e8ff';X.shadowBlur=18;X.fillRect(car.x+8,car.y+car.h,8,18+Math.random()*14);X.fillRect(car.x+20,car.y+car.h,8,18+Math.random()*14);X.shadowBlur=0}
   drawCar(car.x,car.y,car.w,car.h,color,car.vx*.04+(slick>0?Math.sin(off*.2)*.25:0));
   if(shield>0&&(shield>1500||(off|0)%10<5)){X.strokeStyle='#0ffa';X.lineWidth=3;X.beginPath();X.arc(car.x+18,car.y+32,44,0,7);X.stroke()}}
  let ty=48;X.textAlign='left';X.font='14px Arial';X.fillStyle='#fff';
  for(const[e,v]of[['🛡️',shield],['⏳',slow],['🧲',magnet]])if(v>0){X.fillText(e+' '+(v/1000).toFixed(1)+'s',10,ty);ty+=20}
  if(combo>1){X.fillStyle='#fc0';X.font='bold 16px Arial';X.fillText('COMBO x'+combo,10,24)}
  X.textAlign='center';X.font='bold 14px Arial';
  for(const p of pp){X.globalAlpha=Math.min(1,p.l/30);X.fillStyle='#fc0';X.fillText(p.t,W/2,p.y)}X.globalAlpha=1;
  if(bt>0&&st!=='menu'){X.globalAlpha=Math.min(1,bt/40);X.fillStyle='#fff';X.font='bold 30px Arial';X.shadowColor=b.edge;X.shadowBlur=14;X.fillText(banner.toUpperCase(),W/2,130);X.shadowBlur=0;X.globalAlpha=1}
  if(st==='pause'){X.fillStyle='#000a';X.fillRect(0,H/2-45,W,90);X.fillStyle='#fff';X.font='bold 28px Arial';X.fillText('⏸ PAUSED',W/2,H/2)}
 }
 if(flash>.02){X.fillStyle=`rgba(255,255,255,${flash})`;X.fillRect(-20,-20,W+40,H+40)}
 X.restore();
}

function ov(kind,nb){
 const o=$('ov');o.style.display='flex';
 if(kind==='menu')o.innerHTML=`<h2>NEON RUSH</h2><p>Drag to drive anywhere on the road, or use arrows / WASD.<br>Driving up front pays a score bonus, but gives you less time to react.<br>Hold <b>⚡ NITRO</b> (Space) to smash 🚧.<br>Skim past traffic for <b>CLOSE CALLS</b>:<br>combos + free nitro. Grab 🪙 and power-ups!</p><div id="sw">${COLORS.map(c=>`<span data-c="${c}" class="${c===color?'on':''}" style="background:${c}"></span>`).join('')}</div><button id="go">START</button>`;
 else o.innerHTML=`<h2>💥 CRASH!</h2><p style="font-size:1.4rem">Score <b>${sc|0}</b> ${nb?'🏆 NEW BEST!':''}</p><p>Best ${best} · ${dist|0} m · 🪙 ${coins} · max combo x${bestCombo}</p><button id="go">PLAY AGAIN</button>`;
}
function start(){
 if(!AC)try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}
 if(AC&&AC.state==='suspended')AC.resume();musicInit();
 reset();st='play';$('ov').style.display='none';$('ps').textContent='⏸';
}
function pause(){if(st==='play'){st='pause';$('ps').textContent='▶';AC&&AC.suspend()}else if(st==='pause'){st='play';$('ps').textContent='⏸';AC&&AC.resume()}}

$('ov').addEventListener('click',e=>{
 const c=e.target.dataset.c;
 if(c){color=c;localStorage.rf2col=c;ov('menu')}else if(e.target.id==='go')start();
});
$('ps').onclick=pause;
$('mu').onclick=()=>{muted=!muted;$('mu').textContent=muted?'🔇':'🔊'};
const nb=$('nit');nb.onpointerdown=e=>{held=true};['pointerup','pointerleave','pointercancel'].forEach(t=>nb.addEventListener(t,()=>held=false));
const mv=e=>{const r=C.getBoundingClientRect();px=(e.clientX-r.left)/r.width*W;py=(e.clientY-r.top)/r.height*H};
C.addEventListener('pointerdown',e=>{mv(e);C.setPointerCapture(e.pointerId)});
C.addEventListener('pointermove',e=>{if(px!==null)mv(e)});
['pointerup','pointercancel'].forEach(t=>C.addEventListener(t,()=>px=null));
document.addEventListener('keydown',e=>{
 const k=e.key.length>1?e.key.toLowerCase():e.key.toLowerCase();keys[k]=true;
 if([' ','arrowleft','arrowright','arrowup','arrowdown'].includes(k))e.preventDefault();
 if(k==='p'||k==='escape')pause();if(k==='m')$('mc').onclick();
 if((k==='enter')&&(st==='menu'||(st==='over'&&$('ov').style.display==='flex')))start();
});
document.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&st==='play')pause()});

// ---- retro synthwave engine v2: fixed tempo per biome, never tied to speed or nitro ----
// Graph: voices -> duck bus (kick sidechain pump) -> mix -> lowpass -> compressor -> master; shared echo + reverb sends.
let music=localStorage.rf2mus!=='0',mbus,mix,dk,fx,dly,noiseB,nextT=0,mstep=0,mm=null,mb=0;
const M=[
 {bpm:112,ch:[[57,60,64],[57,60,65],[55,60,64],[55,59,62]],bs:[45,41,48,43],w:'square',v:.04,sn:1,ld:'2..1..0.1..2..1.'},   // Neon City: Am F C G
 {bpm:98,ch:[[62,65,69],[58,62,65],[55,58,62],[57,61,64]],bs:[50,46,43,45],w:'sawtooth',v:.028,sn:1,ld:'0..2..1..0..2...'}, // Desert Sunset: Dm Bb Gm A
 {bpm:104,ch:[[55,59,64],[55,60,64],[55,59,62],[57,62,66]],bs:[52,48,43,50],w:'sine',v:.08,sn:0,ld:'1.0.1.2...2.1.0.'},     // Frozen Pass: Em C G D
 {bpm:124,ch:[[53,56,60],[53,56,61],[56,60,63],[55,58,63]],bs:[53,49,56,51],w:'square',v:.038,sn:1,ld:'2.2.1.2.0.1.2.1.'}]; // Deep Space: Fm Db Ab Eb
const fr=n=>440*2**((n-69)/12);
function musicInit(){if(mbus||!AC)return;const A=AC,mk=()=>A.createGain();
 mbus=mk();mbus.gain.value=.55;mix=mk();dk=mk();fx=mk();
 const lp=A.createBiquadFilter(),cp=A.createDynamicsCompressor(),fb=mk(),df=A.createBiquadFilter(),rv=A.createConvolver(),rw=mk();
 lp.type='lowpass';lp.frequency.value=9000;dly=A.createDelay(1);dly.delayTime.value=.5;fb.gain.value=.38;df.type='lowpass';df.frequency.value=2200;rw.gain.value=.5;
 const n=A.sampleRate*1.6,ir=A.createBuffer(2,n,A.sampleRate);
 for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n)**3}rv.buffer=ir;
 dk.connect(mix);fx.connect(dly);dly.connect(df);df.connect(fb);fb.connect(dly);df.connect(mix);fx.connect(rv);rv.connect(rw);rw.connect(mix);
 mix.connect(lp);lp.connect(cp);cp.connect(mbus);mbus.connect(A.destination);
 noiseB=A.createBuffer(1,A.sampleRate*.5,A.sampleRate);const d=noiseB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 setInterval(tick,25)}
function audio(){if(!AC)try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}if(AC&&AC.state==='suspended'&&st!=='pause')AC.resume();musicInit()}
['pointerdown','keydown'].forEach(t=>addEventListener(t,audio,{once:true}));
// o: b=bus, s=echo/reverb send, a=attack, dt=detune cents (2 oscillators), fc=filter-sweep start
function tone(f,t,d,type,v,o={}){const g=AC.createGain();let n=g;
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+(o.a||.006));g.gain.exponentialRampToValueAtTime(.0001,t+d);
 g.connect(o.b||dk);if(o.s){const s=AC.createGain();s.gain.value=o.s;g.connect(s);s.connect(fx)}
 if(o.fc){n=AC.createBiquadFilter();n.type='lowpass';n.frequency.setValueAtTime(o.fc,t);n.frequency.exponentialRampToValueAtTime(250,t+d);n.connect(g)}
 for(const c of o.dt?[-o.dt,o.dt]:[0]){const x=AC.createOscillator();x.type=type;x.frequency.value=f;x.detune.value=c;x.connect(n);x.start(t);x.stop(t+d+.05)}}
function nz(t,d,v,hz,type,s){const e=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();e.buffer=noiseB;e.loop=true;f.type=type;f.frequency.value=hz;
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);e.connect(f);f.connect(g);g.connect(mix);
 if(s){const q=AC.createGain();q.gain.value=s;g.connect(q);q.connect(fx)}e.start(t);e.stop(t+d)}
function kick(t){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(42,t+.13);
 g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.0001,t+.26);o.connect(g);g.connect(mix);o.start(t);o.stop(t+.28);
 dk.gain.setValueAtTime(.3,t);dk.gain.linearRampToValueAtTime(1,t+.2)}
function snare(t){nz(t,.2,.3,1900,'bandpass',.3);tone(190,t,.1,'triangle',.25,{b:mix})}
// 8-bar arrangement: bar0 groove, bar1+ arp, bar2+ snare, bar3 kick drop, bar4+ lead, bar7 snare fill
function step(s,t){const m=M[mb],sd=60/m.bpm/4,i=s%16,b=(s>>4)&3,ph=(s>>4)%8,ch=m.ch[b];
 if(s==0)nz(t,.9,.12,5000,'highpass',.4);
 if(i%4==0&&ph!=3)kick(t);
 if(m.sn&&((ph>=2&&i%8==4)||(ph==7&&i>12)))snare(t);
 if(i%2==0)nz(t,.03,.07,8000,'highpass');if(i%8==6)nz(t,.12,.05,7000,'highpass');
 if(i%2==0)tone(fr(m.bs[b]+(i%8==6?12:0)),t,sd*1.8,'sawtooth',.2,{dt:7,fc:1100});
 if(ph>0)tone(fr(ch[[0,1,2,1,2,1,2,1][i%8]]+12),t,sd*.9,m.w,m.v,{s:.25});
 const L=m.ld[i];if(ph>=4&&L!='.')tone(fr(ch[+L]+24),t,sd*2.5,'triangle',.07,{b:mix,s:.5,a:.01});
 if(i==0)ch.forEach(n=>tone(fr(n-12),t,sd*15,'sawtooth',.03,{a:.35,dt:9,fc:1400,s:.3}))}
function calm(s,t){const i=s%16,b=(s>>4)&3,ch=M[0].ch[b];
 if(i==0){ch.forEach(n=>tone(fr(n-12),t,6,'sawtooth',.035,{a:.8,dt:8,fc:1000,s:.5,b:mix}));tone(fr(M[0].bs[b]),t,3,'sine',.22,{b:mix})}
 if(i%2==0)tone(fr(ch[[0,1,2,1,2,1,0,1][(i>>1)%8]]+12),t,.9,'sine',.07,{b:mix,s:.6})}
// mode 1 = racing, 2 = calm menu/game-over loop, 0 = silent. Pause freezes the audio clock, so music resumes exactly in place.
function tick(){
 const m=!AC||!music||!mbus?0:st==='pause'?mm:st==='play'?1:st==='menu'||st==='over'?2:0;
 if(m!==mm){mm=m;nextT=0;mstep=0;mb=biome;const n=AC.currentTime;mbus.gain.cancelScheduledValues(n);mbus.gain.setValueAtTime(m?.05:0,n);
  if(m){mbus.gain.linearRampToValueAtTime(.55,n+.8);dly.delayTime.setValueAtTime(m==1?.75*60/M[mb].bpm:.66,n)}}
 if(!m)return;
 if(!nextT||nextT<AC.currentTime)nextT=AC.currentTime+.06;
 while(nextT<AC.currentTime+.2){
  if(m==1){if(mstep%16==0&&mb!==biome){mb=biome;mstep=0;dly.delayTime.setValueAtTime(.75*60/M[mb].bpm,nextT)}step(mstep,nextT);nextT+=60/M[mb].bpm/4}
  else{calm(mstep,nextT);nextT+=.22}
  mstep++}}
$('mc').style.opacity=music?1:.4;
$('mc').onclick=()=>{music=!music;localStorage.rf2mus=music?1:0;$('mc').style.opacity=music?1:.4};
let S=1;const box=$('box');
function fit(){const r=$('wrap').getBoundingClientRect(),w=Math.floor(Math.min(r.width,r.height*2/3)),d=Math.min(window.devicePixelRatio||1,2.5);
 box.style.width=w+'px';box.style.height=w*1.5+'px';S=w*d/W;C.width=Math.round(W*S);C.height=Math.round(H*S)}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,250));
document.addEventListener('contextmenu',e=>e.preventDefault());
let last=performance.now();
function frame(t){
 const f=Math.min((t-last)/16.67,3);last=t;
 if(st==='play')upd(f);else if(st!=='pause'){off+=2*f;updPt(f)}
 draw();requestAnimationFrame(frame);
}
$('b').textContent=best;reset();bt=0;ov('menu');fit();requestAnimationFrame(frame);
