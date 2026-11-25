/* Sanctuary common engine — shared by every place (성당, 교회, 모스크, 절 …).
   Classic script: expects window.THREE. The place script loaded after this defines `const P={…}` (hooks + texts)
   and finally calls startSanctuary(). Core code only touches P inside functions that run after that. */
const THREE=window.THREE;

/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const store={get(k,d){try{const v=localStorage.getItem('sd_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('sd_'+k,JSON.stringify(v))}catch(e){}}};
const NA=['고요한','맑은','작은','따스한','푸른','하얀','조용한','느린','은은한','포근한','둥근','오래된','수줍은','온화한','잔잔한','늦은','깊은','부드러운','먼','새벽','다정한','가벼운'];
const NB=['촛불','종소리','들꽃','햇살','비둘기','강물','구름','향기','이슬','담요','달','나무','별','제비꽃','바람','호수','저녁','창가','조약돌','발걸음','오솔길','등불','물결','숨결','안개','빗방울'];
const makeName=()=>pick(NA)+' '+pick(NB);

const settings={notify:store.get('notify','1'),bells:store.get('bells','1'),q:store.get('q','high')};
let myName=store.get('name',null)||makeName();

/* ---------- renderer ---------- */
const canvas=$('#c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
const applyPR=()=>renderer.setPixelRatio(settings.q==='high'?Math.min(devicePixelRatio,2):1);
applyPR();
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(55,1,0.1,120);
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<h?64:52;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const rint=n=>Math.floor(Math.random()*n);
/* ---------- textures ---------- */
function tex(w,h,draw,{rep,srgb=true}={}){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);
  const t=new THREE.CanvasTexture(c);if(srgb)t.colorSpace=THREE.SRGBColorSpace;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}
  t.anisotropy=renderer.capabilities.getMaxAnisotropy?Math.min(8,renderer.capabilities.getMaxAnisotropy()):4;return t}
const speckle=(g,w,h,n,a)=>{for(let i=0;i<n;i++){g.fillStyle=`rgba(${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()*a})`;g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2)}};
const radial=(stops)=>tex(128,128,(g,w,h)=>{const gr=g.createRadialGradient(64,64,0,64,64,64);stops.forEach(([o,c])=>gr.addColorStop(o,c));g.fillStyle=gr;g.fillRect(0,0,w,h)});
const flameTex=radial([[0,'rgba(255,250,225,1)'],[.25,'rgba(255,214,120,.95)'],[.55,'rgba(255,140,40,.35)'],[1,'rgba(255,100,20,0)']]);
const glowTex=radial([[0,'rgba(255,220,150,.7)'],[.4,'rgba(255,190,110,.22)'],[1,'rgba(255,170,90,0)']]);
const shadowTex=radial([[0,'rgba(0,0,0,.45)'],[.6,'rgba(0,0,0,.18)'],[1,'rgba(0,0,0,0)']]);
const faceTex=tex(128,128,(g)=>{g.lineCap='round';g.strokeStyle='#3a271c';g.lineWidth=5;g.beginPath();g.arc(42,60,9,Math.PI*1.05,Math.PI*1.95);g.stroke();g.beginPath();g.arc(86,60,9,Math.PI*1.05,Math.PI*1.95);g.stroke();
  g.lineWidth=4;g.beginPath();g.arc(64,74,7,Math.PI*.15,Math.PI*.85);g.stroke();[[28,78],[100,78]].forEach(([x,y])=>{const gr=g.createRadialGradient(x,y,0,x,y,13);gr.addColorStop(0,'rgba(232,110,100,.55)');gr.addColorStop(1,'rgba(232,110,100,0)');g.fillStyle=gr;g.fillRect(x-14,y-14,28,28)})});
const GOLD=new THREE.MeshLambertMaterial({color:0xd9b25c,emissive:0x3a2608});
const world=new THREE.Group();scene.add(world);
const box=(w,h,d,mat,x,y,z,parent=world)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m};
const flames=[];
const flameMat=new THREE.SpriteMaterial({map:flameTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
function addFlame(x,y,z,s=1,parent=world){const f=new THREE.Sprite(flameMat);f.scale.set(.09*s,.16*s,1);f.position.set(x,y,z);f.userData={base:s,ph:Math.random()*10,y};parent.add(f);flames.push(f);return f}
const hemi=new THREE.HemisphereLight(0xffffff,0x332a22,1);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe0b0,1.5);sun.position.set(-10,14,4);scene.add(sun);

/* ---------- rooms (time-of-day variants of the same place) ---------- */
let room=null;const roomNo={};
function initRooms(){P.rooms.forEach(r=>roomNo[r.id]=Math.floor(rand(3,40)));room=P.pickRoom?P.pickRoom(new Date().getHours()):P.rooms[0]}
function applyRoom(r){const p=r.p;hemi.color.setHex(p.sky);hemi.groundColor.setHex(p.gnd);hemi.intensity=p.hemi;sun.color.setHex(p.sun);sun.intensity=p.sunI;sun.position.set(...p.sunP);
  scene.fog=new THREE.FogExp2(p.fog,p.fogD);scene.background=new THREE.Color(p.fog);renderer.toneMappingExposure=p.exp;room=r;$('#roomName').textContent=`${r.name} ${roomNo[r.id]}`;P.onRoom&&P.onRoom(p,r)}

/* ---------- avatars ---------- */
const AG={head:new THREE.SphereGeometry(.42,28,20),face:new THREE.SphereGeometry(.424,20,12,Math.PI/2-.75,1.5,Math.PI/2-.5,1.0),
  body:new THREE.CylinderGeometry(.24,.38,.62,20),panel:new THREE.CylinderGeometry(.252,.392,.63,16,1,true,-.62,1.24),panelB:new THREE.CylinderGeometry(.252,.392,.63,16,1,true,Math.PI-.5,1.0),
  collar:new THREE.TorusGeometry(.2,.055,8,20),arm:new THREE.CapsuleGeometry(.085,.22,4,10),hand:new THREE.SphereGeometry(.075,10,8),leg:new THREE.CylinderGeometry(.1,.095,.26,10),foot:new THREE.SphereGeometry(.1,10,8),
  shadow:new THREE.PlaneGeometry(1,1)};
const faceMat=new THREE.MeshBasicMaterial({map:faceTex,transparent:true,depthWrite:false});
const shadowMat=new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false});
const robeMat=new THREE.MeshLambertMaterial({color:0xece6d8});
const robeMat2=new THREE.MeshLambertMaterial({color:0xd9dde2});
const shoeMat=new THREE.MeshLambertMaterial({color:0xe8dfcf});
const laceTex=tex(128,128,(g,w,h)=>{g.fillStyle='rgba(255,255,255,.9)';g.fillRect(0,0,w,h);g.globalCompositeOperation='destination-out';
  for(let y=0;y<h;y+=16)for(let x=(y/16)%2?8:0;x<w;x+=16){g.beginPath();g.arc(x+4,y+4,3.2,0,7);g.fill()}
  g.fillStyle='rgba(0,0,0,.35)';for(let y=8;y<h;y+=16)for(let x=0;x<w;x+=16){g.beginPath();g.arc(x+4,y+4,1.6,0,7);g.fill()}},{rep:[4,2]});
