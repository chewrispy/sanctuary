/* 성당 — place script. Loaded after ../common/core.js. Defines the building, Catholic content and the hooks in P. */
const P={
  text:{pray:['기도하기','멈추기'],music:['성가 듣기','성가 듣는 중'],opening:'성당 문을 여는 중',bye:'평화를 빌어요',veil:'미사포',
    hint:['방향키나 WASD로 걷고, 긴 의자를 클릭하면 앉아요','바닥을 누르면 걷고, 긴 의자를 누르면 앉아요'],
    footPC:'방향키나 WASD로 걷고, 바닥을 클릭해도 걸어요.<br>긴 의자를 클릭하면 앉고, 드래그로 둘러봐요.'},
  veilRate:.4};

const floorTex=tex(256,256,(g,w,h)=>{const s=w/4;for(let i=0;i<4;i++)for(let j=0;j<4;j++){const d=(i+j)%2;g.fillStyle=d?'#cfc3ad':'#7e6f5f';g.fillRect(i*s,j*s,s,s);
  for(let k=0;k<30;k++){g.fillStyle=d?`rgba(150,130,110,${Math.random()*.25})`:`rgba(40,30,25,${Math.random()*.25})`;g.beginPath();g.ellipse(i*s+Math.random()*s,j*s+Math.random()*s,Math.random()*16,Math.random()*4,Math.random()*3,0,7);g.fill()}}
  speckle(g,w,h,1600,.07);g.strokeStyle='rgba(30,24,20,.55)';g.lineWidth=1.5;for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*s,0);g.lineTo(i*s,h);g.stroke();g.beginPath();g.moveTo(0,i*s);g.lineTo(w,i*s);g.stroke()}},{rep:[7,17]});
const wallTex=tex(256,256,(g,w,h)=>{g.fillStyle='#6d6457';g.fillRect(0,0,w,h);const rh=32;for(let r=0;r<h/rh;r++){const off=r%2?32:0;for(let x=-off;x<w;x+=64){const v=150+Math.random()*30;g.fillStyle=`rgb(${v+18},${v+8},${v-8})`;g.fillRect(x+2,r*rh+2,60,rh-4)}}speckle(g,w,h,2400,.08)},{rep:[10,3]});
const woodTex=tex(128,128,(g,w,h)=>{g.fillStyle='#4a2f1f';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.strokeStyle=`rgba(${Math.random()<.5?20:110},${Math.random()<.5?12:70},8,${.1+Math.random()*.2})`;g.lineWidth=1+Math.random()*2;g.beginPath();const y=Math.random()*h;g.moveTo(0,y);g.bezierCurveTo(w*.3,y+rand(-6,6),w*.7,y+rand(-6,6),w,y+rand(-4,4));g.stroke()}});
const vaultTex=tex(256,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#1f2b58');gr.addColorStop(1,'#26346a');g.fillStyle=gr;g.fillRect(0,0,w,h);
  for(let i=0;i<46;i++){const x=Math.random()*w,y=Math.random()*h,r=2+Math.random()*3;g.fillStyle='#d8b867';g.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5,rr=k%2?r*.42:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.fill()}},{rep:[2,8]});
const carpetTex=tex(64,256,(g,w,h)=>{g.fillStyle='#6e1c22';g.fillRect(0,0,w,h);g.fillStyle='#b8923f';g.fillRect(3,0,3,h);g.fillRect(w-6,0,3,h);speckle(g,w,h,600,.1)},{rep:[1,6]});
const GLASS=['#1d4fb0','#2a64d0','#163c8a','#1d4fb0','#b3202e','#d8a52a','#2c8a50','#6a2f92','#2a64d0','#c74a2a'];
function glassTex(){return tex(128,320,(g,w,h)=>{g.fillStyle='#111';g.fillRect(0,0,w,h);const s=16;for(let y=0;y<h;y+=s)for(let x=0;x<w;x+=s){g.fillStyle=pick(GLASS);g.fillRect(x,y,s,s);g.fillStyle=`rgba(255,255,255,${Math.random()*.18})`;g.fillRect(x,y,s,s)}
  const meds=[h*.28,h*.62];meds.forEach((cy,mi)=>{const cx=w/2,R=40;g.fillStyle=mi?'#c9a02a':'#a51d2c';g.beginPath();g.arc(cx,cy,R,0,7);g.fill();for(let k=0;k<8;k++){const a=k*Math.PI/4;g.fillStyle=k%2?'#2a64d0':'#e7c35a';g.beginPath();g.ellipse(cx+Math.cos(a)*24,cy+Math.sin(a)*24,10,5,a,0,7);g.fill()}
    g.fillStyle='#f3e6b4';g.beginPath();g.arc(cx,cy,9,0,7);g.fill();g.strokeStyle='#120e0b';g.lineWidth=4;g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();g.lineWidth=2;g.beginPath();g.arc(cx,cy,24,0,7);g.stroke()});
  g.strokeStyle='#120e0b';g.lineWidth=2;for(let y=0;y<=h;y+=s){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}for(let x=0;x<=w;x+=s){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}
  g.lineWidth=6;g.strokeRect(0,0,w,h)})}
const roseTex=tex(512,512,(g,w,h)=>{const c=w/2;g.fillStyle='#111';g.fillRect(0,0,w,h);const rings=[[250,24,'#1d4fb0','#2a64d0'],[200,16,'#b3202e','#d8a52a'],[140,12,'#2a64d0','#6a2f92'],[85,8,'#d8a52a','#b3202e']];
  rings.forEach(([R,n,a,b])=>{for(let k=0;k<n;k++){const a0=k*2*Math.PI/n,a1=(k+1)*2*Math.PI/n;g.fillStyle=k%2?a:b;g.beginPath();g.moveTo(c,c);g.arc(c,c,R,a0,a1);g.closePath();g.fill();g.fillStyle=`rgba(255,255,255,${Math.random()*.15})`;g.fill()}
    g.strokeStyle='#120e0b';g.lineWidth=5;g.beginPath();g.arc(c,c,R,0,7);g.stroke();for(let k=0;k<n;k++){const a0=k*2*Math.PI/n;g.beginPath();g.moveTo(c+Math.cos(a0)*(R*.55),c+Math.sin(a0)*(R*.55));g.lineTo(c+Math.cos(a0)*R,c+Math.sin(a0)*R);g.stroke()}
    for(let k=0;k<n;k++){const a=(k+.5)*2*Math.PI/n;g.lineWidth=3;g.beginPath();g.arc(c+Math.cos(a)*R*.82,c+Math.sin(a)*R*.82,R*.09,0,7);g.stroke()}});
  g.fillStyle='#f1e2a6';g.beginPath();g.arc(c,c,32,0,7);g.fill();g.strokeStyle='#120e0b';g.lineWidth=5;g.stroke()});

