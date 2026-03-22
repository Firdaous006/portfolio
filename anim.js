(function () {
  "use strict";

  // ── TYPEWRITER ───────────────────────────────────────────
  const nameEl = document.getElementById("typedName");
  if (nameEl) {
    const text = "Firdaous Amadou";
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        nameEl.textContent = text.slice(0, i);
        i++;
        setTimeout(type, i === 1 ? 600 : 55 + Math.random() * 40);
      }
    };
    setTimeout(type, 300);
  }

  // ── TECH CANVAS ─────────────────────────────────────────
  const canvas = document.getElementById("techCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const CELL = 60, AB = "59,130,246", AG = "16,185,129";
  let W, H, cols, rows, nodes = [], edges = [], pulses = [];
  const rnd = (a,b) => a + Math.random()*(b-a);

  function build() {
    nodes=[]; edges=[]; pulses=[];
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
      nodes.push({x:c*CELL+rnd(-13,13), y:r*CELL+rnd(-13,13), p:rnd(0,1), v:Math.random()>.35});
      const i=r*cols+c;
      if (c<cols-1&&Math.random()>.3) edges.push({a:i,b:i+1});
      if (r<rows-1&&Math.random()>.3) edges.push({a:i,b:i+cols});
      if (c<cols-1&&r<rows-1&&Math.random()>.78) edges.push({a:i,b:i+cols+1});
    }
    for (let i=0;i<8;i++) spawn();
  }

  function spawn() {
    if (!edges.length) return;
    const e=edges[Math.floor(Math.random()*edges.length)];
    pulses.push({e,t:Math.random(),s:rnd(.004,.012),c:Math.random()>.65?AG:AB,tr:[]});
  }

  function resize() {
    W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight;
    cols=Math.ceil(W/CELL)+1; rows=Math.ceil(H/CELL)+1; build();
  }

  let tick=0;
  function draw() {
    ctx.clearRect(0,0,W,H); tick++;
    for (const e of edges) {
      const a=nodes[e.a],b=nodes[e.b]; if (!a||!b) continue;
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
      ctx.strokeStyle="rgba(59,130,246,.055)"; ctx.lineWidth=.8; ctx.stroke();
    }
    for (const n of nodes) {
      if (!n.v) continue;
      const ph=Math.sin(tick*.012+n.p*6.28);
      ctx.beginPath(); ctx.arc(n.x,n.y,2.2+ph*.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(${AB},${.12+ph*.07})`; ctx.fill();
    }
    for (let i=pulses.length-1;i>=0;i--) {
      const p=pulses[i],na=nodes[p.e.a],nb=nodes[p.e.b];
      if (!na||!nb){pulses.splice(i,1);continue;}
      p.t+=p.s;
      if (p.t>=1) {
        pulses.splice(i,1);
        const nx=edges.filter(e=>e.a===p.e.b||e.b===p.e.b);
        if (nx.length) pulses.push({e:nx[Math.floor(Math.random()*nx.length)],t:0,s:p.s,c:p.c,tr:[]});
        continue;
      }
      const cx=na.x+(nb.x-na.x)*p.t, cy=na.y+(nb.y-na.y)*p.t;
      p.tr.push({x:cx,y:cy}); if(p.tr.length>14) p.tr.shift();
      p.tr.forEach((pt,j)=>{
        const g=j/p.tr.length;
        ctx.beginPath(); ctx.arc(pt.x,pt.y,1.2*g,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.c},${g*.5})`; ctx.fill();
      });
      ctx.beginPath(); ctx.arc(cx,cy,2.5,0,Math.PI*2); ctx.fillStyle=`rgba(${p.c},.9)`; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2); ctx.fillStyle=`rgba(${p.c},.15)`; ctx.fill();
    }
    if (tick%90===0&&pulses.length<12) spawn();
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);

  // ── REVEAL ───────────────────────────────────────────────
  const els = document.querySelectorAll(".reveal");

  if (location.protocol === "file:") {
    // Ouverture locale (double-clic sur le fichier) → tout apparaît avec délai échelonné
    els.forEach((el, i) => setTimeout(() => el.classList.add("is-visible"), 80 + i * 70));
  } else if ("IntersectionObserver" in window) {
    // En ligne → scroll reveal classique
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add("is-visible"));
  }

})();