const VEILC=[null,0xfbf6ea,0x2a2626];const veilMats=VEILC.map(c=>c==null?null:new THREE.MeshLambertMaterial({color:c,map:laceTex,transparent:true,side:THREE.DoubleSide,alphaTest:.15}));
const HAIRC=[0x231c18,0x3d2a1e,0x6b4428,0xc9a462,0x9a9590];const hairMats=HAIRC.map(c=>new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide}));
const HG={cap:new THREE.SphereGeometry(.448,28,16,0,Math.PI*2,0,Math.PI*.5),bob:new THREE.CylinderGeometry(.452,.47,.32,28,1,true,.95,Math.PI*2-1.9),
  long:new THREE.CylinderGeometry(.452,.53,.72,28,1,true,1.0,Math.PI*2-2.0),bun:new THREE.SphereGeometry(.16,14,10),
  vcap:new THREE.SphereGeometry(.472,28,16,0,Math.PI*2,0,Math.PI*.56),vdrape:new THREE.CylinderGeometry(.47,.58,.56,28,1,true,Math.PI-1.4,2.8)};
const HAIRS=['short','bob','long','bun','none'],HAIRN={short:'짧은 머리',bob:'단발',long:'긴 머리',bun:'올림머리',none:'민머리'};

function randLook(){const v=P.text.veil!=null&&Math.random()<(P.veilRate??.33);return {skin:rint(5),hair:v?pick(['bob','long','bun','bun','long']):pick(['short','short','short','bob','long','bun','none']),hairC:pick([0,0,0,1,1,2,2,3,4]),veil:v?(Math.random()<.8?1:2):0,stole:rint(6)}}
const SKIN=[0xd9a578,0xcf9867,0xc28657,0xe0b48a,0xb5784c];const skinMats=SKIN.map(c=>new THREE.MeshLambertMaterial({color:c,emissive:new THREE.Color(c).multiplyScalar(.22)}));
const STOLE=[0x9bb6d8,0xdba3ad,0xa3c79f,0xe6cc80,0xb9a5d8,0xe9d7a8];const stoleMats=STOLE.map(c=>new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide}));
const pickables=[];