const poolTex=tex(128,128,(g,w,h)=>{for(let i=0;i<26;i++){const gr=g.createRadialGradient(0,0,0,0,0,1);const col=pick(['255,90,90','90,140,255','255,210,90','120,220,140','190,120,255']);
  g.save();g.translate(rand(28,100),rand(28,100));g.scale(rand(10,22),rand(10,22));gr.addColorStop(0,`rgba(${col},.55)`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.beginPath();g.arc(0,0,1,0,7);g.fill();g.restore()}
  const m=g.createRadialGradient(64,64,10,64,64,64);m.addColorStop(0,'rgba(0,0,0,0)');m.addColorStop(1,'rgba(0,0,0,1)');g.globalCompositeOperation='destination-out';g.fillStyle=m;g.fillRect(0,0,w,h)});
const shaftTex=tex(32,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(.6,'rgba(255,255,255,.28)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);
  const s=g.createLinearGradient(0,0,w,0);s.addColorStop(0,'rgba(0,0,0,1)');s.addColorStop(.25,'rgba(0,0,0,0)');s.addColorStop(.75,'rgba(0,0,0,0)');s.addColorStop(1,'rgba(0,0,0,1)');g.globalCompositeOperation='destination-out';g.fillStyle=s;g.fillRect(0,0,w,h)});

/* ---------- materials ---------- */
const M={
  floor:new THREE.MeshLambertMaterial({map:floorTex}),
  wall:new THREE.MeshLambertMaterial({map:wallTex,color:0xd8cdbd}),
  stone:new THREE.MeshLambertMaterial({color:0xb9ad99}),
  stoneDark:new THREE.MeshLambertMaterial({color:0x8a7f70}),
  vault:new THREE.MeshLambertMaterial({map:vaultTex,side:THREE.DoubleSide}),
  rib:new THREE.MeshLambertMaterial({color:0xc6b89f}),
  wood:new THREE.MeshLambertMaterial({map:woodTex}),
  woodDark:new THREE.MeshLambertMaterial({map:woodTex,color:0x9a8070}),
  gold:new THREE.MeshLambertMaterial({color:0xd9b25c,emissive:0x3a2608}),
  cloth:new THREE.MeshLambertMaterial({color:0xf3eee3}),
  carpet:new THREE.MeshLambertMaterial({map:carpetTex}),
  iron:new THREE.MeshLambertMaterial({color:0x2c2724}),
  wax:new THREE.MeshLambertMaterial({color:0xf4ecd8,emissive:0x2a2010}),
  cup:new THREE.MeshLambertMaterial({color:0x9c2a28,emissive:0x200404,transparent:true,opacity:.85}),
  cupLit:new THREE.MeshLambertMaterial({color:0xd0503a,emissive:0x8a2a12,transparent:true,opacity:.9}),
};
const winMats=[];
const addWinMat=(map)=>{const m=new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide});winMats.push(m);return m};

/* ---------- build cathedral ---------- */
const Z0=-20.2,Z1=14.2,ZC=(Z0+Z1)/2,LEN=Z1-Z0;
const floor=new THREE.Mesh(new THREE.PlaneGeometry(13.4,LEN),M.floor);floor.rotation.x=-Math.PI/2;floor.position.set(0,0,ZC);floor.userData.kind='floor';world.add(floor);
const carpet=new THREE.Mesh(new THREE.PlaneGeometry(1.5,22),M.carpet);carpet.rotation.x=-Math.PI/2;carpet.position.set(0,.006,-2.2);carpet.userData.kind='floor';world.add(carpet);
box(.4,9.5,LEN,M.wall,-6.7,4.75,ZC);box(.4,9.5,LEN,M.wall,6.7,4.75,ZC);
box(14,14,.4,M.wall,0,7,Z0);box(14,14,.4,M.wall,0,7,Z1);
const tilt=Math.atan2(4,6.6);
const cl=box(7.8,.2,LEN,M.vault,-3.25,11.55,ZC);cl.rotation.z=tilt;const cr=box(7.8,.2,LEN,M.vault,3.25,11.55,ZC);cr.rotation.z=-tilt;
// pillars, arcades, ribs
const PZ=[-14,-10,-6,-2,2,6,10];
const pillarG=new THREE.CylinderGeometry(.34,.36,7,16);
PZ.forEach(z=>[-4.2,4.2].forEach(x=>{const p=new THREE.Mesh(pillarG,M.stone);p.position.set(x,3.5,z);world.add(p);box(.95,.35,.95,M.stoneDark,x,.175,z);box(.9,.3,.9,M.stoneDark,x,6.95,z)}));
box(.5,.35,LEN-.4,M.stoneDark,-4.2,7.3,ZC);box(.5,.35,LEN-.4,M.stoneDark,4.2,7.3,ZC);
const halfRib=(R,c,a0,a1)=>new THREE.TorusGeometry(R,.13,8,24,a1-a0);
PZ.forEach(z=>{const R=6,cx=1.8,a=Math.acos(-cx/R);
  const L=new THREE.Mesh(halfRib(R,cx,a,Math.PI),M.rib);L.position.set(cx,7.1,z);L.rotation.z=a;world.add(L);
  const Rr=new THREE.Mesh(halfRib(R,cx,a,Math.PI),M.rib);Rr.position.set(-cx,7.1,z);world.add(Rr)});
for(let i=0;i<PZ.length-1;i++){const zm=(PZ[i]+PZ[i+1])/2;[-4.2,4.2].forEach(x=>{const t=new THREE.Mesh(new THREE.TorusGeometry(2,.16,8,24,Math.PI),M.rib);t.position.set(x,5.1,zm);t.rotation.y=Math.PI/2;world.add(t)})}

// lancet windows
function lancetGeo(w,h){const s=new THREE.Shape(),hw=w/2,ah=w*.95;s.moveTo(-hw,0);s.lineTo(-hw,h-ah);s.quadraticCurveTo(-hw,h-ah*.15,0,h);s.quadraticCurveTo(hw,h-ah*.15,hw,h-ah);s.lineTo(hw,0);s.closePath();
  const g=new THREE.ShapeGeometry(s,16);const p=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)+hw)/w,p.getY(i)/h);return g}
const winZ=[-12,-8,-4,0,4,8];
const winGeo=lancetGeo(1.5,4.6);
const shafts=[],pools=[];
const shaftMat=new THREE.MeshBasicMaterial({map:shaftTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,opacity:.15,color:0xffe6b8});
const poolMat=new THREE.MeshBasicMaterial({map:poolTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.5});
winZ.forEach(z=>[-1,1].forEach(side=>{const m=new THREE.Mesh(winGeo,addWinMat(glassTex()));m.position.set(side*6.48,2.7,z);m.rotation.y=-side*Math.PI/2;world.add(m);
  const fr=new THREE.Mesh(lancetGeo(1.8,4.85),M.stoneDark);fr.position.set(side*6.49,2.58,z);fr.rotation.y=-side*Math.PI/2;fr.position.x+=side*.005;world.add(fr);
  if(side<0){const sg=new THREE.Group();const dx=4.4,dy=-5;const n=Math.hypot(dx,dy);sg.position.set(-6.4+dx/2,5+dy/2,z+.6);sg.rotation.z=Math.atan2(dx,-dy);sg.rotation.y=.18;
    const p1=new THREE.Mesh(new THREE.PlaneGeometry(1.3,n+.6),shaftMat),p2=p1.clone();p2.rotation.y=Math.PI/2;sg.add(p1,p2);world.add(sg);shafts.push(sg);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),poolMat);pl.rotation.x=-Math.PI/2;pl.position.set(-6.4+dx,.012,z+.9);world.add(pl);pools.push(pl)}}));
