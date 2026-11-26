/* 교회 — place script. Loaded after ../common/core.js.
   Concept: "나에게 맞는 교회 찾기" — the same sanctuary hosts three worship styles (찬양대 / 청년 밴드 / 금요 철야). */
const P={
  text:{pray:['기도하기','기도 마치기'],music:['찬양 듣기','찬양 듣는 중'],opening:'예배당 문을 여는 중',bye:'다음 주에 또 만나요',veil:null,
    hint:['방향키나 WASD로 걷고, 긴 의자를 클릭하면 앉아요','바닥을 누르면 걷고, 긴 의자를 누르면 앉아요'],
    footPC:'방향키나 WASD로 걷고, 바닥을 클릭해도 걸어요.<br>긴 의자를 클릭하면 앉고, 드래그로 둘러봐요.'},
  kneels:false};

/* ---------- textures & materials ---------- */
const carpetT=tex(128,128,(g,w,h)=>{g.fillStyle='#5a2a30';g.fillRect(0,0,w,h);speckle(g,w,h,2600,.09);g.strokeStyle='rgba(0,0,0,.08)';for(let i=0;i<w;i+=8){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke()}},{rep:[9,14]});
const panelT=tex(256,256,(g,w,h)=>{g.fillStyle='#e9e1d2';g.fillRect(0,0,w,h);g.strokeStyle='rgba(120,100,80,.18)';g.lineWidth=2;for(let x=0;x<w;x+=64){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}speckle(g,w,h,900,.04)},{rep:[6,2]});
const woodT=tex(128,128,(g,w,h)=>{g.fillStyle='#9a6a43';g.fillRect(0,0,w,h);for(let i=0;i<50;i++){g.strokeStyle=`rgba(${Math.random()<.5?60:170},${Math.random()<.5?35:110},20,${.08+Math.random()*.15})`;g.lineWidth=1+Math.random()*2;const y=Math.random()*h;g.beginPath();g.moveTo(0,y);g.bezierCurveTo(w*.3,y+rand(-5,5),w*.7,y+rand(-5,5),w,y+rand(-3,3));g.stroke()}});
const glowRect=tex(128,256,(g,w,h)=>{const gr=g.createRadialGradient(64,128,4,64,128,128);gr.addColorStop(0,'rgba(255,236,200,.95)');gr.addColorStop(.5,'rgba(255,210,150,.35)');gr.addColorStop(1,'rgba(255,200,140,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)});
const beamT=tex(32,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);
  const s=g.createLinearGradient(0,0,w,0);s.addColorStop(0,'rgba(0,0,0,1)');s.addColorStop(.3,'rgba(0,0,0,0)');s.addColorStop(.7,'rgba(0,0,0,0)');s.addColorStop(1,'rgba(0,0,0,1)');g.globalCompositeOperation='destination-out';g.fillStyle=s;g.fillRect(0,0,w,h)});
const M={
  carpet:new THREE.MeshLambertMaterial({map:carpetT}),wall:new THREE.MeshLambertMaterial({map:panelT}),
  wood:new THREE.MeshLambertMaterial({map:woodT}),woodDark:new THREE.MeshLambertMaterial({map:woodT,color:0x7a5a48}),
  cushion:new THREE.MeshLambertMaterial({color:0x7a2232}),ceiling:new THREE.MeshLambertMaterial({color:0xf1ece4}),
  stage:new THREE.MeshLambertMaterial({map:woodT,color:0xb89070}),dark:new THREE.MeshLambertMaterial({color:0x1c1b20}),
  metal:new THREE.MeshLambertMaterial({color:0x8d9096}),chrome:new THREE.MeshLambertMaterial({color:0xc9ccd2,emissive:0x222428}),
  white:new THREE.MeshLambertMaterial({color:0xf4f2ee}),drum:new THREE.MeshLambertMaterial({color:0x9b1c2c}),
  cymbal:new THREE.MeshLambertMaterial({color:0xd8b45a,emissive:0x2a1c04}),glass:new THREE.MeshLambertMaterial({color:0xcfe3f0,transparent:true,opacity:.18}),
  ceilLight:new THREE.MeshBasicMaterial({color:0xfff6e4}),win:new THREE.MeshBasicMaterial({color:0xf6f0e2}),
  neon:new THREE.MeshBasicMaterial({color:0xff2a3a}),led:new THREE.MeshBasicMaterial({color:0xffd9a0}),
};

/* ---------- build ---------- */
const HX=9.2,ZF=-14.2,ZB=13.2;
const floor=new THREE.Mesh(new THREE.PlaneGeometry(HX*2,ZB-ZF),M.carpet);floor.rotation.x=-Math.PI/2;floor.position.set(0,0,(ZF+ZB)/2);floor.userData.kind='floor';world.add(floor);
box(.3,7.8,ZB-ZF,M.wall,-HX-.15,3.9,(ZF+ZB)/2);box(.3,7.8,ZB-ZF,M.wall,HX+.15,3.9,(ZF+ZB)/2);box(HX*2,7.8,.3,M.wall,0,3.9,ZB+.15);
box(HX*2,7.8,.2,M.woodDark,0,3.9,ZF-.05);
box(HX*2,.2,ZB-ZF,M.ceiling,0,7.7,(ZF+ZB)/2);
box(.06,1.1,ZB-ZF,M.wood,-HX+.02,.55,(ZF+ZB)/2);box(.06,1.1,ZB-ZF,M.wood,HX-.02,.55,(ZF+ZB)/2);
const ceilPanels=[];for(let z=-11;z<=11;z+=4.4)for(const x of[-5,0,5]){const m=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.9),M.ceilLight);m.rotation.x=Math.PI/2;m.position.set(x,7.58,z);world.add(m);ceilPanels.push(m)}
for(const z of[-6,-2,2,6])for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(1.4,3.8),M.win);w.position.set(s*(HX-.01),3.9,z);w.rotation.y=-s*Math.PI/2;world.add(w)}
// stage
box(17,.8,4.6,M.stage,0,.4,-11.9);box(5,.4,.6,M.stage,0,.2,-9.3);
const ledStrip=box(17,.04,.04,M.led,0,.78,-9.58);
const pulpit=new THREE.Group();pulpit.position.set(0,.8,-10.55);world.add(pulpit);box(1.3,1.12,.66,M.wood,0,.56,0,pulpit);box(1.4,.06,.8,M.woodDark,0,1.14,-.05,pulpit);
box(.07,.36,.02,GOLD,0,.62,.34,pulpit);box(.22,.07,.02,GOLD,0,.7,.34,pulpit);
// cross with backlight
const crossGlow=new THREE.Mesh(new THREE.PlaneGeometry(4.2,6.4),new THREE.MeshBasicMaterial({map:glowRect,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.75}));crossGlow.position.set(0,4.4,ZF+.08);world.add(crossGlow);
box(.42,4.6,.22,M.wood,0,4.3,ZF+.2);box(2.7,.42,.22,M.wood,0,5.25,ZF+.2);
// screens
function screenTex(){const c=document.createElement('canvas');c.width=512;c.height=288;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return {c,t}}
const screens=[-1,1].map(s=>{const st=screenTex();const fr=box(4.6,2.7,.08,M.dark,s*6.35,4.9,-13.55);fr.rotation.y=-s*.22;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.48),new THREE.MeshBasicMaterial({map:st.t}));m.position.set(s*6.33,4.9,-13.49);m.rotation.y=-s*.22;world.add(m);return st});
let screenState={head:'',l1:'',l2:''};
function drawScreens(head,l1,l2=''){screenState={head,l1,l2};screens.forEach(({c,t})=>{const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,288);gr.addColorStop(0,'#1d2540');gr.addColorStop(1,'#0e1020');g.fillStyle=gr;g.fillRect(0,0,512,288);
  g.fillStyle='rgba(236,217,168,.85)';g.font='600 20px "Noto Sans KR",sans-serif';g.textAlign='center';g.fillText(head,256,48);
  g.fillStyle='#fff';g.font='700 34px "Noto Sans KR",sans-serif';g.fillText(l1,256,l2?140:160);if(l2){g.font='700 34px "Noto Sans KR",sans-serif';g.fillText(l2,256,196)}t.needsUpdate=true})}