class Avatar{
  constructor({name,isMe=false,stole,scale=1,veil=false,robeC,stoleC,cape,look}){
    this.name=name;this.isMe=isMe;this.root=new THREE.Group();this.pos=this.root.position;this.rotY=Math.PI;this.tRotY=Math.PI;
    this.path=[];this.speed=isMe?1.9:rand(1.0,1.35);this.mode='stand';this.fold=false;this.crossT=-1;this.reachT=-1;this.bowT=-1;this.beatT=-1;this.walkPh=0;this.moving=false;
    this.sing=false;this.elev=false;this.ph=Math.random()*9;
    this.w={sit:0,kneel:0,fold:0,walk:0,sing:0,elev:0};this.slide=null;this.seat=null;this.onArrive=null;
    const skin=pick(skinMats),stm=stoleC!=null?new THREE.MeshLambertMaterial({color:stoleC,side:THREE.DoubleSide}):stole!=null?stoleMats[stole]:pick(stoleMats),robe=robeC!=null?new THREE.MeshLambertMaterial({color:robeC}):Math.random()<.75?robeMat:robeMat2;
    const sh=new THREE.Mesh(AG.shadow,shadowMat);sh.rotation.x=-Math.PI/2;sh.scale.set(1.1,1.1,1);sh.position.y=.01;this.root.add(sh);this.shadow=sh;
    this.bp=new THREE.Group();this.root.add(this.bp);
    this.legs=[1,-1].map(s=>{const g=new THREE.Group();g.position.set(s*.12,.3,0);const l=new THREE.Mesh(AG.leg,robe);l.position.y=-.13;const f=new THREE.Mesh(AG.foot,shoeMat);f.scale.set(1,.6,1.3);f.position.set(0,-.27,.03);g.add(l,f);this.bp.add(g);return g});
    this.torso=new THREE.Group();this.torso.position.y=.3;this.bp.add(this.torso);
    const body=new THREE.Mesh(AG.body,robe);body.position.y=.31;const pf=new THREE.Mesh(AG.panel,stm);pf.position.y=.31;const pb=new THREE.Mesh(AG.panelB,stm);pb.position.y=.31;
    const col=new THREE.Mesh(AG.collar,robe);col.rotation.x=Math.PI/2;col.position.y=.6;this.torso.add(body,pf,pb,col);
    this.arms=[1,-1].map(s=>{const g=new THREE.Group();g.position.set(s*.25,.56,.04);const a=new THREE.Mesh(AG.arm,robe);a.position.y=-.16;const h=new THREE.Mesh(AG.hand,skin);h.position.y=-.33;g.add(a,h);this.torso.add(g);return g});
    this.headP=new THREE.Group();this.headP.position.y=.62;this.torso.add(this.headP);
    const head=new THREE.Mesh(AG.head,skin);head.position.y=.4;const face=new THREE.Mesh(AG.face,faceMat);face.position.y=.4;this.headP.add(head,face);
    this.skinParts=[head,...this.arms.map(g=>g.children[1])];this.panels=stoleC!=null?[]:[pf,pb];
    const L=look?{...look}:randLook();if(P.text.veil==null)L.veil=0;if(veil&&!look){L.veil=1;if(L.hair==='short'||L.hair==='none')L.hair='bob'}if(stole!=null&&!look)L.stole=stole;this.applyLook(L);
    if(cape!=null){const cm=new THREE.MeshLambertMaterial({color:cape,side:THREE.DoubleSide});const c=new THREE.Mesh(new THREE.CylinderGeometry(.27,.47,.58,22,1,true),cm);c.position.y=.33;this.torso.add(c);
      [[0,.3],[Math.PI,.3]].forEach(([ry])=>{const s1=new THREE.Mesh(new THREE.CylinderGeometry(.275,.475,.585,8,1,true,ry-.16,.32),GOLD);s1.position.y=.33;this.torso.add(s1)});
      this.host=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.015,20),new THREE.MeshBasicMaterial({color:0xfffbea}));this.host.rotation.x=Math.PI/2;this.host.position.set(0,1.66,.22);this.host.visible=false;this.torso.add(this.host);const hg=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.8}));hg.scale.set(.9,.9,1);hg.position.set(0,1.66,.2);hg.visible=false;this.torso.add(hg);this.hostGlow=hg}
    head.userData.avatar=this;body.userData.avatar=this;pickables.push(head,body);
    this.root.scale.setScalar(scale);this.scale=scale;
    world.add(this.root);
  }
  applyLook(L){this.look={...L};this.skinParts.forEach(m=>m.material=skinMats[L.skin%skinMats.length]);if(L.stole!=null)this.panels.forEach(m=>m.material=stoleMats[L.stole%stoleMats.length]);
    if(this.lookG)this.headP.remove(this.lookG);const g=new THREE.Group();g.position.y=.4;this.lookG=g;this.headP.add(g);const hm=hairMats[L.hairC%hairMats.length];
    const add=(geo,mat,y=0,rx=0,z=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(0,y,z);m.rotation.x=rx;g.add(m);return m};
    if(L.hair!=='none'){add(HG.cap,hm,.01,-.4);if(L.hair==='bob')add(HG.bob,hm,-.1);if(L.hair==='long')add(HG.long,hm,-.3);if(L.hair==='bun')add(HG.bun,hm,.27,0,-.33)}
    if(L.veil){const vm=veilMats[L.veil];add(HG.vcap,vm,.01,-.56);add(HG.vdrape,vm,-.26)}}
  remove(){world.remove(this.root);if(this.seat)this.seat.occ=null;for(let i=pickables.length-1;i>=0;i--)if(pickables[i].userData.avatar===this)pickables.splice(i,1)}
  goTo(pts,cb){this.slide=null;this.path=pts.map(p=>new THREE.Vector3(p.x,0,p.z));this.onArrive=cb||null}
  standUp(){this.slide=null;if(this.seat){const s=this.seat;this.seat.occ=null;this.seat=null;this.mode='stand';this.pos.x=s.ex;this.pos.z=s.ez}else if(this.mode!=='stand')this.mode='stand'}
  sitAt(s){s.occ=this;this.seat=s;this.mode='sit';this.slide=seatPt(s,'sit');this.tRotY=s.rot??Math.PI}
  doCross(){if(this.crossT<0)this.crossT=0}
  update(dt){
    // move
    this.moving=false;
    if(this.manual){const d=this.manual;this.path=[];this.onArrive=null;const st=this.speed*dt;let nx=this.pos.x+d.x*st,nz=this.pos.z+d.z*st;
      const W=P.walkable;if(W(nx,nz)){this.pos.x=nx;this.pos.z=nz}else if(W(nx,this.pos.z))this.pos.x=nx;else if(W(this.pos.x,nz))this.pos.z=nz;
      this.tRotY=Math.atan2(d.x,d.z);this.moving=true}
    if(this.path.length){const t=this.path[0];const dx=t.x-this.pos.x,dz=t.z-this.pos.z,d=Math.hypot(dx,dz);
      if(d<.06){this.path.shift();if(!this.path.length&&this.onArrive){const cb=this.onArrive;this.onArrive=null;cb()}}
      else{const st=Math.min(d,this.speed*dt);this.pos.x+=dx/d*st;this.pos.z+=dz/d*st;this.tRotY=Math.atan2(dx,dz);this.moving=true}}
    if(this.slide){this.pos.lerp(this.slide,1-Math.exp(-dt*6));if(this.pos.distanceTo(this.slide)<.01)this.slide=null}
    let dr=this.tRotY-this.rotY;dr=Math.atan2(Math.sin(dr),Math.cos(dr));this.rotY+=dr*(1-Math.exp(-dt*(this.moving?10:5)));this.root.rotation.y=this.rotY;
    // pose weights
    const k=1-Math.exp(-dt*6),w=this.w;
    w.sit+=((this.mode==='sit'?1:0)-w.sit)*k;w.kneel+=((this.mode==='kneel'?1:0)-w.kneel)*k;
    w.fold+=((this.fold||this.mode==='kneel'?1:0)-w.fold)*k;w.walk+=((this.moving?1:0)-w.walk)*(1-Math.exp(-dt*10));
    if(this.moving)this.walkPh+=dt*this.speed*6.2;
    const sw=Math.sin(this.walkPh)*w.walk;
    this.bp.position.y=-.2*w.kneel+.17*w.sit+Math.abs(Math.sin(this.walkPh))*.035*w.walk;
    this.legs[0].rotation.x=sw*.5+w.kneel*1.3-w.sit*1.45;this.legs[1].rotation.x=-sw*.5+w.kneel*1.3-w.sit*1.45;
    const [aL,aR]=this.arms;
    let lx=-sw*.35,lz=.4,rx=sw*.35,rz=-.4;
    lx=lerp(lx,-1.35,w.fold);lz=lerp(lz,-.5,w.fold);rx=lerp(rx,-1.35,w.fold);rz=lerp(rz,.5,w.fold);
    let bow=0;
    if(this.crossT>=0){this.crossT+=dt;const K=[[0,rx,rz],[.38,-2.55,.5],[.6,-2.55,.5],[.95,-1.4,.55],[1.15,-1.4,.55],[1.5,-1.9,1.05],[1.7,-1.9,1.05],[2.05,-1.9,.05],[2.25,-1.9,.05],[2.7,rx,rz]];
      const t=this.crossT;let i=0;while(i<K.length-2&&t>K[i+1][0])i++;const a=K[i],b=K[i+1],u=clamp((t-a[0])/(b[0]-a[0]),0,1),e=u*u*(3-2*u);rx=lerp(a[1],b[1],e);rz=lerp(a[2],b[2],e);
      bow=Math.sin(Math.min(t/2.7,1)*Math.PI)*.18;if(t>2.7)this.crossT=-1}
    if(this.reachT>=0){this.reachT+=dt;const u=Math.sin(Math.min(this.reachT/1.6,1)*Math.PI);rx=lerp(rx,-1.3,u);rz=lerp(rz,.15,u);if(this.reachT>1.6)this.reachT=-1}
    if(this.bowT>=0){this.bowT+=dt;bow=Math.max(bow,Math.sin(Math.min(this.bowT/1.4,1)*Math.PI)*.35);if(this.bowT>1.4)this.bowT=-1}
    if(this.beatT>=0){this.beatT+=dt;const T=this.beatT,inn=Math.min(1,T/.3,Math.max(0,(2.2-T)/.3));const ph=T>.3&&T<1.95?Math.max(0,Math.sin((T-.3)/.55*Math.PI*2)):0;
      rx=lerp(rx,-1.35,inn);rz=lerp(rz,.75,inn);this.arms[1].position.z=.04+inn*(.06-ph*.08);bow=Math.max(bow,.12*inn);if(T>2.2){this.beatT=-1;this.arms[1].position.z=.04}}
    w.sing+=((this.sing?1:0)-w.sing)*k;w.elev+=((this.elev?1:0)-w.elev)*(1-Math.exp(-dt*3));
    if(w.elev>.01||this.host){lx=lerp(lx,-2.75,w.elev);lz=lerp(lz,-.3,w.elev);rx=lerp(rx,-2.75,w.elev);rz=lerp(rz,.3,w.elev);if(this.host){this.host.visible=this.hostGlow.visible=w.elev>.6}}
    aL.rotation.set(lx,0,lz);aR.rotation.set(rx,0,rz);
    const sg=Math.sin(performance.now()/1000*1.7+this.ph)*w.sing;
    this.torso.rotation.x=bow*.6+w.kneel*.1+w.fold*.04;this.torso.rotation.z=sg*.07;this.headP.rotation.x=bow*.8+w.fold*.2-w.sing*.12;this.headP.rotation.z=sg*.1;
    this.shadow.material.opacity=1;
  }
}
/* seats: every seat has sit (x,z), exit (ex,ez), kneel (kx,kz), stand (sx,sz) points and a facing rot */
function seatPt(s,m){return m==='kneel'?new THREE.Vector3(s.kx,0,s.kz):m==='stand'?new THREE.Vector3(s.sx,0,s.sz):m==='exit'?new THREE.Vector3(s.ex,0,s.ez):new THREE.Vector3(s.x,0,s.z)}