// rose + apse windows
const rose=new THREE.Mesh(new THREE.CircleGeometry(2.5,48),addWinMat(roseTex));rose.position.set(0,9.2,Z0+.22);world.add(rose);
const roseRing=new THREE.Mesh(new THREE.TorusGeometry(2.55,.16,8,48),M.stoneDark);roseRing.position.copy(rose.position);world.add(roseRing);
[-3.6,3.6].forEach(x=>{const m=new THREE.Mesh(lancetGeo(1.3,4.2),addWinMat(glassTex()));m.position.set(x,3.2,Z0+.22);world.add(m)});
// sanctuary
box(9,.35,5.2,M.stone,0,.175,-17.6);box(6.6,.35,3.6,M.stone,0,.525,-18.2);
box(2.8,1.0,1,M.stone,0,1.2,-17.7);box(2.95,.04,1.12,M.cloth,0,1.72,-17.7);box(2.95,.42,.02,M.cloth,0,1.5,-17.13);box(2.95,.04,.025,M.gold,0,1.3,-17.12);
const cross=new THREE.Group();box(.2,2.8,.12,M.gold,0,0,0,cross);box(1.55,.2,.12,M.gold,0,.62,0,cross);cross.position.set(0,5.4,Z0+.35);world.add(cross);
const crossGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.5}));crossGlow.scale.set(5,5,1);crossGlow.position.set(0,5.6,Z0+.5);world.add(crossGlow);
box(.8,.85,.55,M.gold,0,1.12,-19.3);box(.04,.6,.01,M.iron,0,1.12,-19.02);
const altarFlames=[],altarHits=[];const hitMat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false});
[-1.25,-.85,-.45,.45,.85,1.25].forEach((x,i)=>{const h=.38+(i===2||i===3?0:.08);const c=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,h,10),M.wax);c.position.set(x,1.74+h/2+.04,-17.95);world.add(c);box(.12,.04,.12,M.gold,x,1.76,-17.95);altarFlames.push(addFlame(x,1.74+h+.12,-17.95,1));
  const hb=new THREE.Mesh(new THREE.BoxGeometry(.32,.9,.4),hitMat);hb.position.set(x,2.0,-17.95);hb.userData={kind:'altarCandle',i};world.add(hb);altarHits.push(hb)});
// confessional
const confBooth=new THREE.Group();confBooth.position.set(-5.75,0,-4);world.add(confBooth);
box(1.3,2.7,2.4,M.woodDark,0,1.35,0,confBooth);box(1.4,.18,2.5,M.wood,0,2.78,0,confBooth);box(.04,1.9,.75,new THREE.MeshLambertMaterial({color:0x5a1a1e}),.66,1.1,-.5,confBooth);
box(.04,.5,.5,M.iron,.66,1.5,.6,confBooth);const cr2=new THREE.Mesh(new THREE.BoxGeometry(.05,.1,.1),M.gold);cr2.position.set(.67,2.4,0);confBooth.add(cr2);
confBooth.traverse(o=>o.userData.kind='confess');const confAt=new THREE.Vector3(-4.95,0,-4.2);
// sanctuary lamp
const lampChain=box(.015,3.2,.015,M.iron,1.6,4.2,-18.4);const lampCup=new THREE.Mesh(new THREE.SphereGeometry(.12,12,10),new THREE.MeshBasicMaterial({color:0xff3a2a}));lampCup.position.set(1.6,2.55,-18.4);world.add(lampCup);
const lampGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:radial([[0,'rgba(255,90,70,.9)'],[1,'rgba(255,60,40,0)']]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));lampGlow.scale.set(.8,.8,1);lampGlow.position.copy(lampCup.position);world.add(lampGlow);
// doors
const door=new THREE.Mesh(lancetGeo(3.2,4.6),M.woodDark);door.position.set(0,0,Z1-.21);door.rotation.y=Math.PI;world.add(door);box(.06,3.9,.04,M.iron,0,1.95,Z1-.24);

// pews (instanced)
const ROW0=-11.5,STEP=1.6,ROWS=13,BX=[-2.35,2.35];
const benches=[];for(let i=0;i<ROWS;i++)BX.forEach(x=>benches.push({x,z:ROW0+i*STEP,row:i}));
const pewParts=[[new THREE.BoxGeometry(2.7,.07,.44),M.wood,[0,.45,0],0],[new THREE.BoxGeometry(2.7,.5,.05),M.wood,[0,.78,.24],-.12],[new THREE.BoxGeometry(.07,.86,.58),M.woodDark,[-1.36,.43,.05],0],[new THREE.BoxGeometry(.07,.86,.58),M.woodDark,[1.36,.43,.05],0],[new THREE.BoxGeometry(2.6,.07,.14),M.woodDark,[0,.14,-.52],0]];
const pewMeshes=[];const dummy=new THREE.Object3D();
pewParts.forEach(([g,m,o,rx])=>{const im=new THREE.InstancedMesh(g,m,benches.length);benches.forEach((b,i)=>{dummy.position.set(b.x+o[0],o[1],b.z+o[2]);dummy.rotation.set(rx,0,0);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix)});im.userData.kind='seat';world.add(im);pewMeshes.push(im)});
const slots=[];benches.forEach((b,bi)=>[-.85,0,.85].forEach(o=>slots.push({x:b.x+o,z:b.z,lane:b.z-.5,ex:b.x+o,ez:b.z-.5,kx:b.x+o,kz:b.z-.42,sx:b.x+o,sz:b.z-.3,rot:Math.PI,bench:bi,occ:null})));

// votive stand
const votive=new THREE.Group();votive.position.set(6.15,0,-12);votive.rotation.y=-Math.PI/2;world.add(votive);
box(1.8,.7,.6,M.iron,0,.35,0,votive);
const vslots=[];for(let t=0;t<3;t++){box(1.75,.05,.2,M.iron,0,.74+t*.15,.2-t*.2,votive);for(let k=0;k<8;k++){const x=-.74+k*.21,y=.8+t*.15,z=.2-t*.2;const cup=new THREE.Mesh(new THREE.CylinderGeometry(.045,.04,.08,10),M.cup);cup.position.set(x,y,z);votive.add(cup);vslots.push({cup,x,y,z,flame:null,life:0})}}
votive.traverse(o=>o.userData.kind='votive');
const votiveAt=new THREE.Vector3(5.25,0,-11.5);
const votiveGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.0}));votiveGlow.scale.set(2.6,2.6,1);votiveGlow.position.set(5.95,1.05,-12);world.add(votiveGlow);
vslots.forEach((v,i)=>v.cup.userData.vs=i);
function lightVotive(target){let v=target;if(!v||v.flame){let s=vslots.filter(v=>!v.flame);if(!s.length){const o=[...vslots].sort((a,b)=>a.life-b.life)[0];o.flame.parent.remove(o.flame);flames.splice(flames.indexOf(o.flame),1);o.flame=null;s=[o]}v=pick(s)}
  v.flame=addFlame(v.x,v.y+.1,v.z,.8,votive);v.flame.userData.grow=0;v.life=rand(240,600);v.cup.material=M.cupLit;return v}
for(let i=0;i<9;i++){const v=lightVotive();v.flame.userData.grow=1;v.life=rand(60,500)}

// dust
const dustN=260,dustG=new THREE.BufferGeometry(),dp=new Float32Array(dustN*3);for(let i=0;i<dustN;i++){dp[i*3]=rand(-6,1);dp[i*3+1]=rand(.3,7);dp[i*3+2]=rand(-14,10)}
dustG.setAttribute('position',new THREE.BufferAttribute(dp,3));const dust=new THREE.Points(dustG,new THREE.PointsMaterial({size:.045,color:0xffe9c0,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending,map:glowTex}));world.add(dust);


const altarL=new THREE.PointLight(0xffb36a,3,12,1.2);altarL.position.set(0,2.6,-17);scene.add(altarL);
const votL=new THREE.PointLight(0xff9a50,0,6,1.4);votL.position.set(5.7,1.4,-12);scene.add(votL);
const ROOMS=[
  {id:'light',name:'빛의 경당',desc:'오후의 햇살이 창을 지나는 곳',p:{sky:0xfff1dc,gnd:0x3b3128,hemi:1.25,sun:0xffe0b0,sunI:1.7,sunP:[-10,14,4],fog:0x2c2622,fogD:.018,win:1.15,tint:0xffffff,shaft:.17,shaftC:0xffe6b8,pool:.55,candle:1,exp:1.05}},
  {id:'dusk',name:'노을 경당',desc:'저녁 빛이 붉게 물드는 곳',p:{sky:0xffc49a,gnd:0x2a1e1a,hemi:.85,sun:0xff9a5c,sunI:1.4,sunP:[-12,6,6],fog:0x2b1d18,fogD:.022,win:1.0,tint:0xffc9a6,shaft:.2,shaftC:0xff9f66,pool:.5,candle:1.5,exp:1.0}},
  {id:'night',name:'고요 경당',desc:'촛불만 남은 밤의 성당',p:{sky:0x5d6c9c,gnd:0x120f14,hemi:.38,sun:0x8aa0ff,sunI:.3,sunP:[-8,12,2],fog:0x0e0d14,fogD:.028,win:.42,tint:0x9aaaff,shaft:0,shaftC:0x8899ff,pool:.08,candle:2.6,exp:1.15}},
];