// speakers
[-1,1].forEach(s=>{const sp=box(.75,1.6,.7,M.dark,s*7.7,6.1,-9.6);sp.rotation.y=-s*.4});
// choir risers (stage left)
const choirG=new THREE.Group();world.add(choirG);[[.22,-11.4],[.44,-12.1],[.66,-12.8]].forEach(([h,z])=>box(5.2,h,.7,M.woodDark,-5.4,.8+h/2,z,choirG));
// band (stage right)
const bandG=new THREE.Group();world.add(bandG);
(()=>{const g=bandG;const kd=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.42,20),M.drum);kd.rotation.x=Math.PI/2;kd.position.set(5.4,1.18,-12.55);g.add(kd);
  [[5.05,1.5,-12.4,.17],[5.75,1.5,-12.4,.17],[6.1,1.25,-12.2,.22]].forEach(([x,y,z,r])=>{const d=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.22,16),M.drum);d.position.set(x,y,z);d.rotation.x=.3;g.add(d)});
  [[4.6,1.95,-12.6],[6.3,2.0,-12.6],[6.2,1.6,-12.0]].forEach(([x,y,z])=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.015,20),M.cymbal);c.position.set(x,y,z);c.rotation.z=.15;g.add(c);box(.02,y-.8,.02,M.metal,x,.8+(y-.8)/2,z,g)});
  box(1.9,1.3,.03,M.glass,5.4,1.45,-11.75,g);
  box(1.4,.08,.42,M.dark,3.2,1.65,-12.3,g);box(.05,.8,.05,M.metal,2.7,1.2,-12.3,g);box(.05,.8,.05,M.metal,3.7,1.2,-12.3,g);
  box(.7,.6,.4,M.dark,7.1,1.1,-11.4,g);
  [[-1.3,-10.2],[1.3,-10.2]].forEach(([x,z])=>{box(.025,1.45,.025,M.chrome,x,1.52,z,g);box(.05,.12,.05,M.dark,x,2.28,z+.04,g)});
  box(.5,.5,.5,M.dark,5.4,1.05,-13.15,g)})();
// stage beams
const beamMat=[0,1].map(()=>new THREE.MeshBasicMaterial({map:beamT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,opacity:0}));
const beams=[];for(let i=0;i<6;i++){const g=new THREE.Group();g.position.set(-6+i*2.4,7.4,-11.6);const m1=new THREE.Mesh(new THREE.PlaneGeometry(.9,7.2),beamMat[i%2]);m1.position.y=-3.6;const m2=m1.clone();m2.rotation.y=Math.PI/2;g.add(m1,m2);world.add(g);beams.push(g)}
const stageL=[new THREE.PointLight(0xffe2b8,0,14,1.2),new THREE.PointLight(0xffe2b8,0,14,1.2)];stageL[0].position.set(-3.5,4,-9.5);stageL[1].position.set(3.5,4,-9.5);stageL.forEach(l=>scene.add(l));
// foyer: neon cross, doors, offering box, ATM, welcome desk
box(.14,1.3,.08,M.neon,0,6.0,ZB-.05);box(.8,.14,.08,M.neon,0,6.25,ZB-.05);
box(3.6,3.2,.08,M.glass,0,1.6,ZB-.05);box(.08,3.2,.12,M.metal,0,1.6,ZB-.06);
const oboxG=new THREE.Group();oboxG.position.set(-4.2,0,11.8);world.add(oboxG);box(.62,.95,.46,M.wood,0,.475,0,oboxG);box(.36,.025,.06,M.dark,0,.96,0,oboxG);
oboxG.traverse(o=>o.userData.kind='obox');
function signTex(text,sub,bg='#1d2540'){return tex(256,96,(g,w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle='#fff';g.textAlign='center';g.font='700 34px "Noto Sans KR",sans-serif';g.fillText(text,w/2,sub?46:60);if(sub){g.font='500 18px "Noto Sans KR",sans-serif';g.fillStyle='rgba(255,255,255,.75)';g.fillText(sub,w/2,78)}})}
const atmG=new THREE.Group();atmG.position.set(-8.6,0,11.2);atmG.rotation.y=Math.PI/2;world.add(atmG);
box(.85,1.75,.6,M.white,0,.875,0,atmG);box(.75,.5,.04,new THREE.MeshBasicMaterial({color:0x4d8ff0}),0,1.3,.31,atmG);box(.3,.04,.04,M.dark,0,1.0,.31,atmG);
const atmSign=new THREE.Mesh(new THREE.PlaneGeometry(.9,.34),new THREE.MeshBasicMaterial({map:signTex('헌금 ATM','인출 · 헌금 · 자동이체')}));atmSign.position.set(0,1.95,.31);atmG.add(atmSign);
atmG.traverse(o=>o.userData.kind='atm');
const deskG=new THREE.Group();deskG.position.set(6.6,0,11.2);world.add(deskG);box(2,.8,.7,M.wood,0,.4,0,deskG);
const deskSign=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.5),new THREE.MeshBasicMaterial({map:signTex('새가족 환영','처음 오셨나요?','#3d6b4f')}));deskSign.position.set(0,1.05,.36);deskG.add(deskSign);
box(.3,.02,.22,M.white,-.5,.81,.05,deskG);box(.12,.14,.12,new THREE.MeshLambertMaterial({color:0xe9c46a}),.55,.87,.05,deskG);
deskG.traverse(o=>o.userData.kind='desk');

// pews (instanced) & seats
const ROWS=[];for(let i=0;i<10;i++)ROWS.push(-7.4+i*1.5);
const benches=[];ROWS.forEach((z,ri)=>[-4.3,4.3].forEach(x=>benches.push({x,z,row:ri})));
const pewParts=[[new THREE.BoxGeometry(6.6,.08,.48),M.wood,[0,.44,0],0],[new THREE.BoxGeometry(6.5,.06,.44),M.cushion,[0,.51,0],0],[new THREE.BoxGeometry(6.6,.62,.06),M.wood,[0,.82,.26],-.1],
  [new THREE.BoxGeometry(.07,.9,.62),M.woodDark,[-3.33,.45,.05],0],[new THREE.BoxGeometry(.07,.9,.62),M.woodDark,[3.33,.45,.05],0],[new THREE.BoxGeometry(6.4,.14,.1),M.woodDark,[0,.66,.34],0]];
const pewMeshes=[];const dm=new THREE.Object3D();
pewParts.forEach(([g,m,o,rx])=>{const im=new THREE.InstancedMesh(g,m,benches.length);benches.forEach((b,i)=>{dm.position.set(b.x+o[0],o[1],b.z+o[2]);dm.rotation.set(rx,0,0);dm.updateMatrix();im.setMatrixAt(i,dm.matrix)});im.userData.kind='seat';world.add(im);pewMeshes.push(im)});
const slots=[];benches.forEach((b,bi)=>[-2.5,-1.5,-.5,.5,1.5,2.5].forEach(o=>{const x=b.x+o;slots.push({x,z:b.z,lane:b.z-.5,ex:x,ez:b.z-.5,kx:x,kz:b.z,sx:x,sz:b.z-.3,rot:Math.PI,bench:bi,occ:null})}));