/* ---------- keyboard walking ---------- */
const keys=new Set();
const KMAP={ArrowUp:'f',KeyW:'f',ArrowDown:'b',KeyS:'b',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r'};
const typing=e=>/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||'');
addEventListener('keydown',e=>{if(typing(e)||!KMAP[e.code])return;e.preventDefault();if(!entered||!me||(P.keyBlock&&P.keyBlock()))return;
  if(!keys.size){if(me.seat||me.mode!=='stand'){setPray(false);me.standUp();me.mode='stand'}P.onKeyWalk&&P.onKeyWalk()}
  keys.add(KMAP[e.code])});
addEventListener('keyup',e=>{if(KMAP[e.code])keys.delete(KMAP[e.code])});
addEventListener('blur',()=>keys.clear());
function keyDir(){if(!keys.size)return null;const f=(keys.has('f')?1:0)-(keys.has('b')?1:0),r=(keys.has('r')?1:0)-(keys.has('l')?1:0);if(!f&&!r)return null;
  const fx=-Math.sin(cam.yaw),fz=-Math.cos(cam.yaw),rx=-fz,rz=fx;let x=fx*f+rx*r,z=fz*f+rz*r;const n=Math.hypot(x,z);return {x:x/n,z:z/n}}

/* ---------- people ---------- */
let me=null;const others=[];
const toastQ=[];let toastBusy=false,lastOtherToast=0;
function toast(msg,{other=false}={}){if(other){if(settings.notify!=='1')return;const n=performance.now();if(n-lastOtherToast<6500||toastQ.length>1)return;lastOtherToast=n}toastQ.push(msg);if(!toastBusy)nextToast()}
function nextToast(){const m=toastQ.shift();if(!m){toastBusy=false;return}toastBusy=true;const el=$('#toast');el.textContent=m;el.classList.add('show');setTimeout(()=>{el.classList.remove('show');setTimeout(nextToast,550)},3000)}
const updateCount=()=>{$('#count').textContent=others.length+1};
function seatFree(){const f=P.slots.filter(s=>!s.occ);return f.length?pick(f):null}
function spawnOther({atDoor=false}={}){const used=new Set(others.map(o=>o.name).concat([myName]));let n;do{n=makeName()}while(used.has(n));
  const a=new Avatar({name:n,scale:Math.random()<.15?.82:rand(.95,1.05)});a.ai={t:rand(4,14),idle:rand(10,40),leaveAt:rand(120,520)};others.push(a);
  if(atDoor){a.pos.set(P.door.x+rand(-.6,.6),0,P.door.z);a.rotY=a.tRotY=P.door.rot??Math.PI;aiChoose(a,true)}
  else{const s=Math.random()<(P.seatedRate??.72)?seatFree():null;
    if(s){a.pos.copy(seatPt(s,'sit'));a.sitAt(s);a.slide=null;if(P.kneels!==false&&Math.random()<.3){a.mode='kneel';a.pos.copy(seatPt(s,'kneel'))}}
    else if(!(P.placeInitial&&P.placeInitial(a))){const p=P.randomSpot();a.pos.set(p.x,0,p.z);a.rotY=a.tRotY=rand(0,6.28)}}
  updateCount();return a}
function aiChoose(a,entering=false){a.standUp();a.fold=false;if(P.aiChoose&&P.aiChoose(a,entering))return;
  const s=Math.random()<.8?seatFree():null;if(s){a.goTo(P.plan(a.pos,{x:s.ex,z:s.ez}),()=>{if(s.occ){aiChoose(a);return}a.sitAt(s)});return}
  const p=P.randomSpot();a.goTo(P.plan(a.pos,p),()=>{a.fold=Math.random()<.3})}
const near=(a,d)=>me&&a.pos.distanceTo(me.pos)<d;
function aiTick(a,dt){const ai=a.ai;ai.leaveAt-=dt;
  if(a.leaving){if(!a.path.length){a.remove();others.splice(others.indexOf(a),1);updateCount()}return}
  if(ai.leaveAt<0&&!a.path.length){a.leaving=true;a.standUp();a.goTo(P.plan(a.pos,{x:P.door.x+rand(-.5,.5),z:P.exitZ??P.door.z+.4}));return}
  if(a.path.length)return;
  ai.idle-=dt;if(ai.idle<0){ai.idle=rand(25,70);P.aiIdle&&P.aiIdle(a)}
  ai.t-=dt;if(ai.t<0){ai.t=rand(14,40);const r=Math.random();
    if(P.kneels!==false&&a.mode==='sit'&&r<.35){a.mode='kneel';a.pos.copy(seatPt(a.seat,'kneel'))}
    else if(a.mode==='kneel'&&a.seat&&r<.5){a.mode='sit';a.pos.copy(seatPt(a.seat,'sit'))}
    else if(r<.12)aiChoose(a)}}

/* ---------- me ---------- */
let myLook=store.get('look',{skin:0,hair:'short',hairC:0,veil:0,stole:0});
function makeMe(){me=new Avatar({name:myName,isMe:true,look:myLook});me.pos.set(P.start.x,0,P.start.z);me.rotY=me.tRotY=P.start.rot??Math.PI;$('#meName').textContent=myName;
  if(P.startWalk)me.goTo([P.startWalk])}
function moveMeTo(p,cb){setPray(false);me.standUp();me.goTo(P.plan(me.pos,p),cb)}
function prayUI(on){const b=$('#aPray');if(!b)return;b.classList.toggle('on',on);$('#aPrayL').textContent=P.text.pray[on?1:0]}
function setPray(on){if(!me)return;if(on){if(me.path.length){me.path=[];me.onArrive=null}
  me.mode='kneel';if(me.seat)me.slide=seatPt(me.seat,'kneel')}
  else if(me.mode==='kneel'){if(me.seat){me.mode='sit';me.slide=seatPt(me.seat,'sit')}else me.mode='stand'}
  prayUI(on)}