/* ---------- navigation ---------- */
const LANES=benches.filter(b=>b.x<0).map(b=>b.z-.5);
const inBand=(x,z)=>Math.abs(x)>.95&&Math.abs(x)<3.75&&z>-12.15&&z<8.2;
const nearLane=z=>LANES.reduce((a,b)=>Math.abs(b-z)<Math.abs(a-z)?b:a);
const blockedAt=(x,z)=>inBand(x,z)&&Math.abs(nearLane(z)-z)>.22;
function segBlocked(a,b){for(let i=1;i<24;i++){const t=i/24;if(blockedAt(lerp(a.x,b.x,t),lerp(a.z,b.z,t)))return true}
  for(let i=0;i<=24;i++){const t=i/24,x=lerp(a.x,b.x,t),z=lerp(a.z,b.z,t);for(const pz of PZ)if(Math.abs(Math.abs(x)-4.2)<.6&&Math.abs(z-pz)<.6)return true}return false}
function plan(from,to){const pts=[];let p={x:from.x,z:from.z};const push=q=>{pts.push(q);p=q};
  if(inBand(p.x,p.z))push({x:0,z:p.z});
  const tail=[];if(inBand(to.x,to.z))tail.push({x:0,z:to.z});tail.push(to);
  const first=tail[0];
  if(segBlocked(p,first)){const cz=(p.z+first.z)/2<-2?-12.95:8.9;if(Math.abs(p.z-cz)>.01)push({x:p.x,z:cz});if(segBlocked(p,{x:first.x,z:cz})){push({x:0,z:cz})}push({x:first.x,z:cz})}
  tail.forEach(push);return pts}
function walkable(x,z){if(Math.abs(x)>6.05||z>13.3||z<-14.75)return false;
  if(Math.abs(x)>.9&&Math.abs(x)<3.8&&z>-12.2&&z<8.4)for(const b of benches)if(b.x<0&&Math.abs(z-b.z)<.34)return false;
  if(Math.abs(Math.abs(x)-4.2)<.62)for(const pz of PZ)if(Math.abs(z-pz)<.62)return false;
  if(x>5.6&&z>-13.1&&z<-10.9)return false;if(x<-4.95&&z>-5.35&&z<-2.65)return false;return true}

function clampFloor(x,z){z=clamp(z,-14.6,13.2);x=clamp(x,-6.05,6.05);if(Math.abs(x)>3.75&&Math.abs(x)<4.85)x=Math.sign(x)*(Math.abs(x)<4.3?3.7:4.95);if(inBand(x,z))z=nearLane(z);
  if(z<-12.4&&z>-15&&Math.abs(Math.abs(x)-4.2)<.7)x=Math.sign(x)*(Math.abs(x)<4.2?3.45:4.95);return {x,z}}

/* ---------- my actions ---------- */
function myCross(){if(me.crossT>=0)return;me.doCross();$('#aCross').classList.add('on');$('#aCrossL').textContent='성호 긋는 중';Snd.chime();
  setTimeout(()=>{$('#aCross').classList.remove('on');$('#aCrossL').textContent='성호 긋기'},2700);
  const cand=others.filter(o=>o.pos.distanceTo(me.pos)<5.5&&o.crossT<0&&!o.path.length);
  if(cand.length&&Math.random()<.75){const o=pick(cand);setTimeout(()=>{o.doCross();toast(`${o.name}님이 성호로 화답했어요`)},rand(1400,2600))}}
let pickCandle=false;
function myVotive(){$('#spotChip').classList.add('hide');const go=()=>{me.tRotY=Math.PI/2;openSheet('#offerSheet')};
  if(me.pos.distanceTo(votiveAt)<.4&&me.mode==='stand')go();else moveMeTo({x:votiveAt.x,z:votiveAt.z},go)}
function offer(kind){closeSheets();Snd.coin(kind!=='마음');toast(kind==='마음'?'마음을 봉헌했어요. 켜고 싶은 초를 골라 눌러요':`땡그랑! ${kind} 봉헌했어요. 켜고 싶은 초를 골라 눌러요`);
  pickCandle=true;cam.focus={pos:new THREE.Vector3(5.95,.95,-12.05),dist:2.9,yaw:-2.2,pitch:.42}}
function pickVotive(v){if(v.flame){toast('이미 누군가의 기도가 타고 있는 초예요');return}pickCandle=false;me.reachT=0;
  setTimeout(()=>{lightVotive(v);Snd.match();toast('초를 봉헌했어요. 기도가 작은 빛으로 머물러요')},800);setTimeout(()=>{cam.focus=null},3200)}
document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>offer(b.dataset.o));

/* rosary */
const MYST={환희:['예수님을 잉태하심','엘리사벳을 찾아보심','예수님을 낳으심','예수님을 성전에 바치심','성전에서 예수님을 찾으심'],
  빛:['요르단 강에서 세례를 받으심','카나 혼인 잔치에서 첫 기적을 행하심','하느님 나라를 선포하심','거룩하게 변모하심','성체성사를 세우심'],
  고통:['겟세마니 동산에서 피땀 흘리심','매 맞으심','가시관을 쓰심','십자가를 지심','십자가에 못 박혀 돌아가심'],
  영광:['부활하심','승천하심','성령을 보내심','성모님을 하늘에 불러올리심','성모님께 천상 모후의 관을 씌우심']};
const dayM=['영광','환희','고통','영광','빛','고통','환희'][new Date().getDay()];
const SEQ=[];SEQ.push({b:'X',p:'성호경 · 사도신경',c:'십자가를 잡고 시작해요'});SEQ.push({b:'P1',p:'주님의 기도',c:'믿음·희망·사랑을 청하며'});
for(let i=0;i<3;i++)SEQ.push({b:'P'+(i+2),p:'성모송',c:`${i+1} / 3`});SEQ.push({b:'P5',p:'영광송',c:'이제 1단으로 들어가요'});
for(let d=0;d<5;d++){SEQ.push({b:'L'+d,p:d?'영광송 · 주님의 기도':'주님의 기도',c:`${d+1}단 · ${MYST[dayM][d]}`});for(let k=0;k<10;k++)SEQ.push({b:`S${d}_${k}`,p:'성모송',c:`${d+1}단 · ${k+1} / 10`})}
SEQ.push({b:'M',p:'영광송 · 구원의 기도',c:'성모 찬송으로 마쳐요'});SEQ.push({b:'M',p:'평화를 빌어요',c:'묵주기도를 모두 바쳤어요'});
let rIdx=store.get('rIdx',0);if(rIdx>=SEQ.length)rIdx=0;
const BP={};(()=>{const cx=75,cy=64,R=50,n=55,g0=.32;let k=0;for(let d=0;d<5;d++){for(let j=0;j<11;j++){const a=Math.PI/2+g0+(k/(n-1))*(Math.PI*2-2*g0);BP[j?`S${d}_${j-1}`:'L'+d]={x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R,big:!j};k++}}
  BP.M={x:cx,y:cy+R+4,big:true,medal:true};const py=[cy+R+20,cy+R+33,cy+R+44,cy+R+55,cy+R+68];['P5','P4','P3','P2','P1'].forEach((b,i)=>BP[b]={x:cx,y:py[i],big:b==='P5'||b==='P1'});BP.X={x:cx,y:cy+R+86,cross:true}})();