/* ---------- navigation ---------- */
const NAV=pewNav({rows:ROWS,bx:[1.0,7.65],cross:[-8.45,7.7],bounds:{x:8.85,z0:-9.0,z1:12.7},
  block:(x,z)=>(x<-7.9&&z>10.6&&z<11.8)||(Math.abs(x+4.2)<.45&&Math.abs(z-11.8)<.4)||(x>5.5&&x<7.7&&z>10.75&&z<11.65)});
const SPOTS={obox:{x:-4.2,z:11.15,rot:0},atm:{x:-7.55,z:11.2,rot:-Math.PI/2},desk:{x:6.6,z:10.4,rot:0},greet:{x:1.6,z:12.35,rot:Math.PI}};

/* ---------- lights & rooms ---------- */
const ROOMS=[
  {id:'choir',name:'찬양대 예배',desc:'가운 입은 찬양대와 오르간, 차분한 아멘',p:{sky:0xfff5e8,gnd:0x3e3028,hemi:1.35,sun:0xfff2dc,sunI:1.1,sunP:[6,14,10],fog:0x2c2824,fogD:.01,exp:1.05,stage:[0xffe2b8,0xffe2b8],stageI:1.2,beams:0,ceil:1,win:1,led:0xffd9a0}},
  {id:'band',name:'청년 예배',desc:'밴드와 무대 조명, 손 들고 찬양',p:{sky:0xc8c8ff,gnd:0x2a2433,hemi:.95,sun:0x9aa0ff,sunI:.35,sunP:[4,12,8],fog:0x15131d,fogD:.012,exp:1.1,stage:[0x4a7dff,0xc04aff],stageI:3,beams:.2,ceil:.22,win:.3,led:0x6a8cff}},
  {id:'revival',name:'금요 철야',desc:'워십댄스, 할렐루야, 통성기도',p:{sky:0xffb6a6,gnd:0x2a1a1c,hemi:.8,sun:0xff8a70,sunI:.3,sunP:[4,12,8],fog:0x150d10,fogD:.013,exp:1.12,stage:[0xff4a4a,0xffb040],stageI:3.2,beams:.24,ceil:.16,win:.12,led:0xff5a4a}},
];
const SCREEN_IDLE={choir:['주일 예배 · 오전 11시','환영합니다','오늘도 함께해 주셔서 감사해요'],band:['청년 예배 · 오후 2시','함께 찬양해요',''],revival:['금요 철야 · 밤 9시','오늘 밤, 다시 일어서요','']};

/* ---------- performers (per worship style) ---------- */
let perf=[];
function addPerf(opts,x,y,z,rot,setup){const a=new Avatar({name:makeName(),...opts});a.pos.set(x,y,z);a.rotY=a.tRotY=rot;setup&&setup(a);perf.push(a);return a}
function setPerformers(id){perf.forEach(a=>a.remove());perf=[];choirG.visible=id==='choir';bandG.visible=id!=='choir';
  if(id==='choir'){[[.22,-11.4],[.44,-12.1],[.66,-12.8]].forEach(([h,z],r)=>{for(let i=0;i<5;i++)addPerf({robeC:0x4b1f2c,stoleC:0xeee3c8},-7.4+i*1.0+(r%2)*.4,.8+h,z,.35,a=>{a.sing=true;a.fold=true})})}
  else{addPerf({robeC:0x2b2b33},5.4,.8,-13.15,0,a=>{a.mode='sit';a.sing=true});addPerf({robeC:0x3b4a5c},3.2,.8,-12.85,0,a=>{a.sing=true});addPerf({robeC:0x6b4a3a},7.0,.8,-12.0,-.3,a=>{a.sing=true});
    addPerf({robeC:0xf0ece4},-1.3,.8,-10.65,0,a=>{a.sing=true});addPerf({robeC:0xf0ece4},1.3,.8,-10.65,0,a=>{a.sing=true});
    if(id==='revival')[-4.4,-3.2,3.2,4.4].forEach(x=>addPerf({robeC:0xfbfaf6,stoleC:0xd9b25c},x,.8,-10.3,0,a=>{a.dance=true}))}}
// greeter & welcome desk staff (always there)
const greeter=new Avatar({name:'안내위원',robeC:0x23304a,stoleC:0xf4f0e6,look:{skin:3,hair:'bob',hairC:1,veil:0}});greeter.pos.set(1.6,0,11.6);greeter.rotY=greeter.tRotY=0;
const staff=new Avatar({name:'새가족부',robeC:0x3d6b4f,stoleC:0xf4f0e6,look:{skin:0,hair:'short',hairC:0,veil:0}});staff.pos.set(6.6,0,11.95);staff.rotY=staff.tRotY=Math.PI;
// pastor, elder, ushers (appear during services)
const pastor=new Avatar({name:'담임목사님',robeC:0x1f2a44,stoleC:0xf4f2ee,look:{skin:3,hair:'short',hairC:0,veil:0}});pastor.root.visible=false;pastor.pos.set(0,-50,0);
const guest=new Avatar({name:'부흥 강사님',robeC:0x55555f,stoleC:0xf4f2ee,look:{skin:2,hair:'short',hairC:4,veil:0}});guest.root.visible=false;guest.pos.set(0,-50,0);
const elder=new Avatar({name:'장로님',robeC:0x2e2a28,stoleC:0xf4f2ee,look:{skin:1,hair:'short',hairC:4,veil:0}});elder.root.visible=false;elder.pos.set(0,-50,0);
const ushers=[0,1].map(i=>{const u=new Avatar({name:'성찬위원',robeC:0x1c1c22,stoleC:0xf4f2ee});u.root.visible=false;u.pos.set(0,-50,0);u.speed=1.3;return u});
const preacher=()=>room.id==='revival'?guest:pastor;
function toPulpit(a){a.root.visible=true;a.path=[];a.pos.set(0,.8,-11.35);a.rotY=a.tRotY=0;a.elev=false;a.pray=false}
function hide(a){a.root.visible=false;a.pos.set(0,-50,0);a.elev=false;a.pray=false}

/* ---------- music: three original styles, synthesized ---------- */
const mid=m=>440*Math.pow(2,(m-69)/12);
const CH={G:[55,59,62],D:[57,62,66],Em:[55,59,64],C:[55,60,64],Am:[57,60,64],Bm:[54,59,62]};
const ROOT={G:43,D:38,Em:40,C:36,Am:45,Bm:47};
const PROG={choir:['G','C','G','D','G','Em','C','D'],band:['G','D','Em','C'],revival:['G','C','Em','D']};
const MELO={choir:[[71,2],[71,1],[72,1],[74,2],[72,2],[71,2],[69,2],[67,4],[67,2],[69,1],[71,1],[72,2],[71,2],[69,2],[67,1],[69,1],[71,4],[69,4],[67,4]],
  band:[[74,1.5],[71,.5],[71,1],[69,1],[67,2],[0,2],[69,1.5],[67,.5],[66,1],[67,1],[69,2],[0,2],[71,1.5],[67,.5],[67,1],[69,1],[71,2],[72,1],[71,1],[69,4],[0,4]],
  revival:[]};
const LYR={choir:[['높은 곳에서 낮은 곳까지','주님의 사랑 흐르네'],['지친 발걸음 멈춘 이곳에','고요한 평안 내리네'],['감사의 노래 모아 올리며','오늘도 주를 찬양해']],
  band:[['주님 앞에 내 맘 열어요','있는 모습 그대로'],['넘어진 날에도','다시 일으키시는 손'],['내 삶의 모든 순간','주를 노래해']],
  revival:[['기뻐하라 춤을 추라','우리 주님 오늘 일하신다'],['손뼉 치며 노래하자','할렐루야 할렐루야'],['두려움은 물러가고','새 힘이 솟아나네']]};