/* ---------- audio ---------- */
const Snd={ctx:null,master:null,muted:true,verb:null,amb:null,chantOn:false,
  init(){if(this.ctx)return;try{const C=window.AudioContext||window.webkitAudioContext;this.ctx=new C()}catch(e){return}const c=this.ctx;
    this.master=c.createGain();this.master.gain.value=0;this.master.connect(c.destination);
    const len=c.sampleRate*4,ir=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
    this.verb=c.createConvolver();this.verb.buffer=ir;this.wet=c.createGain();this.wet.gain.value=.9;this.verb.connect(this.wet);this.wet.connect(this.master);
    this.dry=c.createGain();this.dry.gain.value=.45;this.dry.connect(this.master);
    const nb=c.createBuffer(1,c.sampleRate*4,c.sampleRate),nd=nb.getChannelData(0);let last=0;for(let i=0;i<nd.length;i++){last=(last+.02*(Math.random()*2-1))/1.02;nd[i]=last*3.2}
    const src=c.createBufferSource();src.buffer=nb;src.loop=true;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=380;const g=c.createGain();g.gain.value=.05;src.connect(lp);lp.connect(g);g.connect(this.master);src.start()},
  out(){const g=this.ctx.createGain();g.connect(this.dry);g.connect(this.verb);return g},
  setMuted(m){this.muted=m;if(!m)this.init();if(!this.ctx)return;if(this.ctx.state==='suspended')this.ctx.resume();const t=this.ctx.currentTime;this.master.gain.cancelScheduledValues(t);this.master.gain.setTargetAtTime(m?0:.9,t,.25);
    $('#icoMute').style.display=m?'':'none';$('#icoSound').style.display=m?'none':''},
  
  bell(f=196,when=0,vol=.5){if(!this.ctx||this.muted)return;const c=this.ctx,t=c.currentTime+when,o=this.out();
    [[.5,.9,7],[1,1,5],[1.19,.55,3.5],[1.5,.4,3],[2,.5,2.5],[2.51,.25,1.6],[3.01,.18,1.2],[4.07,.1,.8]].forEach(([r,a,d])=>{const os=c.createOscillator(),g=c.createGain();os.frequency.value=f*r;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a*vol*.35,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+d);os.connect(g);g.connect(o);os.start(t);os.stop(t+d+.1)})},
  chime(){if(!this.ctx||this.muted)return;const c=this.ctx,t=c.currentTime,o=this.out();[[880,.0],[1318.5,.12]].forEach(([f,dl])=>{const os=c.createOscillator(),g=c.createGain();os.type='sine';os.frequency.value=f;g.gain.setValueAtTime(0,t+dl);g.gain.linearRampToValueAtTime(.07,t+dl+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dl+2.2);os.connect(g);g.connect(o);os.start(t+dl);os.stop(t+dl+2.3)})},
  coin(real=true){if(!this.ctx||this.muted)return;const c=this.ctx,t=c.currentTime,o=this.out();(real?[0,.09,.16]:[0]).forEach((d,i)=>{[3200,4710,6020].forEach((f,j)=>{const os=c.createOscillator(),g=c.createGain();os.frequency.value=f*(1-i*.04);g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.05/(j+1)*(real?1:.4),t+d+.003);g.gain.exponentialRampToValueAtTime(.0001,t+d+.35);os.connect(g);g.connect(o);os.start(t+d);os.stop(t+d+.4)})})},
  sanctus(){if(!this.ctx||this.muted)return;for(let i=0;i<3;i++)[1046,1318,1568].forEach((f,j)=>this.bell(f*.5,i*.12+j*.02,.18))},
  tick(){if(!this.ctx||this.muted)return;const c=this.ctx,t=c.currentTime,o=this.out(),os=c.createOscillator(),g=c.createGain();os.type='triangle';os.frequency.value=1650;g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+.08);os.connect(g);g.connect(o);os.start(t);os.stop(t+.1)},
  match(){if(!this.ctx||this.muted)return;const c=this.ctx,t=c.currentTime,b=c.createBuffer(1,c.sampleRate*.5,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
    const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=2200;f.Q.value=.8;const g=c.createGain();g.gain.value=.25;s.connect(f);f.connect(g);g.connect(this.out());s.start(t);this.chime()},
  // original modal melody (D dorian), beats
  MEL:[[62,2],[65,1],[67,1],[69,2],[69,1],[67,1],[69,1],[72,1],[71,1],[69,2],[67,1],[65,1],[67,2],[69,1],[67,1],[65,1],[64,1],[62,3],[0,1],
       [69,1],[69,1],[71,1],[72,2],[71,1],[69,1],[67,2],[65,1],[64,1],[65,1],[67,1],[65,1],[64,1],[62,3],[0,2]],
  voice(midi,t,dur,o,gain=.12){const c=this.ctx,f=440*Math.pow(2,(midi-69)/12);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.12);g.gain.setValueAtTime(gain,t+dur-.12);g.gain.linearRampToValueAtTime(0,t+dur+.08);
    const mix=c.createGain();mix.gain.value=1;[[700,6,1],[1220,7,.5],[2600,9,.18]].forEach(([fr,q,a])=>{const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=fr;bp.Q.value=q;const ga=c.createGain();ga.gain.value=a*3;mix.connect(bp);bp.connect(ga);ga.connect(g)});g.connect(o);
    const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=5.2;lg.gain.value=f*.006;lfo.connect(lg);
    [0,-7,6].forEach(dt=>{const os=c.createOscillator();os.type='sawtooth';os.frequency.value=f;os.detune.value=dt;lg.connect(os.frequency);os.connect(mix);os.start(t);os.stop(t+dur+.15)});lfo.start(t);lfo.stop(t+dur+.15)},
  startChant(){this.init();if(!this.ctx)return;if(this.muted)this.setMuted(false);this.chantOn=true;const c=this.ctx,o=this.out();o.gain.value=.8;this.chantOut=o;
    const drone=[38,45,50].map((m,i)=>{const os=c.createOscillator(),g=c.createGain();os.type='sine';os.frequency.value=440*Math.pow(2,(m-69)/12);g.gain.value=0;g.gain.setTargetAtTime([.05,.035,.025][i],c.currentTime,1.2);os.connect(g);g.connect(o);os.start();return {os,g}});this.drone=drone;
    const beat=.68;let i=0,t=c.currentTime+.6;const sched=()=>{if(!this.chantOn)return;while(t<c.currentTime+2.5){const [m,b]=this.MEL[i%this.MEL.length];if(m){this.voice(m,t,b*beat*.96,o);this.voice(m-12,t,b*beat*.96,o,.06)}t+=b*beat;i++}this.chantTimer=setTimeout(sched,400)};sched()},
  stopChant(){this.chantOn=false;clearTimeout(this.chantTimer);if(this.chantOut){const t=this.ctx.currentTime;this.chantOut.gain.setTargetAtTime(0,t,.4);const d=this.drone;setTimeout(()=>d.forEach(x=>x.os.stop()),2500)}}
};
/* ---------- interaction ---------- */
const cam={yaw:0,pitch:.32,dist:6.2,target:new THREE.Vector3(0,1.3,10)};
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
const ptrs=new Map();let drag=null,pinch0=null;
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===1)drag={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false};
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch0={d:Math.hypot(a.x-b.x,a.y-b.y),dist:cam.dist};drag&&(drag.moved=true)}});
canvas.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===2&&pinch0){const [a,b]=[...ptrs.values()];cam.dist=clamp(pinch0.dist*pinch0.d/Math.max(20,Math.hypot(a.x-b.x,a.y-b.y)),2.6,11);return}
  if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;if(Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>7)drag.moved=true;
    if(drag.moved){cam.yaw-=dx*.006;cam.pitch=clamp(cam.pitch+dy*.004,-.05,1.1)}}});