function renderRosary(){const cur=SEQ[rIdx],done=new Set(SEQ.slice(0,rIdx).map(s=>s.b));let s='';
  const ring=Object.entries(BP).filter(([k])=>k[0]==='L'||k[0]==='S').sort((a,b)=>0);let path='M'+BP.P1.x+' '+BP.P1.y+' L'+BP.M.x+' '+BP.M.y;
  s+=`<circle cx="75" cy="64" r="50" fill="none" stroke="rgba(236,217,168,.25)" stroke-width="1"/><path d="${path}" stroke="rgba(236,217,168,.25)" stroke-width="1"/>`;
  for(const [k,p] of Object.entries(BP)){const on=k===cur.b,dn=done.has(k)&&!on;const fill=on?'#ecd9a8':dn?'rgba(236,217,168,.55)':'rgba(255,255,255,.16)';
    if(p.cross)s+=`<path d="M${p.x} ${p.y-9}v20M${p.x-6} ${p.y-3}h12" stroke="${on?'#ecd9a8':dn?'rgba(236,217,168,.6)':'rgba(255,255,255,.4)'}" stroke-width="2.6" stroke-linecap="round"/>`;
    else if(p.medal)s+=`<ellipse cx="${p.x}" cy="${p.y}" rx="5.5" ry="7" fill="${fill}" stroke="rgba(236,217,168,.5)"/>`;
    else s+=`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.big?4.2:2.6}" fill="${fill}"${on?' style="filter:drop-shadow(0 0 4px #ecd9a8)"':''}/>`}
  $('#beads').innerHTML=s;$('#rMyst').textContent=`오늘은 ${dayM}의 신비`;$('#rPr').textContent=cur.p;$('#rCtx').textContent=cur.c;$('#rNext').textContent=rIdx===SEQ.length-1?'다시 시작':'한 알 넘기기'}
function rNext(){rIdx=rIdx>=SEQ.length-1?0:rIdx+1;store.set('rIdx',rIdx);Snd.tick();try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}renderRosary()}
$('#rNext').onclick=rNext;$('#beads').onclick=rNext;$('#rReset').onclick=()=>{rIdx=0;store.set('rIdx',0);renderRosary()};

const crossAll=()=>others.forEach(o=>{if(!o.path.length)setTimeout(()=>o.doCross(),rand(100,900))});

