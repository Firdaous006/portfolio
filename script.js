const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
function safe(fn) { try { fn(); } catch (e) { /* ignore */ } }

safe(() => { $("#year").textContent = new Date().getFullYear(); });

safe(() => {
  const navToggle = $("#navToggle");
  const navMenu   = $("#navMenu");
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  $$(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
});

safe(() => {
  const bar = $("#progressBar");
  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : "0%";
  });
});

safe(() => {
  const sections = ["about","skills","projects","experience","contact"]
    .map(id => document.getElementById(id)).filter(Boolean);
  const links = $$(".nav__link");
  function update() {
    const y = window.scrollY + 120;
    let cur = sections[0]?.id || "about";
    for (const s of sections) if (s.offsetTop <= y) cur = s.id;
    links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${cur}`));
  }
  window.addEventListener("scroll", update);
  update();
});

safe(() => {
  const btn = $("#copyContactEmail");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const email = btn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      const old = btn.textContent;
      btn.textContent = "Copié ✅";
      setTimeout(() => (btn.textContent = old), 900);
    } catch { alert("Email : " + email); }
  });
});

safe(() => {
  if (typeof emailjs === "undefined") return;
  emailjs.init("MaLA5Bl3WeD6HDbza");
  const form      = $("#contactForm");
  const submitBtn = $("#submitBtn");
  if (!form || !submitBtn) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const oldText         = submitBtn.textContent;
    submitBtn.textContent = "Envoi en cours...";
    submitBtn.disabled    = true;
    try {
      await emailjs.sendForm("service_9pu9j9h", "template_cqetnde", form);
      submitBtn.textContent = "Message envoyé ✅";
      form.reset();
      setTimeout(() => { submitBtn.textContent = oldText; submitBtn.disabled = false; }, 3000);
    } catch (err) {
      submitBtn.textContent = "Erreur — réessaie ❌";
      submitBtn.disabled = false;
    }
  });
});

$$(".skill-toggle, .proj-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const open   = btn.getAttribute("aria-expanded") === "true";
    const target = btn.nextElementSibling;
    if (!target) return;
    btn.setAttribute("aria-expanded", String(!open));
    target.hidden = open;
  });
});

$$(".proj-tabs").forEach(tabsEl => {
  const card   = tabsEl.closest(".project-card");
  const tabs   = [...tabsEl.querySelectorAll(".proj-tab")];
  const panels = [...card.querySelectorAll(".proj-tab-content")];
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      panels.forEach(panel => {
        const toggle = panel.querySelector(".proj-toggle");
        const detail = panel.querySelector(".proj-details");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        if (detail) detail.hidden = true;
      });
      tabs.forEach(t => t.classList.toggle("is-active", t === tab));
      panels.forEach(p => { p.hidden = p.id !== tab.dataset.tab; });
    });
  });
});

const pdfModal    = document.getElementById("pdfModal");
const pdfFrame    = document.getElementById("pdfModalFrame");
const pdfTitle    = document.getElementById("pdfModalTitle");
const pdfDownload = document.getElementById("pdfModalDownload");
const pdfClose    = document.getElementById("pdfModalClose");
const pdfOverlay  = document.getElementById("pdfModalOverlay");

const WIP_PROJECTS = ["assets/ecommerce_wip", "assets/AP_SIO_wip", "assets/Hackathon_wip"];

function getOrCreateWip() {
  let wip = pdfFrame.parentElement.querySelector(".pdf-wip");
  if (!wip) {
    wip = document.createElement("div");
    wip.className = "pdf-wip";
    wip.innerHTML = `
      <div class="pdf-wip__icon">🚧</div>
      <p class="pdf-wip__title">Projet en cours</p>
      <p class="pdf-wip__text">La documentation sera disponible à la finalisation du projet.</p>
    `;
    pdfFrame.parentElement.appendChild(wip);
  }
  return wip;
}

function openPdf(src, title) {
  pdfTitle.textContent = title || src;
  pdfModal.classList.add("is-open");
  pdfModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const wip = getOrCreateWip();
  if (WIP_PROJECTS.includes(src)) {
    pdfFrame.style.display = "none";
    pdfFrame.src = "";
    wip.style.display = "flex";
    pdfDownload.style.visibility = "hidden";
  } else {
    wip.style.display = "none";
    pdfFrame.style.display = "block";
    pdfFrame.src = src;
    pdfDownload.href = src;
    pdfDownload.style.visibility = "visible";
  }
}

function closePdf() {
  pdfModal.classList.remove("is-open");
  pdfModal.setAttribute("aria-hidden", "true");
  pdfFrame.src = "";
  pdfFrame.style.display = "block";
  pdfDownload.style.visibility = "visible";
  const wip = pdfFrame.parentElement.querySelector(".pdf-wip");
  if (wip) wip.style.display = "none";
  document.body.style.overflow = "";
}

$$(".proj-doc-btn").forEach(btn => btn.addEventListener("click", () => openPdf(btn.dataset.pdf, btn.dataset.title)));
pdfClose.addEventListener("click", closePdf);
pdfOverlay.addEventListener("click", closePdf);
document.addEventListener("keydown", e => { if (e.key === "Escape" && pdfModal.classList.contains("is-open")) closePdf(); });

safe(() => {
  const cvBtn = document.getElementById("openCvBtn");
  if (!cvBtn) return;
  cvBtn.addEventListener("click", () => openPdf("assets/Cv stage.pdf", "CV — Firdaous Amadou"));
});

function openCiscoModal2() {
  document.getElementById('ciscoModal2').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeCiscoModal2() {
  document.getElementById('ciscoModal2').style.display = 'none';
  document.body.style.overflow = '';
}

function openCiscoModal1() {
  document.getElementById('ciscoModal1').style.display = 'block';
  document.body.style.overflow = 'hidden';
  showInfra(1);
}
function closeCiscoModal1() {
  document.getElementById('ciscoModal1').style.display = 'none';
  document.body.style.overflow = '';
}
function showInfra(n) {
  const p1 = document.getElementById('panelInfra1');
  const p2 = document.getElementById('panelInfra2');
  const t1 = document.getElementById('tabInfra1');
  const t2 = document.getElementById('tabInfra2');
  if (n === 1) {
    p1.style.display = 'flex'; p2.style.display = 'none';
    t1.style.background = 'rgba(59,130,246,0.15)'; t1.style.borderColor = 'rgba(59,130,246,0.4)'; t1.style.color = '#60a5fa';
    t2.style.background = 'rgba(255,255,255,0.03)'; t2.style.borderColor = 'rgba(255,255,255,0.1)'; t2.style.color = '#7e90ad';
  } else {
    p1.style.display = 'none'; p2.style.display = 'flex';
    t2.style.background = 'rgba(16,185,129,0.12)'; t2.style.borderColor = 'rgba(16,185,129,0.4)'; t2.style.color = '#10b981';
    t1.style.background = 'rgba(255,255,255,0.03)'; t1.style.borderColor = 'rgba(255,255,255,0.1)'; t1.style.color = '#7e90ad';
  }
}