const endPtr=e=>{const had=ptrs.has(e.pointerId);ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=null;if(had&&drag&&ptrs.size===0){if(!drag.moved)tap(e.clientX,e.clientY);drag=null}};
canvas.addEventListener('pointerup',endPtr);canvas.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);drag=null;pinch0=null});
canvas.addEventListener('wheel',e=>{e.preventDefault();cam.dist=clamp(cam.dist*(1+e.deltaY*.001),2.6,11)},{passive:false});
let otherShown=null,otherTimer=0;
function tap(x,y){if(!me||!entered)return;ndc.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(ndc,camera);
  if(P.tapFirst&&P.tapFirst(x,y))return;
  const hits=ray.intersectObjects([...pickables,...P.floors,...(P.seatMeshes||[]),...(P.tapTargets||[])],true);
  for(const h of hits){const o=h.object;
    if(P.tapHit&&P.tapHit(h))return;
    if(o.userData.avatar){const a=o.userData.avatar;if(a===me)return;otherShown=a;otherTimer=3.2;$('#otherChip').textContent=a.name;$('#otherChip').classList.remove('hide');a.bowT=0;return}
    if(o.userData.kind==='seat'){const free=P.seatsForHit(h).filter(s=>!s.occ||s.occ===me);if(!free.length){toast('그 자리는 모두 차 있어요');return}
      const s=free.reduce((a,c)=>Math.hypot(c.x-h.point.x,c.z-h.point.z)<Math.hypot(a.x-h.point.x,a.z-h.point.z)?c:a);if(me.seat===s)return;
      s.occ=me;moveMeTo({x:s.ex,z:s.ez},()=>{me.sitAt(s)});return}
    if(o.userData.kind==='floor'){const p=P.clampFloor(h.point.x,h.point.z);moveMeTo(p,null);marker(p);return}}}
const mk=new THREE.Mesh(new THREE.RingGeometry(.16,.22,28),new THREE.MeshBasicMaterial({color:0xf3e6c0,transparent:true,opacity:0,depthWrite:false}));mk.rotation.x=-Math.PI/2;mk.position.y=.02;world.add(mk);
function nearestOnScreen(ps,x,y,r,ok){let bi=-1,bd=r;ps.forEach((p,i)=>{if(ok&&!ok[i])return;p.project(camera);const sx=(p.x*.5+.5)*innerWidth,sy=(-p.y*.5+.5)*innerHeight,d=Math.hypot(sx-x,sy-y);if(d<bd){bd=d;bi=i}});return bi}
function marker(p){mk.position.set(p.x,.02,p.z);mk.material.opacity=.8;mk.scale.setScalar(.6)}

/* ---------- sheets & panel ---------- */
const sheets=[...document.querySelectorAll('.sheet')].map(e=>'#'+e.id).filter(id=>id!=='#panel');
let panelOpen=false;
function openSheet(id){sheets.forEach(s=>$(s).classList.toggle('show',s===id));$('#scrim').classList.toggle('show',!(P.noScrim||[]).includes(id));
  document.querySelectorAll('[data-sheet-btn]').forEach(b=>b.classList.toggle('on',b.dataset.sheetBtn===id));
  $('#panel').classList.remove('show');if(me)me.fold=(P.foldSheets||[]).includes(id)||me.mode==='kneel'}
function closeSheets(){if($('#lookSheet').classList.contains('show')&&cam.focus&&cam.focus.look){cam.focus=null;if(me)me.tRotY=me.rotY+Math.PI}
  sheets.forEach(s=>$(s).classList.remove('show'));$('#scrim').classList.remove('show');document.querySelectorAll('[data-sheet-btn]').forEach(b=>b.classList.remove('on'));
  if(me)me.fold=false;if(panelOpen)$('#panel').classList.add('show')}
function toggleSheet(id,onOpen){if($(id).classList.contains('show'))closeSheets();else{openSheet(id);onOpen&&onOpen()}}
function panel({k,line,note,btns=[],prog}){
  $('#panelBody').innerHTML=`${prog!=null?`<div class="prog"><i style="width:${Math.round(prog*100)}%"></i></div>`:''}<div class="k"><span>${k}</span></div><div class="line">${line}</div>${note?`<div class="note">${note}</div>`:''}<div class="btns">${btns.map((b,i)=>`<button class="sbtn ${b.p?'primary':''}" data-i="${i}">${b.cls?`<span class="${b.cls}" style="display:inline-block">${b.ico||''}</span> `:''}${b.t}</button>`).join('')}</div>`;
  $('#panelBody').querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>btns[+el.dataset.i].f());
  panelOpen=true;$('#panel').classList.add('show')}
function hidePanel(){panelOpen=false;$('#panel').classList.remove('show')}
const setNote=t=>{const n=$('#panelBody .note');if(n)n.textContent=t};
function stopModes(except){P.stopModes&&P.stopModes(except);cam.focus=null;hidePanel()}
function congregation(p){others.forEach(o=>{if(!o.seat||o.path.length)return;o.mode=p;o.fold=p==='kneel';o.slide=seatPt(o.seat,p)})}
function mePose(p){if(!me||me.path.length)return;const s=me.seat;if(s){me.mode=p;me.slide=seatPt(s,p)}else me.mode=p==='sit'?'stand':p;prayUI(me.mode==='kneel')}
function greetNear(said,alone){if(!me)return;me.bowT=0;const nb=others.filter(o=>o.pos.distanceTo(me.pos)<5.5).sort((a,b)=>a.pos.distanceTo(me.pos)-b.pos.distanceTo(me.pos)).slice(0,3);
  if(!nb.length){setTimeout(()=>toast(alone),600);return}
  nb.forEach((o,i)=>setTimeout(()=>{o.bowT=0;if(i===0)toast(said(o))},700+i*500))}