const Mea={last:-1,warned:-1,
  slot(d){return Math.floor((d.getHours()*60+d.getMinutes())/15)},
  nextLabel(){const d=new Date(),m=(this.slot(d)+1)*15%1440;return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`},
  everyone(){if(me)me.beatT=0;[...others,...Choir.m].forEach(o=>setTimeout(()=>{o.beatT=0},rand(0,220)));if(priest.root.visible)priest.beatT=0;[0,1,2].forEach(i=>setTimeout(()=>Snd.tick(),450+i*550))},
  check(){const d=new Date(),sl=this.slot(d),m=d.getMinutes()%15,sec=d.getSeconds();const info=$('#meaInfo');if(info)info.textContent=`15분마다 모두 함께 · 다음 ${this.nextLabel()}`;
    if(!entered||Mass.on)return;
    if(m===14&&sec>=54&&this.warned!==sl){this.warned=sl;toast('곧 다 함께 내 탓이오')}
    if(m===0&&sec<3&&this.last!==sl){this.last=sl;this.everyone();setTimeout(()=>toast('내 탓이오, 내 탓이오, 저의 큰 탓이옵니다'),300)}}};
setInterval(()=>Mea.check(),1000);
function meaCulpa(){toast(`다음 ‘다 함께 내 탓이오’는 ${Mea.nextLabel()}이에요`)}
function peaceAct(){greetNear(o=>`${o.name}님이 “평화를 빕니다” 하고 인사했어요`,'평화를 빌었어요. 멀리 있는 이들에게도 닿기를')}
let hostFx=null;
function showHost(av){const m=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.012,20),new THREE.MeshBasicMaterial({color:0xfffbea,transparent:true}));const f=new THREE.Vector3(Math.sin(av.rotY),0,Math.cos(av.rotY));
  m.position.set(av.pos.x+f.x*.42,1.0+av.bp.position.y,av.pos.z+f.z*.42);m.rotation.x=Math.PI/2;world.add(m);hostFx={mesh:m,t:0,y:m.position.y}}

/* priest */
const priest=new Avatar({name:'신부님',robeC:0xf4f0e6,stoleC:0xf4f0e6,cape:0x4f7f45,look:{skin:1,hair:'short',hairC:4,veil:0}});priest.speed=1.1;priest.root.visible=false;priest.pos.set(0,-50,-18.6);
function priestIn(){priest.root.visible=true;priest.path=[];priest.pos.set(0,.7,-18.6);priest.rotY=priest.tRotY=0;priest.elev=false;priest.mode='stand'}
function priestTo(pts,cb){priest.goTo(pts,()=>{priest.tRotY=0;cb&&cb()})}

/* ---------- mass ---------- */
const Mass={on:false,i:0,role:'people',beats:0,elevAt:0,rang:false,
  steps:[
    {k:'시작 예식',pose:'stand',line:'“성부와 성자와 성령의 이름으로.”',note:'모두 일어나 사제와 함께 성호를 그어요.',btns:[{t:'아멘',p:1,f(){me.doCross();crossAll();Mass.next(2600)}}]},
    {k:'인사',pose:'stand',line:'“주님께서 여러분과 함께.”',btns:[{t:'또한 사제의 영과 함께.',p:1,f(){Mass.next(900)}}]},
    {k:'참회 예식',pose:'stand',line:'잠시 침묵하며 지난 시간의 잘못을 돌아봐요.',note:'버튼을 누를 때마다 가슴을 쳐요 (0/3)',btns:[{t:'내 탓이오',p:1,f(){Mass.beat()}}]},
    {k:'말씀 전례',pose:'sit',line:'독서와 복음이 봉독돼요.',note:'앉아서 귀 기울여요. 오늘 마음에 남는 한 단어를 떠올려 보세요.',btns:[{t:'말씀을 들었어요',p:1,f(){Mass.next(600)}}]},
    {k:'성찬 전례',pose:'kneel',line:'사제가 빵과 포도주를 축성해요.',note:'무릎을 꿇고 제대를 바라봐요.',btns:[],enter(){Mass.elevation()}},
    {k:'평화의 인사',pose:'stand',line:'“서로 평화의 인사를 나누십시오.”',btns:[{t:'평화를 빕니다',p:1,f(){peaceAct();Mass.next(2600)}}]},
    {k:'영성체',pose:'kneel',line:'영성체 시간이에요.',note:'세례를 받지 않았거나 마음의 준비가 안 됐다면, 마음으로 모시는 신령성체도 좋아요.',
      btns:[{t:'나가서 모시기',p:1,f(){Mass.commune()}},{t:'신령성체',f(){toast('마음으로 성체를 모셨어요');Mass.next(1500)}}],enter(){Mass.othersCommune()}},
    {k:'마침 예식',pose:'stand',line:'“미사가 끝났으니 가서 복음을 전합시다.”',btns:[{t:'하느님 감사합니다.',p:1,f(){me.doCross();crossAll();Mass.end()}}],enter(){if(Math.abs(priest.pos.z+18.6)>.2)priestTo([{x:1.8,z:-15.4},{x:1.8,z:-18.6},{x:0,z:-18.6}])}},
  ],
  start(role='people'){stopModes('mass');this.on=true;this.role=role;this.i=0;priestIn();others.forEach(o=>o.ai.t=999);Snd.bell(196,0,.4);
    if(role==='server'&&Math.hypot(me.pos.x-2.3,me.pos.z+14.6)>.4){moveMeTo({x:2.3,z:-14.6},()=>{me.tRotY=Math.PI;mePose('kneel')})}
    if(role==='people'&&(!me.seat||me.seat.z>-3)){const f=slots.filter(s=>!s.occ&&s.z<-5).sort((a,b)=>a.z-b.z||Math.abs(a.x)-Math.abs(b.x))[0];if(f){f.occ=me;moveMeTo({x:f.x,z:f.lane},()=>{me.sitAt(f);setTimeout(()=>mePose(this.steps[this.i].pose),600)});toast('앞쪽 자리로 안내해 드릴게요')}}
    toast(role==='server'?'복사로 미사에 함께해요':'미사가 시작돼요');setTimeout(()=>this.show(),900)},
  show(){if(!this.on)return;const s=this.steps[this.i];congregation(s.pose);mePose(this.role==='server'&&s.pose==='sit'?'stand':s.pose);
    let btns=s.btns;if(this.role==='server'&&s.k==='영성체')btns=[{t:'제대 곁에서 모시기',p:1,f(){me.fold=true;showHost(me);setTimeout(()=>{toast('제대 곁에서 성체를 모셨어요');me.fold=false;Mass.next(1200)},1600)}}];
    panel({k:`미사 · ${s.k}${this.role==='server'?' · 복사':''}`,line:s.line,note:s.note,prog:this.i/this.steps.length,btns:[...btns,{t:'나가기',f:()=>stopModes()}]});s.enter&&s.enter()},
  next(ms=800){const i=this.i;setTimeout(()=>{if(!this.on||this.i!==i)return;this.i++;if(this.i>=this.steps.length)this.end();else this.show()},ms)},
  beat(){this.beats=(this.beats||0)+1;me.beatT=0;[0,1,2].forEach(i=>setTimeout(()=>Snd.tick(),450+i*550));[...others,...Choir.m].forEach(o=>{if(!o.path.length)setTimeout(()=>o.beatT=0,rand(0,220))});priest.beatT=0;
    setNote(`버튼을 누를 때마다 가슴을 쳐요 (${this.beats}/3)`);if(this.beats>=3){this.beats=0;toast('내 탓이오, 내 탓이오, 저의 큰 탓이옵니다');this.next(2600)}},
  elevation(){const server=this.role==='server';this.elevAt=0;this.rang=false;const i=this.i;
    if(server)panel({k:'미사 · 성찬 전례 · 복사',line:'사제가 성체를 높이 들어 올리는 순간에 종을 쳐요.',note:'신부님 손을 잘 보세요!',prog:this.i/this.steps.length,btns:[{t:'종 치기',p:1,cls:'bell',ico:'🔔',f(){Mass.ring()}}]});
    cam.focus={pos:new THREE.Vector3(0,1.5,-18.2),dist:6,yaw:server?.35:0,pitch:.22};
    setTimeout(()=>{if(!this.on||this.i!==i)return;priest.elev=true;this.elevAt=performance.now();if(!server)Snd.sanctus();
      setTimeout(()=>{if(!this.on||this.i!==i)return;priest.elev=false;if(server&&!this.rang)toast('앗, 종을 놓쳤어요. 다음 미사엔 꼭!');
        cam.focus=null;panel({k:`미사 · 성찬 전례${server?' · 복사':''}`,line:'“신앙의 신비여!”',note:'함께 응답해요.',prog:this.i/this.steps.length,btns:[{t:'아멘',p:1,f(){Mass.next(700)}},{t:'나가기',f:()=>stopModes()}]})},4200)},rand(2600,4600))},
  ring(){Snd.sanctus();if(this.rang)return;this.rang=true;const d=this.elevAt?performance.now()-this.elevAt:-1;
    toast(d<0?'앗, 조금 일렀어요. 신부님이 살짝 웃으셨어요':d<1600?'딱 맞췄어요! 훌륭한 복사예요':'조금 늦었지만 괜찮아요. 종소리는 언제나 반가워요')},
  commune(){const s=me.seat;hidePanel();moveMeTo({x:0,z:-14.55},()=>{me.tRotY=Math.PI;const go=()=>{panel({k:'미사 · 영성체',line:'“그리스도의 몸.”',btns:[{t:'아멘',p:1,f(){hidePanel();me.fold=true;showHost(me);
      setTimeout(()=>{me.fold=false;me.doCross();toast('성체를 모셨어요');setTimeout(()=>{if(s&&!s.occ){s.occ=me;moveMeTo({x:s.x,z:s.lane},()=>{me.sitAt(s);me.mode='kneel';me.slide=new THREE.Vector3(s.x,0,s.z-.42);Mass.next(1500)})}else{me.goTo(plan(me.pos,{x:0,z:-11.8}),()=>Mass.next(800))}},1800)},1500)}}]})};
      if(Math.abs(priest.pos.z+15.4)<.2)go();else{const w=setInterval(()=>{if(Math.abs(priest.pos.z+15.4)<.2&&!priest.path.length){clearInterval(w);go()}},200)}})},
  othersCommune(){if(this.role!=='server')priestTo([{x:1.8,z:-18.6},{x:1.8,z:-15.4},{x:0,z:-15.4}]);
    const cand=others.filter(o=>o.seat&&!o.path.length).sort(()=>Math.random()-.5).slice(0,5);
    cand.forEach((o,i)=>setTimeout(()=>{if(!this.on||!o.seat)return;const s=o.seat;o.standUp();o.fold=false;o.goTo(plan(o.pos,{x:i%2?.55:-.55,z:-14.4}),()=>{o.tRotY=Math.PI;
      setTimeout(()=>{o.fold=true;setTimeout(()=>{o.fold=false;o.doCross();o.goTo(plan(o.pos,{x:s.x,z:s.lane}),()=>{if(s.occ){aiChoose(o);return}o.sitAt(s);o.mode='kneel';o.slide=new THREE.Vector3(s.x,0,s.z-.42);o.fold=true})},1300)},1200)})},2000+i*3500))},
  end(quiet){if(!this.on)return;this.on=false;hidePanel();priest.elev=false;priestTo([{x:priest.pos.x>1?priest.pos.x:1.8,z:priest.pos.z},{x:4.4,z:-18.8}],()=>{priest.root.visible=false;priest.pos.y=-50});
    others.forEach(o=>o.ai.t=rand(8,30));congregation('sit');mePose('sit');altarFlames.forEach(f=>f.visible=true);if(!quiet){Snd.bell(196,0,.4);toast('미사가 끝났어요. 평화를 빌어요')}}
};

/* ---------- altar server ---------- */
const Server={prep:false,lit:0,
  start(){stopModes();this.prep=true;this.lit=0;altarFlames.forEach(f=>f.visible=false);moveMeTo({x:2.3,z:-14.6},()=>{me.tRotY=Math.PI});
    cam.focus={pos:new THREE.Vector3(0,1.15,-17.3),dist:5.4,yaw:.1,pitch:.38};
    panel({k:'복사 체험 · 미사 준비',line:'미사 전에 제대 초를 밝혀요.',note:'제대 위 초를 하나씩 눌러 불을 붙여요 (0/6)',btns:[{t:'그만두기',f:()=>stopModes()}]})},
  light(i){const f=altarFlames[i];if(f.visible)return;f.visible=true;f.userData.grow=0;Snd.match();this.lit++;setNote(`제대 위 초를 하나씩 눌러 불을 붙여요 (${this.lit}/6)`);
    if(this.lit>=6){this.prep=false;toast('준비 끝! 곧 미사가 시작돼요');setTimeout(()=>{cam.focus=null;Mass.start('server')},1800)}}};

/* ---------- choir ---------- */
const Choir={on:false,m:[],
  start(){stopModes();this.on=true;[[-3.95,-15.5],[-3.4,-15.5],[-2.85,-15.5],[-4.2,-16.3],[-3.65,-16.3],[-3.1,-16.3]].forEach(([x,z],i)=>{const a=new Avatar({name:makeName(),robeC:0xf2ede2,stoleC:0x8e2b33,veil:i%3===1});
      a.pos.set(x,.35,z);a.rotY=a.tRotY=.55;a.sing=true;a.fold=true;a.choir=true;this.m.push(a)});
    if(!Snd.chantOn){Snd.startChant();chantUI(true)}
    panel({k:'성가대',line:'성가대가 그레고리오 성가풍의 노래를 불러요.',note:Snd.muted?'오른쪽 위 스피커를 켜면 들려요.':'눈을 감고 들어도 좋아요.',btns:[{t:'옆에 함께 서기',p:1,f:()=>this.join()},{t:'그만 듣기',f:()=>stopModes()}]})},
  join(){moveMeTo({x:-3.0,z:-14.55},()=>{me.tRotY=.55;me.sing=true;me.fold=true;toast('성가대와 함께 노래해요')});setNote('성가대 곁으로 걸어가요…')},
  stop(){this.on=false;this.m.forEach(a=>a.remove());this.m=[];if(me){me.sing=false;me.fold=false}if(Snd.chantOn){Snd.stopChant();chantUI(false)}}};

/* ---------- confession ---------- */
const PEN=['성모송 세 번','주님의 기도 한 번','오늘 한 사람에게 먼저 따뜻한 말 건네기','잠들기 전, 감사한 일 세 가지 떠올리기','미뤄 둔 안부 연락 하나 하기','나 자신에게도 “괜찮아”라고 말해 주기'];
const COMFORT=['용기 내어 털어놓으셨어요. 하느님은 이미 그 마음을 알고 계십니다.','완벽하지 않아도 괜찮습니다. 돌아보는 그 자리에서 다시 시작하면 됩니다.','무거운 짐을 여기 내려놓으세요. 오늘부터 조금 가벼워지기를 빕니다.','잘못을 알아보는 마음이 이미 은총입니다. 너무 자책하지 마세요.'];
const Confess={pen:'',
  go(){stopModes();closeSheets();const g=()=>{me.tRotY=-Math.PI/2;setTimeout(()=>this.open(),500)};if(me.pos.distanceTo(confAt)<.5&&me.mode==='stand')g();else moveMeTo({x:confAt.x,z:confAt.z},g)},
  open(){$('#conf').classList.add('show');this.r(0)},
  close(){$('#conf').classList.remove('show');setTimeout(()=>$('#confBody').innerHTML='',600)},
  r(step){const B=$('#confBody');const btn=(arr)=>`<div class="btns">${arr.map((b,i)=>`<button class="sbtn ${b.p?'primary':''}" data-i="${i}">${b.t}</button>`).join('')}</div>`;let h='',bs=[];
    if(step===0){h=`<div class="who">고해소</div><div class="line">작은 창 너머로 조용한 숨소리가 들려요.</div><div class="note">이곳은 실제 고해성사를 대신하지 않아요. 마음을 정리해 보는 조용한 연습의 자리예요.</div>`;bs=[{t:'나가기',f:()=>this.close()},{t:'성호를 긋고 시작하기',p:1,f:()=>{me.doCross();this.r(1)}}]}
    if(step===1){h=`<div class="who">신부님</div><div class="line">하느님의 자비를 믿으며, 편안히 말씀하세요.</div><textarea id="confTxt" placeholder="털어놓고 싶은 것을 적어도, 마음속으로만 떠올려도 괜찮아요."></textarea><div class="note">적은 내용은 어디에도 저장되지 않고, 이 창을 닫으면 사라져요.</div>`;bs=[{t:'고백을 마쳤습니다',p:1,f:()=>{this.pen=pick(PEN);this.r(2)}}]}
    if(step===2){h=`<div class="who">신부님</div><div class="line">${pick(COMFORT)}</div><div class="note" style="color:var(--gold);font-size:14px">보속 · ${this.pen}</div>`;bs=[{t:'보속을 받아들입니다',p:1,f:()=>this.r(3)}]}
    if(step===3){h=`<div class="who">신부님</div><div class="line">이제 당신을 위해 용서의 기도를 바칩니다.</div><div class="note">사제가 손을 들어 기도하는 동안 고개를 숙여요.</div>`;bs=[{t:'아멘',p:1,f:()=>{Snd.chime();this.r(4)}}]}
    if(step===4){h=`<div class="who">신부님</div><div class="line">평화로이 가십시오.</div>`;bs=[{t:'감사합니다',p:1,f:()=>{this.close();toast(`보속: ${this.pen}`);if(this.pen.startsWith('성모송')||this.pen.startsWith('주님의'))setTimeout(()=>toast('묵주로 바로 바쳐도 좋아요'),3600)}}]}
    B.innerHTML=h+btn(bs);B.querySelectorAll('[data-i]').forEach(el=>el.onclick=()=>bs[+el.dataset.i].f())}};

/* ---------- 찰고 quiz ---------- */
const QZ=[
  {q:'성호경을 그을 때 손이 지나가는 순서는?',o:['이마 → 가슴 → 왼쪽 어깨 → 오른쪽 어깨','이마 → 가슴 → 오른쪽 어깨 → 왼쪽 어깨','가슴 → 이마 → 왼쪽 어깨 → 오른쪽 어깨','이마 → 왼쪽 어깨 → 오른쪽 어깨 → 가슴'],a:0,e:'천주교는 왼쪽 어깨를 먼저, 정교회는 오른쪽 어깨를 먼저 짚어요.'},
  {q:'다음 중 칠성사가 아닌 것은?',o:['세례성사','견진성사','혼인성사','성지순례'],a:3,e:'칠성사는 세례·견진·성체·고해·병자·성품·혼인성사예요.'},
  {q:'미사에서 “내 탓이오”를 하며 가슴을 치는 예식은?',o:['참회 예식','말씀 전례','영성체 예식','마침 예식'],a:0,e:'미사 시작 부분의 참회 예식에서 고백 기도와 함께 가슴을 쳐요.'},
  {q:'묵주기도 한 단에서 바치는 성모송은 몇 번?',o:['5번','7번','10번','12번'],a:2,e:'한 단은 주님의 기도 1번, 성모송 10번, 영광송 1번으로 이루어져요.'},
  {q:'영성체 전에 지키는 공복재는?',o:['30분','1시간','3시간','전날 자정부터'],a:1,e:'지금은 영성체 전 1시간 동안 음식을 삼가요(물과 약은 괜찮아요). 예전에는 자정부터였죠.'},
  {q:'부활 시기에 사제가 입는 제의 색은?',o:['흰색','보라색','녹색','빨간색'],a:0,e:'대림·사순은 보라, 연중 시기는 녹색, 성령 강림과 순교자 축일은 빨강이에요.'},
  {q:'사순 시기가 시작되는 날은?',o:['재의 수요일','성 목요일','주님 수난 성지 주일','대림 제1주일'],a:0,e:'재의 수요일에 이마에 재를 바르며 사순 시기를 시작해요.'},
  {q:'세례 때 받는 이름을 무엇이라고 할까요?',o:['세례명(본명)','법명','아명','호'],a:0,e:'세례명은 수호성인의 이름을 따서 정해요. 법명은 불교의 이름이에요.'},
  {q:'1784년 북경에서 세례를 받아 한국 천주교의 시작으로 꼽히는 인물은?',o:['이승훈 베드로','김대건 안드레아','정약용','최양업 토마스'],a:0,e:'이승훈은 한국인 첫 영세자예요. 김대건 신부는 한국인 첫 사제고요.'},
];


/* ---------- hooks ---------- */
Object.assign(P,{
  rooms:ROOMS,pickRoom:h=>ROOMS[h>=6&&h<16?0:h>=16&&h<19?1:2],
  onRoom(p){winMats.forEach(m=>m.color.setHex(p.tint).multiplyScalar(p.win));shaftMat.opacity=p.shaft;shaftMat.color.setHex(p.shaftC);shafts.forEach(s=>s.visible=p.shaft>0);
    poolMat.opacity=p.pool;dust.material.opacity=p.shaft>0?.55:.2;altarL.intensity=2.4*p.candle},
  slots,seatMeshes:pewMeshes,floors:[floor,carpet],tapTargets:[votive,confBooth],seatsForHit:h=>slots.filter(s=>s.bench===h.instanceId),
  walkable,plan,clampFloor,randomSpot:()=>clampFloor(rand(-6,6),rand(-13,12)),
  door:{x:0,z:12.8,rot:Math.PI},exitZ:13.2,start:{x:0,z:12.4},startWalk:{x:0,z:9.6},respawn:{x:0,z:10.5},
  camBounds:{x:[-6.2,6.2],z:[-19.6,13.8],y:[.6,9]},
  crowd:r=>r.id==='night'?Math.floor(rand(12,18)):Math.floor(rand(22,30)),maxCrowd:r=>r.id==='night'?18:30,
  placeInitial(a){if(Math.random()<.46){a.pos.set(rand(-2.8,2.8),0,rand(-14.2,-13));a.mode=Math.random()<.5?'kneel':'stand';a.fold=Math.random()<.5;return true}return false},
  aiChoose(a,entering){
    if(entering&&Math.random()<.25){a.goTo(plan(a.pos,{x:votiveAt.x,z:votiveAt.z-rand(.9,1.4)}),()=>{a.tRotY=Math.PI/2;setTimeout(()=>{a.reachT=0;setTimeout(()=>{lightVotive();if(near(a,9))toast(`${a.name}님이 초를 봉헌했어요`,{other:true});setTimeout(()=>aiChoose(a),rand(2500,5000))},800)},600)});return true}
    if(Math.random()<.15){a.goTo(plan(a.pos,{x:rand(-2.6,2.6),z:rand(-14.3,-13.2)}),()=>{a.tRotY=Math.PI;a.mode='kneel'});return true}
    return false},
  aiIdle(a){if(a.crossT<0){a.doCross();if(near(a,7))toast(`${a.name}님이 성호를 그었어요`,{other:true})}},
  tapFirst(x,y){
    if(pickCandle){const h=ray.intersectObject(votive,true).find(h=>h.object.userData.vs!=null);
      if(h){pickVotive(vslots[h.object.userData.vs]);return true}
      const i=nearestOnScreen(vslots.map(v=>v.cup.getWorldPosition(new THREE.Vector3())),x,y,70,vslots.map(v=>!v.flame));if(i>=0){pickVotive(vslots[i]);return true}
      pickCandle=false;cam.focus=null;toast('초 고르기를 그만뒀어요');return true}
    if(Server.prep){const h=ray.intersectObjects(altarHits)[0];if(h){Server.light(h.object.userData.i);return true}
      const i=nearestOnScreen(altarHits.map(o=>o.position.clone()),x,y,60,altarFlames.map(f=>!f.visible));if(i>=0){Server.light(i);return true}}
    return false},
  tapHit(h){const k=h.object.userData.kind;if(k==='confess'){Confess.go();return true}if(k==='votive'){myVotive();return true}return false},
  keyBlock:()=>$('#conf').classList.contains('show'),
  onKeyWalk(){if(pickCandle){pickCandle=false;cam.focus=null}},
  stopModes(except){if(Mass.on&&except!=='mass')Mass.end(true);if(Server.prep){Server.prep=false;altarFlames.forEach(f=>f.visible=true)}if(Choir.on)Choir.stop();pickCandle=false},
  spot(){if(pickCandle||Mass.on)return null;if(me.pos.distanceTo(votiveAt)<2.6)return {label:'초 봉헌하기',pos:new THREE.Vector3(5.6,2.1,-12),go:myVotive};
    if(me.pos.distanceTo(confAt)<2.4)return {label:'고해소 들어가기',pos:new THREE.Vector3(-5.1,2.9,-4),go:()=>Confess.go()};return null},
  update(dt,t){if(priest.root.visible){priest.update(dt);priest.pos.y=lerp(priest.pos.y,priest.pos.z<-16.4?.7:.35,1-Math.exp(-dt*8))}Choir.m.forEach(a=>a.update(dt));
    if(hostFx){hostFx.t+=dt;hostFx.mesh.position.y=hostFx.y+Math.min(hostFx.t,1)*.05;hostFx.mesh.material.opacity=hostFx.t<1.2?1:Math.max(0,1-(hostFx.t-1.2)*2);if(hostFx.t>1.8){world.remove(hostFx.mesh);hostFx=null}}
    let lit=0;vslots.forEach(v=>{if(v.flame){lit++;v.life-=dt;if(v.life<0){v.flame.parent.remove(v.flame);flames.splice(flames.indexOf(v.flame),1);v.flame=null;v.cup.material=M.cup}}});
    votL.intensity=(.25+lit*.09)*room.p.candle*(1+Math.sin(t*7)*.05);votiveGlow.material.opacity=Math.min(.7,lit*.03)*(room.id==='night'?1.4:.8);
    altarL.intensity=2.4*room.p.candle*(1+Math.sin(t*6.3)*.03+Math.sin(t*17)*.02);lampGlow.material.opacity=.75+Math.sin(t*3)*.15;
    const dpa=dust.geometry.attributes.position;for(let i=0;i<dustN;i++){let y=dpa.getY(i)+Math.sin(t*.4+i)*.0015-.0008;if(y<.2)y=7;dpa.setY(i,y);dpa.setX(i,dpa.getX(i)+Math.sin(t*.3+i*1.7)*.0012)}dpa.needsUpdate=true},
  hourBell(h){const n=Math.min(h%12||12,6);for(let i=0;i<n;i++)Snd.bell(185,i*2.4,.6);toast(h===6||h===12||h===18?'삼종기도 시간이에요. 잠시 마음을 모아요':`${h}시 종이 울려요`)},
  foldSheets:['#rosary'],noScrim:['#rosary'],
  more:{mass:()=>Mass.start(),server:()=>Server.start(),choir:()=>Choir.start(),confess:()=>Confess.go(),votive:()=>{stopModes();myVotive()},mea:meaCulpa,peace:peaceAct,
    quiz:()=>Quiz.start(QZ,{title:'찰고',desc:'세례·첫영성체 전 신부님 앞에서 보던 교리 문답이에요.',pass:5,stamp:'찰고<br>통과',passMsg:'신부님이 도장을 쾅 찍어 주셨어요.<br>이제 첫영성체 준비 완료!',failLine:'“다음 주에 다시 오너라.”',failMsg:'수녀님과 교리를 한 번 더 복습해 볼까요?'})},
});
$('#aCross').onclick=()=>me&&myCross();
$('#aRosary').dataset.sheetBtn='#rosary';$('#aRosary').onclick=()=>toggleSheet('#rosary',renderRosary);
startSanctuary();