const Music={on:false,timer:null,out:null,
  start(r){const c=Snd.ctx;if(!c)return;this.stop(true);this.on=true;this.style=r.id;this.out=Snd.out();this.out.gain.value=0;this.out.gain.setTargetAtTime(.9,c.currentTime,.3);
    this.bpm={choir:66,band:72,revival:118}[this.style];this.beat=60/this.bpm;this.t=c.currentTime+.25;this.b=0;this.mi=0;this.mt=this.t;this.li=0;this.sched();this.lyric();
    others.forEach(o=>{o.ai.idle=Math.min(o.ai.idle,rand(1,6))})},
  stop(quiet){if(!this.on)return;this.on=false;clearTimeout(this.timer);clearTimeout(this.lt);const o=this.out;if(o&&Snd.ctx){o.gain.setTargetAtTime(0,Snd.ctx.currentTime,.3)}
    others.forEach(a=>{a.elev=false;a.dance=false});if(!quiet)drawScreens(...SCREEN_IDLE[room.id])},
  lyric(){if(!this.on)return;const L=LYR[this.style][this.li%LYR[this.style].length];drawScreens('찬양',L[0],L[1]);this.li++;this.lt=setTimeout(()=>this.lyric(),this.beat*8*1000)},
  sched(){if(!this.on)return;const c=Snd.ctx,ahead=c.currentTime+1.2,S=this.style,bt=this.beat,prog=PROG[S];
    while(this.t<ahead){const bar=Math.floor(this.b/4),pos=this.b%4,ch=prog[bar%prog.length],t=this.t;
      if(S==='choir'){if(pos===0){this.organ(CH[ch],t,bt*4);this.bass(ROOT[ch],t,bt*4,.1)}}
      else{if(pos===0)this.pad(CH[ch],t,bt*4);
        if(S==='band'){if(pos===0||pos===2)this.kick(t);if(pos===2.5)this.kick(t);if(pos===1||pos===3)this.snare(t);this.hat(t);this.hat(t+bt/2,.5);if(pos===0||pos===2)this.bass(ROOT[ch],t,bt*1.9,.16);
          [0,1,2,1].forEach((k,j)=>this.pluck(CH[ch][k]+12,t+j*bt/4,.035));}
        else{this.kick(t);if(pos===1||pos===3){this.snare(t);this.clap(t)}this.hat(t+bt/2,.8);this.bass(ROOT[ch],t,bt*.45,.16);this.bass(ROOT[ch]+12,t+bt/2,bt*.45,.1)}}
      this.t+=bt;this.b++}
    const mel=MELO[S];while(mel.length&&this.mt<ahead){const [m,d]=mel[this.mi%mel.length];if(m){if(S==='choir'){Snd.voice(m,this.mt,d*bt*.95,this.out,.09);Snd.voice(m-12,this.mt,d*bt*.95,this.out,.05)}else this.lead(m,this.mt,d*bt*.95)}this.mt+=d*bt;this.mi++}
    this.timer=setTimeout(()=>this.sched(),300)},
  osc(type,f,t,dur,g0,att=.02,rel=.2,dest=this.out){const c=Snd.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(g0,t+att);g.gain.setValueAtTime(g0,Math.max(t+att,t+dur-rel));g.gain.linearRampToValueAtTime(0,t+dur);o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.05);return o},
  organ(ns,t,d){ns.forEach(n=>[1,2,4].forEach((h,i)=>this.osc('sine',mid(n)*h,t,d,[.035,.018,.008][i],.08,.25)))},
  pad(ns,t,d){const c=Snd.ctx,lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1400;lp.connect(this.out);ns.forEach(n=>{this.osc('sawtooth',mid(n),t,d,.022,.4,.6,lp);this.osc('sawtooth',mid(n)*1.004,t,d,.016,.4,.6,lp)})},
  bass(n,t,d,g=.14){this.osc('triangle',mid(n),t,d,g,.01,.08)},
  pluck(n,t,g){const c=Snd.ctx,o=c.createOscillator(),gg=c.createGain();o.type='triangle';o.frequency.value=mid(n);gg.gain.setValueAtTime(g,t);gg.gain.exponentialRampToValueAtTime(.0001,t+.6);o.connect(gg);gg.connect(this.out);o.start(t);o.stop(t+.65)},
  lead(n,t,d){this.osc('sine',mid(n),t,d,.06,.03,.15);this.osc('triangle',mid(n)*2,t,d,.012,.03,.15)},
  noise(t,dur,f,q,g,type='bandpass'){const c=Snd.ctx,b=c.createBuffer(1,Math.ceil(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
    const s=c.createBufferSource();s.buffer=b;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const gg=c.createGain();gg.gain.value=g;s.connect(fl);fl.connect(gg);gg.connect(this.out);s.start(t)},
  kick(t){const c=Snd.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(.38,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(this.out);o.start(t);o.stop(t+.32)},
  snare(t){this.noise(t,.18,1900,.7,.16)},hat(t,v=1){this.noise(t,.05,8000,.5,.05*v,'highpass')},
  clap(t){[0,.012,.025].forEach(d=>this.noise(t+d,.06,1300,1.2,.12))}};
P.music=Music;

/* ---------- my actions ---------- */
const AMEN={choir:{n:[0,2],words:['아멘'],big:false},band:{n:[2,4],words:['아멘!','아멘'],big:false},revival:{n:[5,9],words:['아멘!!','할렐루야!','아멘!','주여!'],big:true}};
function crowdSay(words,n,radius=99,big=false){const pool=others.filter(o=>!o.leaving&&(!me||o.pos.distanceTo(me.pos)<radius)).sort(()=>Math.random()-.5).slice(0,n);
  pool.forEach((o,i)=>setTimeout(()=>say(o,pick(words),1.8,big),250+i*rand(120,260)))}
function myAmen(){if(!me)return;say(me,'아멘!',2,true);Snd.tick();const A=AMEN[room.id];crowdSay(A.words,Math.floor(rand(A.n[0],A.n[1]+1)),room.id==='revival'?99:8,A.big)}
let handsOn=false;
function setHands(on){if(!me)return;handsOn=on;me.elev=on;$('#aHands').classList.toggle('on',on);$('#aHandsL').textContent=on?'손 내리기':'손 들기'}
function greet(){greetNear(o=>`${o.name}님이 “축복합니다” 하고 인사했어요`,'축복합니다. 멀리 있는 이들에게도 닿기를');
  others.filter(o=>o.pos.distanceTo(me.pos)<5.5).slice(0,3).forEach((o,i)=>setTimeout(()=>say(o,pick(['축복합니다','사랑합니다','환영해요'])),700+i*500));say(me,'축복합니다',2)}

/* ---------- 통성기도 ---------- */
const Tong={on:false,murmur:null,
  start(){stopModes();this.on=true;const all=[me,...others];let k=0;
    panel({k:'통성기도',line:'다 함께 “주여!” 세 번 외치고 기도해요.',note:'소리 내어 기도해도, 마음으로 기도해도 좋아요.',btns:[{t:'그만하기',f:()=>stopModes()}]});
    const cry=()=>{if(!this.on)return;all.forEach(a=>a&&say(a,'주여!',1,true));Snd.tick();if(++k<3)setTimeout(cry,1300);else setTimeout(()=>this.pray(),1400)};setTimeout(cry,700)},
  pray(){if(!this.on)return;[me,...others].forEach(a=>{a.pray=true});setPray(true);this.noise();
    const words=['주님…','감사합니다','들어 주세요','도와주세요','주여…','은혜를 주세요','아버지…'];
    this.iv=setInterval(()=>crowdSay(words,3,99,false),1500);
    this.end=setTimeout(()=>{if(!this.on)return;crowdSay(['아멘','아멘!'],10);setTimeout(()=>{stopModes();toast('통성기도를 마쳤어요. 마음이 조금 가벼워졌나요?')},1500)},16000)},
  noise(){if(!Snd.ctx||Snd.muted)return;const c=Snd.ctx,b=c.createBuffer(1,c.sampleRate*3,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=520;f.Q.value=1.4;const g=c.createGain();g.gain.value=0;g.gain.setTargetAtTime(.22,c.currentTime,.6);
    const l=c.createOscillator(),lg=c.createGain();l.frequency.value=.7;lg.gain.value=.08;l.connect(lg);lg.connect(g.gain);l.start();s.connect(f);f.connect(g);g.connect(Snd.out());s.start();this.murmur={s,g,l}},
  stop(){if(!this.on)return;this.on=false;clearInterval(this.iv);clearTimeout(this.end);others.forEach(a=>a.pray=false);setPray(false);
    if(this.murmur){const m=this.murmur;m.g.gain.setTargetAtTime(0,Snd.ctx.currentTime,.4);setTimeout(()=>{m.s.stop();m.l.stop()},1500);this.murmur=null}}};

/* ---------- worship service ---------- */
const SERMON={choir:{title:'쉼이 필요한 당신에게',lines:['사랑하는 성도 여러분, 한 주간 평안하셨습니까?','바쁘게 달려온 우리에게 주님은 쉼을 허락하십니다.','오늘 이 자리에 앉아 계신 것, 그것만으로도 충분합니다.','무거운 짐은 내려놓고, 은혜로 채워 가시길 바랍니다.']},
  band:{title:'있는 그대로 괜찮아',lines:['여러분, 이번 주도 많이 애쓰셨죠?','잘하지 않아도, 있는 그대로 사랑받는 존재입니다.','넘어져도 괜찮아요. 다시 일으켜 주실 거예요.','이번 주도 서로 응원하며 살아가요!']},
  revival:{title:'다시 일어서는 밤',lines:['여러분! 오늘 밤 이 자리에 그냥 오신 게 아닙니다!','주님이 다시 일으켜 세우십니다! 믿습니까?!','지친 마음, 오늘 밤 다 내려놓으세요!','새 힘을 주실 줄 믿습니다! 할렐루야!']}};
const ELDER=['사랑의 하나님, 한 주간도 지켜 주셔서 감사합니다.','이 예배를 받아 주시고, 말씀 전하시는 분께 힘을 더하여 주옵소서.','이 자리에 처음 온 이들에게도 평안을 주옵소서.','예수님의 이름으로 기도합니다.'];
function seatMeFront(then){if(me.seat&&me.seat.z<4){then&&then();return}const f=slots.filter(s=>!s.occ&&s.z<0).sort((a,b)=>a.z-b.z||Math.abs(a.x)-Math.abs(b.x))[Math.floor(rand(0,4))];
  if(!f){then&&then();return}f.occ=me;toast('앞쪽 자리로 안내해 드릴게요');moveMeTo({x:f.ex,z:f.ez},()=>{me.sitAt(f);then&&setTimeout(then,600)})}
function stageView(){const z=(me.seat?me.seat.z:me.pos.z)+2.4,y=2.9,tz=-11,ty=1.6,dz=z-tz,dy=y-ty,d=Math.hypot(dz,dy);cam.focus={pos:new THREE.Vector3(me.pos.x*.45,ty,tz),dist:d,yaw:0,pitch:Math.atan2(dy,dz)}}
function handsView(){cam.focus={pos:new THREE.Vector3(me.pos.x,1.05,me.pos.z),dist:2.3,yaw:me.rotY+.85,pitch:.3}}
function talk(a,lines,gap,each,done){let i=0;const tick=()=>{if(!Service.on&&!Comm.on)return;if(i>=lines.length){done&&done();return}say(a,lines[i],gap/1000-.2);each&&each(lines[i],i);i++;Service.tt=setTimeout(tick,gap)};tick()}
const Service={on:false,i:0,tt:null,
  steps:[
    {k:'묵도',line:'예배를 시작하며 잠시 묵도해요.',pose:'sit',btns:[{t:'묵도',p:1,f(){setPray(true);others.forEach(o=>o.pray=true);setTimeout(()=>{others.forEach(o=>o.pray=false);setPray(false);Service.next()},3500)}}]},
    {k:'찬양',line:'함께 찬양해요.',pose:'stand',note:()=>({choir:'찬양대가 앞에서 찬양해요. 앉아서 따라 불러도 좋아요.',band:'손을 들어도, 일어서도 좋아요.',revival:'워십팀과 함께 춤춰도 좋아요!'})[room.id],
      btns:[{t:'손 들기',f(){setHands(!handsOn)}},{t:'다음 순서',p:1,f(){Service.next()}}],
      enter(){if(!Snd.chantOn){Snd.startChant();chantUI(true)}if(room.id==='choir')congregation('sit');else others.forEach(o=>{if(o.seat&&Math.random()<.6){o.elev=Math.random()<.6;o.dance=room.id==='revival'&&Math.random()<.4}})}},
    {k:'대표기도',line:'장로님이 대표로 기도하세요.',pose:'sit',note:'고개를 숙이고 함께 기도해요.',btns:[],enter(){if(Snd.chantOn){Snd.stopChant();chantUI(false)}setHands(false);toPulpit(elder);setPray(true);others.forEach(o=>o.pray=true);
      talk(elder,ELDER,3200,null,()=>{others.forEach(o=>o.pray=false);setPray(false);crowdSay(['아멘'],8);hide(elder);panel({k:'예배 · 대표기도',line:'“예수님의 이름으로 기도합니다.”',prog:Service.i/Service.steps.length,btns:[{t:'아멘',p:1,f(){myAmen();Service.next(1200)}}]})})}},
    {k:'설교',line:()=>`말씀 · 「${SERMON[room.id].title}」`,pose:'sit',note:()=>room.id==='revival'?'오늘은 외부에서 오신 부흥 강사님이세요. 목소리가 쩌렁쩌렁하네요.':'목사님 목소리가 참 좋으시네요.',
      btns:[{t:'아멘',f(){myAmen()}},{t:'다음 순서',p:1,f(){Service.next()}}],
      enter(){const pr=preacher();toPulpit(pr);drawScreens('오늘의 말씀',SERMON[room.id].title);const A=AMEN[room.id];
        talk(pr,SERMON[room.id].lines,room.id==='revival'?3000:3800,(l)=>{if(l.includes('?!')||room.id==='revival')setTimeout(()=>crowdSay(A.words,room.id==='revival'?12:A.n[1]+1,99,A.big),1400);else if(Math.random()<.5)setTimeout(()=>crowdSay(A.words,A.n[1],99),1600)})}},
    {k:'광고 · 새가족 환영',pose:'sit',line:()=>store.get('newcomer',false)?`“오늘 새가족으로 등록하신 ${myName}님, 환영합니다!”`:'“이번 주 처음 오신 분, 자리에서 일어나 주세요!”',
      btns:[{t:'일어나기',p:1,f(){mePose('stand');say(me,'(꾸벅)',1.6);setTimeout(()=>{[...others,...perf].forEach(o=>{o.clapT=0});Snd.coin(false);crowdSay(['환영합니다!','반가워요!','환영해요~'],6,99);toast('다들 박수로 환영해 줬어요 👏');setTimeout(()=>{mePose('sit');Service.next()},2800)},700)}},
        {t:'쑥스러워서 앉아 있기',f(){toast('괜찮아요. 마음이 편해질 때 일어나면 돼요');Service.next(1200)}}],
      enter(){const pr=preacher();say(pr,'광고 말씀드리겠습니다.',2.4);drawScreens('광고','청년부 겨울 수련회 신청','1층 교회 카페 오픈 · 새가족 환영')}},
    {k:'축도',pose:'sit',line:'“주님의 은혜와 사랑과 평강이 여러분과 함께하시기를 축원합니다.”',note:'목사님이 두 손을 들고 축복하세요. 고개를 숙여요.',btns:[{t:'아멘',p:1,f(){myAmen();Service.end()}}],
      enter(){const pr=preacher();pr.elev=true;setPray(true);others.forEach(o=>o.pray=true)}}],
  start(){stopModes();this.on=true;this.i=0;others.forEach(o=>o.ai.t=999);Snd.bell(392,0,.25);toast(`${room.name}가 곧 시작돼요`);
    seatMeFront(()=>{stageView();this.show()})},
  show(){if(!this.on)return;const s=this.steps[this.i];const v=x=>typeof x==='function'?x():x;congregation(s.pose==='stand'&&room.id==='choir'?'sit':s.pose);mePose(s.pose==='stand'&&room.id!=='choir'?'stand':'sit');
    panel({k:`예배 · ${s.k}`,line:v(s.line),note:v(s.note),prog:this.i/this.steps.length,btns:[...s.btns,{t:'나가기',f:()=>stopModes()}]});s.enter&&s.enter()},
  next(ms=500){const i=this.i;clearTimeout(this.tt);setTimeout(()=>{if(!this.on||this.i!==i)return;this.i++;if(this.i>=this.steps.length)this.end();else this.show()},ms)},
  end(quiet){if(!this.on)return;this.on=false;clearTimeout(this.tt);hidePanel();[pastor,guest,elder].forEach(hide);others.forEach(o=>{o.pray=false;o.elev=false;o.dance=false;o.ai.t=rand(8,30)});setPray(false);setHands(false);
    if(Snd.chantOn){Snd.stopChant();chantUI(false)}congregation('sit');mePose('sit');cam.focus=null;drawScreens(...SCREEN_IDLE[room.id]);if(!quiet)toast('예배가 끝났어요. 은혜 받으셨나요?')}};

/* ---------- communion ---------- */
let held=null;
function hold(kind){if(held)world.remove(held.mesh);const m=kind==='bread'?new THREE.Mesh(new THREE.BoxGeometry(.07,.05,.07),new THREE.MeshLambertMaterial({color:0xf3e3c0})):
  new THREE.Mesh(new THREE.CylinderGeometry(.04,.03,.08,12),new THREE.MeshLambertMaterial({color:0x6a1a4a,emissive:0x2a0418,transparent:true,opacity:.92}));world.add(m);held={mesh:m,up:0,gone:-1}}
function consume(){if(held){held.gone=0}}
const Comm={on:false,
  start(){stopModes();this.on=true;others.forEach(o=>o.ai.t=999);toast('성찬식은 보통 한 달에 한 번, 성찬 주일에 해요');
    seatMeFront(()=>{stageView();toPulpit(pastor);say(pastor,'오늘은 성찬 주일입니다.',2.6);
      panel({k:'성찬식',line:'목사님이 빵을 들어 감사 기도를 드려요.',note:'성찬위원들이 줄마다 빵을 돌려요.',btns:[{t:'나가기',f:()=>stopModes()}]});this.ushers(()=>this.bread())})},
  ushers(cb){const z=me.seat?me.seat.ez:me.pos.z;ushers.forEach((u,i)=>{u.root.visible=true;u.pos.set(i?.5:-.5,0,8);u.rotY=u.tRotY=Math.PI;u.fold=true;u.goTo([{x:i?.5:-.5,z}],()=>{u.tRotY=i?Math.PI/2:-Math.PI/2;if(i===0)setTimeout(cb,500)})})},
  bread(){if(!this.on)return;panel({k:'성찬식 · 빵',line:'성찬위원이 빵 접시를 건네요.',btns:[{t:'빵 받기',p:1,f:()=>{hold('bread');me.reachT=0;handsView();
    panel({k:'성찬식 · 빵',line:'“다 함께 먹겠습니다.”',note:'모두 받을 때까지 기다렸다가 다 같이 먹어요.',btns:[{t:'다 같이 먹기',p:1,f:()=>{consume();me.reachT=0;setTimeout(()=>this.cup(),2200)}}]})}},{t:'나가기',f:()=>stopModes()}]})},
  cup(){if(!this.on)return;panel({k:'성찬식 · 잔',line:'이번엔 작은 잔이 가득한 쟁반이 와요.',note:'미니잔 안에는 포도주스가 담겨 있어요.',btns:[{t:'잔 받기',p:1,f:()=>{hold('cup');me.reachT=0;
    panel({k:'성찬식 · 잔',line:'“다 함께 마시겠습니다.”',btns:[{t:'다 같이 마시기',p:1,f:()=>{consume();me.reachT=0;setTimeout(()=>{toast('포도주스가 달콤하네요. 빈 잔은 앞 의자 등받이 잔꽂이에 꽂아요');cam.focus=null;this.end()},2000)}}]})}},{t:'나가기',f:()=>stopModes()}]})},
  end(quiet){if(!this.on)return;this.on=false;hidePanel();hide(pastor);ushers.forEach(u=>{u.goTo([{x:u.pos.x,z:8.5}],()=>hide(u))});others.forEach(o=>o.ai.t=rand(8,30));if(held&&quiet){world.remove(held.mesh);held=null}if(!quiet)setTimeout(()=>toast('성찬식을 마쳤어요'),3600)}};

/* ---------- offering (헌금함 / 헌금 ATM) ---------- */
const ENV=[['주정헌금','매주 드리는 헌금'],['감사헌금','감사한 일이 있을 때'],['십일조','수입의 십분의 일'],['건축헌금','새 성전 짓기 (언제 끝날까요…)'],['선교헌금','멀리 있는 이웃을 위해']];
let envSel=null;
function offeringSheet(){$('#offerBody').innerHTML=`<h3>헌금하기</h3><div class="desc">봉투를 고르고, 입구 헌금함에 넣거나 헌금 ATM을 이용해요. 실제로 결제되지는 않아요.</div><div class="offer">${ENV.map(([n,d],i)=>`<button class="opt" data-env="${i}"><span><b>${n}</b><small>${d}</small></span><span class="n">✉</span></button>`).join('')}</div>`;
  $('#offerBody').querySelectorAll('[data-env]').forEach(b=>b.onclick=()=>{envSel=ENV[+b.dataset.env][0];
    $('#offerBody').innerHTML=`<h3>${envSel}</h3><div class="desc">어떻게 드릴까요?</div><div class="offer"><button class="opt" id="byBox"><span><b>봉투에 넣어 헌금함에</b><small>입구 왼쪽 나무 헌금함</small></span><span class="n">✉</span></button><button class="opt" id="byAtm"><span><b>헌금 ATM으로</b><small>카드도, 계좌이체도 돼요</small></span><span class="n">💳</span></button></div>`;
    $('#byBox').onclick=()=>{closeSheets();goSpot('obox',()=>{me.reachT=0;setTimeout(()=>{Snd.coin(false);toast(`${envSel} 봉투를 헌금함에 넣었어요`)},800)})};
    $('#byAtm').onclick=()=>{closeSheets();goSpot('atm',()=>Atm.start('offer'))}});openSheet('#offerSheet')}
function goSpot(k,cb){const s=SPOTS[k];const done=()=>{me.tRotY=s.rot;cb&&setTimeout(cb,350)};if(Math.hypot(me.pos.x-s.x,me.pos.z-s.z)<.4&&me.mode==='stand')done();else moveMeTo({x:s.x,z:s.z},done)}
const Atm={on:false,beep(){if(!Snd.ctx||Snd.muted)return;const c=Snd.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.value=1250;g.gain.setValueAtTime(.06,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.12);o.connect(g);g.connect(Snd.out());o.start();o.stop(c.currentTime+.15)},
  view(){cam.focus={pos:new THREE.Vector3(-8.3,1.25,11.2),dist:2.5,yaw:Math.PI/2-.6,pitch:.12}},
  start(mode){this.on=true;this.view();if(mode==='offer')return this.offer();
    panel({k:'헌금 ATM',line:'원하시는 업무를 선택하세요.',note:'현금 인출도, 헌금도, 자동이체도 한 곳에서 · 실제로 처리되지 않아요',btns:[
      {t:'현금 인출',f:()=>{this.beep();this.cash()}},{t:'헌금하기',p:1,f:()=>{this.beep();this.offer()}},{t:'자동이체 신청',f:()=>{this.beep();this.auto()}},{t:'취소',f:()=>stopModes()}]})},
  cash(){panel({k:'헌금 ATM · 현금 인출',line:'인출할 금액을 선택하세요.',btns:['1만 원','5만 원','10만 원'].map(a=>({t:a,f:()=>{this.beep();me.reachT=0;
    panel({k:'헌금 ATM · 현금 인출',line:'현금을 받아 가세요.',note:'인출하신 현금은 바로 옆 헌금함에 넣으셔도 돼요 :)',btns:[{t:'현금 받기',p:1,f:()=>{this.beep();toast(`${a}을 인출했어요 (가상) 💵`);this.done()}}]})}})).concat([{t:'처음으로',f:()=>this.start()}])})},
  offer(){const env=envSel||'주정헌금';
    panel({k:'헌금 ATM · 헌금',line:'카드를 넣어 주세요.',note:`${env} · 결제는 실제로 되지 않아요`,btns:[{t:'카드 넣기',p:1,f:()=>{this.beep();me.reachT=0;
      panel({k:'헌금 ATM · 헌금',line:'금액을 선택하세요.',note:env,btns:['1만 원','3만 원','5만 원','10만 원'].map(a=>({t:a,f:()=>{this.beep();
        panel({k:'헌금 ATM · 헌금',line:'헌금이 완료되었습니다. 감사합니다.',note:'기부금 영수증은 연말에 교회 사무실에서 받으실 수 있어요. 카드를 잊지 마세요!',btns:[{t:'카드 빼기',p:1,f:()=>{this.beep();toast(`${env} ${a}, ATM으로 드렸어요 (가상)`);this.done()}}]})}}))})}},{t:'처음으로',f:()=>this.start()}]})},
  auto(){panel({k:'헌금 ATM · 자동이체 신청',line:'자동이체할 헌금을 선택하세요.',note:'매달 잊지 않도록, 은행 앱처럼 자동으로…',btns:[['십일조'],['건축헌금'],['선교헌금']].map(([e])=>({t:e,p:e==='십일조',f:()=>{this.beep();
    panel({k:`자동이체 · ${e}`,line:'매월 이체일을 선택하세요.',btns:['5일','10일','25일'].map(d=>({t:`매월 ${d}`,f:()=>{this.beep();
      panel({k:`자동이체 · ${e}`,line:'금액을 선택하세요.',note:e==='십일조'?'수입의 십분의 일… 계산기는 직접 두드려 보세요':'',btns:['3만 원','10만 원','30만 원'].map(a=>({t:a,f:()=>{this.beep();
        panel({k:`자동이체 · ${e}`,line:`매월 ${d} ${e} ${a} 자동이체가 등록되었습니다.`,note:'해지는 교회 사무실 또는 이 ATM에서 할 수 있어요. 물론 실제로 등록되지는 않았어요 😅',btns:[{t:'확인',p:1,f:()=>{this.beep();toast(`매월 ${d} ${e} 자동이체 등록 완료 (가상)`);this.done()}}]})}}))})}}))})}})).concat([{t:'처음으로',f:()=>this.start()}])})},
  done(){stopModes()},
  stop(){this.on=false}};

/* ---------- bulletin & newcomer ---------- */
function weekLabel(){const d=new Date(),w=Math.ceil(d.getDate()/7);return `${d.getMonth()+1}월 ${['첫째','둘째','셋째','넷째','다섯째'][w-1]} 주`}
function bulletin(){goSpot('greet',()=>{greeter.bowT=0;say(greeter,'주보 받으세요~',2);setTimeout(()=>{
  $('#bulletinBody').innerHTML=`<h3>주보 · ${weekLabel()}</h3><div class="desc">${room.name} · 오늘의 말씀 「${SERMON[room.id].title}」</div>
  <div class="lbl" style="margin-top:4px">예배 순서</div><div class="desc" style="margin:4px 0 0">묵도 → 찬양 → 대표기도 → 설교 → 광고 → 축도</div>
  <div class="lbl">교회 소식</div><div class="desc" style="margin:4px 0 0;line-height:1.8">· 청년부 겨울 수련회 신청을 받아요 (선착순!)<br>· 1층 교회 카페가 문을 열었어요. 아메리카노 2,000원<br>· 새가족은 예배 후 환영 데스크로 와 주세요. 작은 선물이 있어요<br>· 주차 공간이 좁아요. 대중교통을 이용해 주세요 🙏<br>· 다음 달 첫 주는 성찬 주일이에요</div>`;
  openSheet('#bulletin')},700)})}
function newcomer(){goSpot('desk',()=>{staff.bowT=0;say(staff,store.get('newcomer',false)?'또 오셨네요! 반가워요':'처음 오셨어요? 환영해요!',2.4);setTimeout(()=>{
  if(store.get('newcomer',false)){toast('이미 새가족으로 등록하셨어요. 다음 주에도 만나요!');return}
  panel({k:'새가족 등록',line:'어떻게 오시게 되었나요?',note:`이름: ${myName}`,btns:[['지인 소개로'],['근처에 살아요'],['지나가다가'],['나에게 맞는 교회 찾는 중']].map(([t])=>({t,f:()=>{
    store.set('newcomer',true);hidePanel();staff.clapT=0;others.filter(o=>o.pos.distanceTo(me.pos)<7).forEach(o=>o.clapT=0);Snd.coin(false);
    toast('새가족 선물로 머그컵을 받았어요 ☕');setTimeout(()=>say(staff,t==='나에게 맞는 교회 찾는 중'?'여기가 딱 맞으실 거예요 ㅎㅎ':'정말 반가워요!',2.6),600)}}))})},700)})}

/* ---------- 성경 퀴즈 ---------- */
const QZ=[
  {q:'개신교 성경은 구약과 신약을 합쳐 모두 몇 권일까요?',o:['66권','73권','39권','27권'],a:0,e:'구약 39권, 신약 27권으로 66권이에요. 천주교 성경은 제2경전을 포함해 73권이고요.'},
  {q:'신약 성경의 첫 번째 책은?',o:['마태복음','마가복음','창세기','요한복음'],a:0,e:'신약은 마태복음으로 시작해요. 창세기는 구약의 첫 책이에요.'},
  {q:'노아의 홍수 때 비는 며칠 동안 내렸을까요?',o:['40일 40야','7일','100일','1년'],a:0,e:'사십 일 밤낮으로 비가 내렸다고 기록되어 있어요.'},
  {q:'다윗이 물맷돌로 쓰러뜨린 거인의 이름은?',o:['골리앗','삼손','사울','바로'],a:0,e:'소년 다윗이 돌팔매 하나로 거인 골리앗을 이겼죠.'},
  {q:'예수님이 태어나신 곳은?',o:['베들레헴','나사렛','예루살렘','갈릴리'],a:0,e:'베들레헴에서 태어나 나사렛에서 자라셨어요.'},
  {q:'다음 중 예수님의 열두 제자가 아닌 사람은?',o:['바울','베드로','요한','도마'],a:0,e:'바울은 열두 제자가 아니라 나중에 회심한 사도예요.'},
  {q:'물 위를 걸어 예수님께 가다가 빠질 뻔한 제자는?',o:['베드로','요한','야고보','안드레'],a:0,e:'베드로가 바람을 보고 무서워하다 빠지기 시작했죠.'},
  {q:'모세가 시내산에서 받은 것은?',o:['십계명','오병이어','황금 송아지','무지개 언약'],a:0,e:'황금 송아지는 그 사이 백성들이 만든 우상이었어요.'},
  {q:'‘오병이어’에서 ‘이어’는 무엇일까요?',o:['물고기 두 마리','빵 두 개','포도주 두 잔','양 두 마리'],a:0,e:'떡 다섯 개와 물고기 두 마리로 많은 사람을 먹이신 이야기예요.'},
];

/* ---------- hooks ---------- */
Object.assign(P,{
  rooms:ROOMS,pickRoom:h=>{const d=new Date().getDay();return d===5&&h>=19?ROOMS[2]:h<17?ROOMS[0]:ROOMS[1]},
  onRoom(p,r){ceilPanels.forEach(m=>m.material.color.setHex(0xfff6e4).multiplyScalar(p.ceil));M.win.color.setHex(0xf6f0e2).multiplyScalar(.35+p.win*.65);
    stageL.forEach((l,i)=>{l.color.setHex(p.stage[i]);l.intensity=p.stageI});beamMat.forEach((m,i)=>{m.color.setHex(p.stage[i]);m.opacity=p.beams});beams.forEach(b=>b.visible=p.beams>0);
    M.led.color.setHex(p.led);crossGlow.material.opacity=r.id==='choir'?.75:.5;setPerformers(r.id);
    if(Music.on){Music.stop(true);Music.start(r)}else drawScreens(...SCREEN_IDLE[r.id])},
  slots,seatMeshes:pewMeshes,floors:[floor],tapTargets:[oboxG,atmG,deskG],seatsForHit:h=>slots.filter(s=>s.bench===h.instanceId),
  walkable:NAV.walkable,plan:NAV.plan,clampFloor:NAV.clampFloor,
  randomSpot:()=>Math.random()<.6?NAV.clampFloor(rand(-6,6),rand(8.6,11.2)):NAV.clampFloor(pick([-8.2,8.2]),rand(-7,7)),
  door:{x:0,z:12.6,rot:Math.PI},exitZ:12.9,start:{x:0,z:12.6},startWalk:{x:0,z:7.9},respawn:{x:0,z:7.9},
  camBounds:{x:[-8.9,8.9],z:[-13.8,12.9],y:[.6,7.3]},
  seatedRate:.8,crowd:r=>Math.floor(r.id==='choir'?rand(26,34):r.id==='band'?rand(18,26):rand(14,22)),maxCrowd:r=>r.id==='choir'?34:26,
  aiChoose(a,entering){if(entering){say(greeter,'어서 오세요!',1.6);greeter.bowT=0}
    if(entering&&Math.random()<.3){a.goTo(NAV.plan(a.pos,{x:SPOTS.obox.x+rand(-.3,.3),z:SPOTS.obox.z}),()=>{a.tRotY=0;setTimeout(()=>{a.reachT=0;setTimeout(()=>aiChoose(a),2200)},400)});return true}
    return false},
  aiIdle(a){if(Service.on||Tong.on)return;const r=Math.random();
    if(Music.on&&room.id!=='choir'){a.elev=r<.55;a.dance=room.id==='revival'&&a.mode==='stand'&&r<.3}
    else{a.pray=r<.18;a.elev=false;a.dance=false}},
  tapHit(h){const o=h.object,k=o.userData.kind;if(o.userData.avatar===greeter){bulletin();return true}if(o.userData.avatar===staff){newcomer();return true}
    if(k==='obox'){stopModes();offeringSheet();return true}if(k==='atm'){stopModes();goSpot('atm',()=>Atm.start());return true}if(k==='desk'){newcomer();return true}return false},
  stopModes(except){if(Service.on&&except!=='service')Service.end(true);if(Comm.on)Comm.end(true);if(Tong.on)Tong.stop();if(Atm.on)Atm.stop()},
  spot(){if(Service.on||Comm.on||Atm.on||Tong.on)return null;const d=k=>Math.hypot(me.pos.x-SPOTS[k].x,me.pos.z-SPOTS[k].z);
    if(d('atm')<1.8)return {label:'헌금 ATM 이용하기',pos:new THREE.Vector3(-8.3,2.4,11.2),go:()=>goSpot('atm',()=>Atm.start())};
    if(d('obox')<1.6)return {label:'헌금하기',pos:new THREE.Vector3(-4.2,1.6,11.8),go:offeringSheet};
    if(d('desk')<1.8)return {label:'새가족 등록',pos:new THREE.Vector3(6.6,1.7,11.2),go:newcomer};
    if(d('greet')<1.8)return {label:'주보 받기',pos:new THREE.Vector3(1.6,2.5,11.6),go:bulletin};return null},
  update(dt,t){perf.forEach(a=>a.update(dt));[greeter,staff,...ushers,pastor,guest,elder].forEach(a=>{if(a.root.visible)a.update(dt)});
    const p=room.p;if(p.beams>0)beams.forEach((b,i)=>{b.rotation.z=Math.sin(t*.6+i*1.3)*.35;b.rotation.x=Math.sin(t*.45+i)*.2});
    if(p.beams>0&&Music.on)stageL.forEach((l,i)=>l.intensity=p.stageI*(.75+.25*Math.sin(t*(2+i)+i)));
    if(handsOn&&!me.elev)setHands(false);
    if(held&&me){const f=new THREE.Vector3(Math.sin(me.rotY),0,Math.cos(me.rotY));if(held.gone>=0)held.gone+=dt;const up=held.gone>=0?Math.min(held.gone/.8,1):0;
      held.mesh.position.set(me.pos.x+f.x*(.36-up*.12),.95+me.bp.position.y+up*.45,me.pos.z+f.z*(.36-up*.12));held.mesh.material.opacity=held.gone>1?Math.max(0,1-(held.gone-1)*2):1;held.mesh.material.transparent=true;
      if(held.gone>1.6){world.remove(held.mesh);held=null}}},
  more:{worship:()=>Service.start(),communion:()=>Comm.start(),offering:()=>{stopModes();offeringSheet()},bulletin:()=>{stopModes();bulletin()},newcomer:()=>{stopModes();newcomer()},
    tongsung:()=>Tong.start(),greet,
    quiz:()=>Quiz.start(QZ,{title:'성경 퀴즈',desc:'어릴 적 주일학교 기억을 떠올려 봐요.',pass:5,stamp:'주일학교<br>개근상',passMsg:'전도사님이 칭찬 스티커를 주셨어요 ⭐',failLine:'“다음 주 주일학교에서 만나요!”',failMsg:'달란트 시장 가기 전에 한 번 더 복습해 볼까요?'})},
});
$('#aAmen').onclick=myAmen;
$('#aHands').onclick=()=>setHands(!handsOn);
drawScreens(...SCREEN_IDLE.choir);
if(document.fonts)document.fonts.ready.then(()=>drawScreens(screenState.head,screenState.l1,screenState.l2));
startSanctuary();