/* ---------- quiz (shared engine; each place brings its own questions) ---------- */
const Quiz={qs:[],i:0,score:0,cfg:null,
  start(bank,cfg){stopModes();this.cfg=cfg;this.bank=bank;this.qs=[...bank].sort(()=>Math.random()-.5).slice(0,cfg.n||6);this.i=0;this.score=0;openSheet('#quiz');this.r()},
  r(){const B=$('#quizBody'),C=this.cfg;if(this.i>=this.qs.length){const pass=this.score>=(C.pass??this.qs.length-1);
      B.innerHTML=`<h3>${C.title} 결과</h3><div class="desc">${this.qs.length}문제 중 ${this.score}문제를 맞혔어요.</div>${pass?`<div class="stamp">${C.stamp}</div><div class="desc" style="text-align:center;margin-top:10px">${C.passMsg}</div>`:`<div class="desc" style="text-align:center;font-size:15px;color:var(--text);margin:18px 0 6px">${C.failLine}</div><div class="desc" style="text-align:center">${C.failMsg}</div>`}<div class="btns" style="display:flex;gap:8px;margin-top:12px"><button class="sbtn" style="flex:1" id="qAgain">다시 보기</button><button class="sbtn primary" style="flex:1" id="qDone">닫기</button></div>`;
      $('#qAgain').onclick=()=>this.start(this.bank,this.cfg);$('#qDone').onclick=()=>closeSheets();if(pass)Snd.chime();return}
    const q=this.qs[this.i];B.innerHTML=`<h3>${C.title} ${this.i+1} / ${this.qs.length}</h3><div class="desc">${C.desc}</div><div style="font-size:16px;font-weight:500;line-height:1.5;word-break:keep-all">${q.q}</div>${q.o.map((o,i)=>`<button class="qopt" data-i="${i}">${o}</button>`).join('')}<div class="qexp" id="qexp"></div>`;
    B.querySelectorAll('.qopt').forEach(el=>el.onclick=()=>{if(B.dataset.lock==='1')return;B.dataset.lock='1';const i=+el.dataset.i,ok=i===q.a;if(ok)this.score++;el.classList.add(ok?'ok':'no');B.querySelectorAll('.qopt')[q.a].classList.add('ok');
      $('#qexp').innerHTML=`${ok?'맞았어요. ':'아쉬워요. '}${q.e}<div style="margin-top:12px"><button class="sbtn primary" style="width:100%" id="qNext">${this.i===this.qs.length-1?'결과 보기':'다음 문제'}</button></div>`;Snd.tick();
      $('#qNext').onclick=()=>{B.dataset.lock='0';this.i++;this.r()}});B.dataset.lock='0'}};

/* ---------- top bar & settings ---------- */
$('#scrim').onclick=closeSheets;document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeSheets);
$('#bMute').onclick=()=>Snd.setMuted(!Snd.muted);
function chantUI(on){$('#bChant').classList.toggle('on',on);$('#chantLbl').textContent=P.text.music[on?1:0]}
$('#bChant').onclick=()=>{if(Snd.chantOn){Snd.stopChant();chantUI(false)}else{Snd.startChant();chantUI(true)}};
$('#bCount').onclick=()=>toast(`지금 ${others.length+1}명이 ${room.name}에 함께 머물고 있어요`);
$('#bRoom').onclick=()=>{renderRooms();openSheet('#roomSheet')};
function renderRooms(){$('#roomList').innerHTML=P.rooms.map(r=>`<button class="opt ${r===room?'sel':''}" data-r="${r.id}"><span><b>${r.name} ${roomNo[r.id]}</b><small>${r.desc}</small></span><span class="n">${r===room?others.length+1:Math.floor(rand(12,48))}명</span></button>`).join('');
  $('#roomList').querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=P.rooms.find(x=>x.id===b.dataset.r);closeSheets();if(r!==room)switchRoom(r)})}
function switchRoom(r){stopModes();$('#fade').classList.add('show');setTimeout(()=>{applyRoom(r);populate();me.standUp();me.mode='stand';me.path=[];const s=P.respawn||P.start;me.pos.set(s.x,0,s.z);me.rotY=me.tRotY=s.rot??Math.PI;cam.yaw=me.rotY-Math.PI;setPray(false);
  $('#fade').classList.remove('show');toast(`${r.name}에 들어왔어요`)},650)}
$('#bSet').onclick=()=>{$('#nameIn').value=myName;document.querySelectorAll('.seg').forEach(s=>s.querySelectorAll('button').forEach(b=>b.classList.toggle('sel',settings[s.dataset.key]===b.dataset.v)));openSheet('#setSheet')};
$('#nameRnd').onclick=()=>{$('#nameIn').value=makeName()};
$('#nameOk').onclick=()=>{const v=$('#nameIn').value.trim();if(v){myName=v;store.set('name',v);$('#meName').textContent=v;if(me)me.name=v}closeSheets()};
document.querySelectorAll('.seg').forEach(s=>s.querySelectorAll('button').forEach(b=>b.onclick=()=>{settings[s.dataset.key]=b.dataset.v;store.set(s.dataset.key,b.dataset.v);s.querySelectorAll('button').forEach(x=>x.classList.toggle('sel',x===b));if(s.dataset.key==='q'){applyPR();resize()}}));
$('#bShot').onclick=()=>{renderer.render(scene,camera);let url;try{url=canvas.toDataURL('image/jpeg',.9)}catch(e){return}$('#flash').style.transition='none';$('#flash').style.opacity=.85;requestAnimationFrame(()=>{$('#flash').style.transition='opacity .6s';$('#flash').style.opacity=0});
  Snd.tick();$('#shotImg').src=url;setTimeout(()=>openSheet('#shot'),250)};
$('#bExit').onclick=()=>{stopModes();entered=false;closeSheets();if(Snd.chantOn){Snd.stopChant();chantUI(false)}Snd.setMuted(true);$('#hud').classList.add('hide');$('#gate').classList.remove('hide');$('#gateSt').textContent=P.text.bye;$('#bEnter').textContent='다시 들어가기'};
const moreBtn=$('#aMore');if(moreBtn){moreBtn.dataset.sheetBtn='#moreSheet';moreBtn.onclick=()=>toggleSheet('#moreSheet')}
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{closeSheets();P.more[b.dataset.m]()});
const prayBtn=$('#aPray');if(prayBtn)prayBtn.onclick=()=>{if(me)setPray(me.mode!=='kneel')};

/* ---------- look ---------- */
function renderLook(){const L=myLook,hx=c=>'#'+c.toString(16).padStart(6,'0');
  const row=(lbl,key,items)=>`<div class="lr"><div class="ll">${lbl}</div><div class="ch">${items.map(([v,html,cls,bg])=>`<button class="${cls}${L[key]===v?' sel':''}"${bg!=null?` style="background:${hx(bg)}"`:''} data-k="${key}" data-v="${v}">${html}</button>`).join('')}</div></div>`;
  $('#lookBody').innerHTML=row('피부','skin',SKIN.map((c,i)=>[i,'','sw',c]))+row('머리 모양','hair',HAIRS.map(h=>[h,HAIRN[h],'tx']))+row('머리색','hairC',HAIRC.map((c,i)=>[i,'','sw',c]))
    +(P.text.veil!=null?row(P.text.veil,'veil',[[0,'안 쓰기','tx'],[1,'흰색','tx'],[2,'검정','tx']]):'')+row('옷 색','stole',STOLE.map((c,i)=>[i,'','sw',c]));
  $('#lookBody').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k,v=b.dataset.v;myLook={...myLook,[k]:k==='hair'?v:+v};me.applyLook(myLook);store.set('look',myLook);renderLook()})}
function openLook(){if(!me)return;stopModes();renderLook();openSheet('#lookSheet');me.path=[];me.onArrive=null;me.tRotY=cam.yaw;
  cam.focus={pos:new THREE.Vector3(me.pos.x,.6+me.bp.position.y,me.pos.z),dist:3.0,yaw:cam.yaw,pitch:.22,look:true}}
$('#lookOk').onclick=()=>{closeSheets();toast('새 모습으로 머물러요')};
$('#bLookSet').onclick=()=>openLook();
$('#bLookEnter').onclick=()=>{$('#bEnter').click();setTimeout(openLook,700)};

/* ---------- populate / enter ---------- */
function populate(){others.splice(0).forEach(o=>o.remove());P.slots.forEach(s=>{if(s.occ!==me)s.occ=null});const n=P.crowd?P.crowd(room):Math.floor(rand(22,30));for(let i=0;i<n;i++)spawnOther();updateCount()}
let entered=false;
const pcMode=matchMedia('(pointer:fine)').matches;
$('#bEnter').onclick=()=>{entered=true;$('#gate').classList.add('hide');$('#hud').classList.remove('hide');Snd.init();
  if(!store.get('seen',false)){store.set('seen',true);setTimeout(()=>toast(P.text.hint[pcMode?0:1]),900)}else setTimeout(()=>toast(`${room.name}에 들어왔어요`),700);
  setTimeout(()=>{const o=others.find(o=>!o.path.length&&o.pos.distanceTo(me.pos)<9)||others[0];if(o){o.bowT=0;toast(`${o.name}님이 고개 숙여 인사했어요`,{other:true})}},4800)};

/* ---------- loop ---------- */
const clock=new THREE.Clock();let spawnT=rand(10,25),bellCheck=new Date().getHours(),t=0;
const tmp=new THREE.Vector3();
function project(v,el,offY=0){tmp.copy(v).project(camera);const vis=tmp.z<1&&tmp.z>-1;el.style.transform=`translate(${(tmp.x*.5+.5)*innerWidth}px,${(-tmp.y*.5+.5)*innerHeight+offY}px) translate(-50%,-100%)`;return vis}
let spotAct=null;$('#spotChip').onclick=()=>{spotAct&&spotAct()};
function loop(){const dt=Math.min(clock.getDelta(),.05);t+=dt;
  if(me){me.manual=entered&&!cam.focus?keyDir():null;me.update(dt)}others.forEach(o=>{aiTick(o,dt);o.update(dt)});
  if(entered){spawnT-=dt;if(spawnT<0){spawnT=rand(20,50);const max=P.maxCrowd?P.maxCrowd(room):30;if(others.length<max){const a=spawnOther({atDoor:true});if(Math.random()<.5)toast(`${a.name}님이 조용히 들어왔어요`,{other:true})}}}
  flames.forEach(f=>{const u=f.userData;if(u.grow!=null&&u.grow<1)u.grow=Math.min(1,u.grow+dt*.8);const g=u.grow==null?1:u.grow;const fl=1+Math.sin(t*9+u.ph)*.07+Math.sin(t*23+u.ph*2)*.05;f.scale.set(.09*u.base*g*fl,.16*u.base*g*(2-fl),1);f.position.y=u.y+(f.scale.y-.16*u.base)*.3});
  P.update&&P.update(dt,t);
  if(mk.material.opacity>0){mk.material.opacity=Math.max(0,mk.material.opacity-dt*.9);mk.scale.setScalar(mk.scale.x+dt*.8)}
  if(me){const F=cam.focus;const tg=F?tmp.copy(F.pos):tmp.set(me.pos.x,1.25+me.bp.position.y*.6,me.pos.z);cam.target.lerp(tg,1-Math.exp(-dt*4));
    const Y=F?F.yaw:cam.yaw,Pt=F?F.pitch:cam.pitch,D=F?F.dist:cam.dist;if(F){let dY=Y-cam.yaw;dY=Math.atan2(Math.sin(dY),Math.cos(dY));cam.yaw+=dY*.06}
    const cp=Math.cos(Pt),off=new THREE.Vector3(Math.sin(cam.yaw)*cp,Math.sin(Pt),Math.cos(cam.yaw)*cp).multiplyScalar(D);
    const pos=cam.target.clone().add(off),B=P.camBounds;pos.x=clamp(pos.x,B.x[0],B.x[1]);pos.z=clamp(pos.z,B.z[0],B.z[1]);pos.y=clamp(pos.y,B.y[0],B.y[1]);camera.position.lerp(pos,1-Math.exp(-dt*8));camera.lookAt(cam.target.x,cam.target.y+.2,cam.target.z)}
  renderer.render(scene,camera);
  if(me&&entered){const hp=me.pos.clone();hp.y=(1.92+me.bp.position.y)*me.scale;$('#meChip').classList.toggle('hide',!project(hp,$('#meChip'),-4));
    if(otherShown){otherTimer-=dt;const op=otherShown.pos.clone();op.y=(1.92+otherShown.bp.position.y)*otherShown.scale;const v=project(op,$('#otherChip'),-4);if(otherTimer<0||!otherShown.root.parent||!v){$('#otherChip').classList.add('hide');otherShown=null}}
    const vc=$('#spotChip');const sp=(!me.path.length&&me.mode==='stand'&&me.reachT<0&&P.spot)?P.spot():null;
    if(sp){vc.classList.remove('hide');$('#spotLbl').textContent=sp.label;spotAct=sp.go;project(sp.pos,vc)}else{vc.classList.add('hide');spotAct=null}}
  requestAnimationFrame(loop)}

/* hour bells */
setInterval(()=>{const h=new Date().getHours();if(h!==bellCheck){bellCheck=h;if(settings.bells!=='1'||!entered)return;if(P.hourBell)P.hourBell(h)}},20000);

/* ---------- start (called by the place script once P is defined) ---------- */
function startSanctuary(){initRooms();applyRoom(room);populate();makeMe();cam.yaw=me.rotY-Math.PI;cam.target.set(me.pos.x,1.3,me.pos.z);
  $('#gateSt').textContent=P.text.opening;if(pcMode&&P.text.footPC)$('#gateFoot').innerHTML=P.text.footPC;
  setTimeout(()=>{$('#gateSt').textContent='문이 열렸어요';$('#bEnter').classList.add('ready');$('#bLookEnter').classList.add('ready')},900);
  loop()}
