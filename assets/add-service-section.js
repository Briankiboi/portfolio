// add-service-section.js — service cards using EXACT project-card UI from portfolio
(function () {

  // Only the minimal extra CSS needed for the section wrapper/grid
  // Card styles (.project-card, .project-card-body, .project-badge, etc.)
  // are ALREADY in index-389a2322.css — we reuse them directly.
  var CSS = `
/* Force native Testimonials to show: framer-motion whileInView can leave
   the cards stuck at opacity:0 under heavy GPU load — keep it basic. */
section:has(.feedbacks-wrap) {
  opacity: 1 !important;
  transform: none !important;
}
.feedback-card {
  opacity: 1 !important;
  transform: none !important;
}

/* Projects intro copy → brand blue (override featured-desc/exp-role) */
.featured-desc.exp-role {
  color: #2563eb !important;
}

/* ── Contact card content (cloned from portfolio-main/contact) ── */
.svc-contact-hero {
  text-align: center;
  margin: 0 0 1.2rem;
}
.svc-contact-title {
  font-size: inherit;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 0.6rem;
}
.svc-contact-sub {
  color: #c9c9c9;
  font-size: 1.02rem;
  line-height: 1.6;
  margin: 0;
}
.svc-contact-sub strong {
  color: #FFD600;
  font-weight: 700;
}
.contact-hero { text-align: left; margin: 0 0 1rem; }
.contact-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #FFD600;
  opacity: 0.85;
  margin: 0 0 0.5rem;
}
.contact-hero h1 {
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.6rem;
  letter-spacing: -0.025em;
  line-height: 1.1;
  padding: 0;
}
.contact-hero h1::after { display: none; }
.contact-lede {
  color: #c9c9c9;
  font-size: 0.95rem;
  line-height: 1.55;
  margin: 0 0 1.1rem;
}
.contact-primary-tiles {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
  margin: 0 0 1.1rem;
}
.contact-primary-tile {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.05rem 1rem;
  border-radius: 14px;
  border: 1px solid transparent;
  color: #fff;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.contact-primary-tile .contact-primary-arrow {
  font-size: 1.2rem;
  font-weight: 700;
  margin-left: auto;
  color: #fff;
  transition: transform 0.2s ease;
}
.contact-primary-tile:hover .contact-primary-arrow { transform: translateX(4px); }
.contact-primary-wa { background: #25D366; border-color: #25D366; }
.contact-primary-wa:hover { background: #20BD5A; box-shadow: 0 14px 32px rgba(37, 211, 102, 0.35); transform: translateY(-1px); }
.contact-primary-cal { background: #006BFF; border-color: #006BFF; }
.contact-primary-cal:hover { background: #0F7AFF; box-shadow: 0 14px 32px rgba(0, 107, 255, 0.32); transform: translateY(-1px); }
.contact-primary-icon {
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.contact-primary-icon svg { width: 26px; height: 26px; display: block; }
.contact-primary-body { flex: 1; min-width: 0; }
.contact-primary-body strong {
  display: block;
  font-size: 1.02rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #fff;
}
.contact-primary-body small {
  display: block;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 500;
}
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  max-width: 100%;
  margin: 0 0 0.5rem;
  border-top: 1px solid #25272f;
}
.contact-channel {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.2rem;
  border-bottom: 1px solid #25272f;
  text-decoration: none;
  color: #fff;
  transition: background 0.2s ease, padding-left 0.2s ease;
  min-width: 0;
  overflow: hidden;
}
.contact-channel:hover {
  background: rgba(255, 255, 255, 0.03);
  padding-left: 0.6rem;
}
.ch-ic {
  width: 54px;
  height: 54px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ch-ic i { font-size: 1.7rem; }
.ch-body { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.ch-body strong {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.05rem;
}
.ch-body small {
  font-size: 0.9rem;
  color: #9aa0aa;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ch-call .ch-ic { color: #60a5fa; }
.ch-mail .ch-ic { color: #f87171; }
.ch-linkedin .ch-ic { color: #0a66c2; }
.ch-github .ch-ic { color: #fff; }
.ch-medium .ch-ic { color: #fff; }
.ch-stack .ch-ic { color: #f48024; }
.ch-wa .ch-ic { color: #25D366; }
.svc-send-box {
  margin: 1rem 0 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #25272f;
  border-radius: 14px;
  padding: 1rem;
}
.svc-send-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
}
.svc-send-head i { font-size: 1.5rem; color: #FFD600; }
.svc-send-text {
  width: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid #2a2d36;
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  padding: 0.8rem;
  resize: vertical;
  min-height: 84px;
  margin-bottom: 0.8rem;
}
.svc-send-text::placeholder { color: #9aa0aa; }
.svc-send-text:focus { outline: none; border-color: #FFD600; }
.svc-send-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #2563eb;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}
.svc-send-btn:hover { background: #3b82f6; transform: translateY(-1px); }
.svc-contact-mount {
  opacity: 1 !important;
  transform: none !important;
  animation: none !important;
  transition: none !important;
}
.svc-contact-me-h {
  margin: 0 0 0.3rem;
}
.ch-stack:hover { border-color: rgba(244, 128, 36, 0.7); box-shadow: 0 12px 26px rgba(244, 128, 36, 0.2); }

/* ── Hero section mobile override ── */
@media (max-width: 768px) {
  .hero-greeting { font-size: clamp(28px, 8vw, 48px) !important; line-height: 1.2 !important; }
  .hero-oneline { white-space: normal !important; text-align: center !important; }
  .hero-content { max-width: 100% !important; padding: 0 16px !important; }
  .hero-content h1.hero-title { font-size: 26px !important; margin-bottom: 16px !important; }
  .profession-slider { min-width: 120px !important; }
}
@media (max-width: 480px) {
  .hero-greeting { font-size: clamp(24px, 7vw, 36px) !important; line-height: 1.15 !important; margin-top: 0.8rem !important; }
  .hero-oneline { font-size: clamp(11px, 3.2vw, 15px) !important; line-height: 1.3 !important; text-align: center !important; white-space: normal !important; }
  .hero-content { padding: 0 12px !important; }
  .hero-content h1.hero-title { font-size: 22px !important; margin-bottom: 12px !important; }
  .hero-content p.hero-desc { font-size: 14px !important; line-height: 24px !important; }
}

/* ── Testimonials mobile override ── */
@media (max-width: 768px) {
  section:has(.feedbacks-wrap) {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .feedbacks-wrap {
    padding: 24px 20px !important;
    margin-top: 28px !important;
    border-radius: 16px !important;
  }
  .feedback-card {
    border-radius: 14px !important;
  }
  .feedback-quote { font-size: 32px !important; }
  .feedback-body { font-size: 14px !important; line-height: 1.55 !important; }
  .feedback-foot { margin-top: 16px !important; padding-top: 14px !important; }
  .feedback-avatar { width: 40px !important; height: 40px !important; }
  .feedback-name { font-size: 13px !important; }
  .feedback-role { font-size: 11.5px !important; }
}
@media (max-width: 480px) {
  section:has(.feedbacks-wrap) {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .feedbacks-wrap {
    padding: 20px 16px !important;
    margin-top: 20px !important;
  }
  .feedback-quote { font-size: 28px !important; }
  .feedback-body { font-size: 13px !important; line-height: 1.5 !important; }
  .feedback-avatar { width: 36px !important; height: 36px !important; }
}

/* ── Native "What I Do" section mobile override ── */
@media (max-width: 768px) {
  section:has(.services-grid-new) {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .services-grid-new { gap: 14px !important; margin-top: 28px !important; }
  .service-card-new { padding: 20px 18px !important; gap: 14px !important; border-radius: 16px !important; }
  .service-card-new h3 { font-size: 16px !important; line-height: 24px !important; }
  .service-card-new p { font-size: 13px !important; line-height: 20px !important; }
}
@media (max-width: 480px) {
  section:has(.services-grid-new) {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .services-grid-new { gap: 10px !important; margin-top: 20px !important; }
  .service-card-new { padding: 16px 14px !important; gap: 12px !important; border-radius: 14px !important; }
  .service-icon-box { min-width: 40px !important; min-height: 40px !important; }
  .service-card-new h3 { font-size: 15px !important; line-height: 22px !important; }
  .service-card-new p { font-size: 12px !important; line-height: 18px !important; margin-top: 4px !important; }
}

/* ── Native "Tech Stack" section mobile override ── */
@media (max-width: 768px) {
  section:has(.tech-stack-card-new) {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .tech-stack-card-new { padding: 20px 16px !important; margin-top: 28px !important; }
  .tech-category-head { font-size: 15px !important; margin-bottom: 12px !important; padding-bottom: 8px !important; }
  .tech-category-box { margin-bottom: 24px !important; }
}
@media (max-width: 480px) {
  section:has(.tech-stack-card-new) {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .tech-stack-card-new { padding: 16px 14px !important; margin-top: 20px !important; border-radius: 16px !important; }
  .tech-category-head { font-size: 14px !important; margin-bottom: 10px !important; }
  .tech-category-box { margin-bottom: 18px !important; }
  .tech-items-grid { gap: 8px !important; }
}
@media (max-width: 640px) {
  .svc-contact-me-h { margin-bottom: 0.25rem; }
  .contact-hero h1 { font-size: clamp(1.3rem, 5vw, 1.7rem); }
  .contact-lede { font-size: 0.88rem; }
  .contact-primary-tiles { grid-template-columns: 1fr; }
  .contact-grid { grid-template-columns: 1fr; }
  .ch-ic { width: 44px; height: 44px; }
  .ch-ic i { font-size: 1.4rem; }
  .ch-body strong { font-size: 0.95rem; }
  .ch-body small { font-size: 0.82rem; }
}
#svc-deliver-section {
  padding: 70px 24px 60px;
  background: #050816;
  font-family: 'Poppins', sans-serif;
}
#svc-deliver-section .about-services-inner {
  max-width: 1100px;
  margin: 0 auto;
}
#svc-deliver-section .svc-standalone-head {
  margin-bottom: 2.2rem;
}
#svc-deliver-section .svc-standalone-head h2 {
  margin: 0;
}
#svc-deliver-section .svc-standalone-sub {
  margin: 0.7rem auto 0;
  color: #a3a6b5;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
}
#svc-deliver-section .about-eyebrow {
  display: inline-block !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.16em !important;
  text-transform: uppercase !important;
  color: #FFD600 !important;
  opacity: 1 !important;
  margin: 0 0 0.5rem !important;
  padding: 0 0 0 1.4rem !important;
  max-width: none !important;
  line-height: 1.2 !important;
  position: relative;
  visibility: visible !important;
}
#svc-deliver-section .about-eyebrow::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FFD600);
}
#svc-deliver-section .about-block-head h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}
/* Services grid — EXACT service-card UI from portfolio-main /about */
#svc-deliver-section .services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 10px;
}
#svc-deliver-section .service-card {
  background: #232526;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}
#svc-deliver-section .service-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 30px rgba(255, 214, 0, 0.13);
  border-color: rgba(255, 214, 0, 0.45);
}
#svc-deliver-section .service-icon {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}
#svc-deliver-section .service-icon img {
  width: 36px;
  height: 36px;
}
#svc-deliver-section .service-title {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 6px;
}
#svc-deliver-section .service-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #00C896, #00E6A8);
  color: #0D0D1A;
  font-size: 0.55rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 0 16px 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
#svc-deliver-section .service-desc {
  color: #f1f1f1;
  font-size: 0.95rem;
  opacity: 0.85;
  font-weight: 400;
}
#svc-deliver-section .service-desc strong { color: #fff; opacity: 1; }
@media (max-width: 900px) {
  #svc-deliver-section .services-grid { grid-template-columns: 1fr; gap: 10px; }
  #svc-deliver-section .service-card { padding: 14px 16px; gap: 12px; }
  #svc-deliver-section .service-icon img { width: 30px; height: 30px; }
  #svc-deliver-section .service-title { font-size: 1rem; margin-bottom: 4px; }
  #svc-deliver-section .service-desc { font-size: 0.85rem; line-height: 1.45; }
  #svc-deliver-section .svc-standalone-head { margin-bottom: 1.2rem; }
}
@media (max-width: 480px) {
  #svc-deliver-section { padding: 35px 16px 25px; }
  #svc-deliver-section .svc-standalone-head { margin-bottom: 0.8rem; }
  #svc-deliver-section .service-card { padding: 12px 14px; gap: 10px; }
  #svc-deliver-section .service-icon img { width: 26px; height: 26px; }
  #svc-deliver-section .service-title { font-size: 0.92rem; }
  #svc-deliver-section .service-desc { font-size: 0.78rem; line-height: 1.4; }
}

/* Packages section — EXACT svc-package UI from portfolio-main /about */
#svc-packages-section {
  padding: 50px 24px 55px;
  background: #050816;
  font-family: 'Poppins', sans-serif;
}
#svc-packages-section .svc-block-head { margin-bottom: 1.4rem; }
#svc-packages-section .svc-standalone-head {
  margin-bottom: 1.4rem;
}
#svc-packages-section .svc-standalone-head h2 {
  margin: 0;
  font-size: clamp(1.7rem, 3.6vw, 2.4rem) !important;
  line-height: 1.15;
}
#svc-packages-section .svc-standalone-sub {
  margin: 0.35rem auto 0;
  color: #a3a6b5;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
}
#svc-packages-section .svc-eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #FFD600;
  opacity: 0.85;
  margin: 0 0 0.45rem;
  padding: 0;
  padding-left: 1.4rem;
  position: relative;
}
#svc-packages-section .svc-eyebrow::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FFD600);
  border-radius: 2px;
}
#svc-packages-section .svc-block-head h3 {
  font-size: 1.4rem;
  margin: 0 0 0.4rem;
  color: #fff;
  font-weight: 700;
  letter-spacing: -0.01em;
}
#svc-packages-section .svc-block-sub {
  color: #9aa0aa;
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  max-width: 640px;
}
#svc-packages-section .svc-packages { margin: 2rem 0 2.5rem; }
#svc-packages-section .svc-package-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
#svc-packages-section .svc-package {
  display: flex;
  flex-direction: column;
  background: #151030;
  border: 1px solid #332a58;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
#svc-packages-section .svc-package:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 214, 0, 0.45);
}
#svc-packages-section .svc-package .svc-package-img {
  display: block;
  width: 100%;
  height: auto;
  background: #120b2f;
  cursor: zoom-in;
  overflow: hidden;
  flex: none;
}
#svc-packages-section .svc-package .svc-package-img img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  transition: transform 0.5s ease;
}
#svc-packages-section .svc-package:hover .svc-package-img img { transform: scale(1.02); }
#svc-packages-section .svc-package-body {
  padding: 1.1rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
#svc-packages-section .svc-package-eyebrow {
  font-size: 0.65rem;
  color: #FFD600;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0;
}
#svc-packages-section .svc-package-body h4 {
  font-size: 1.05rem;
  color: #fff;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
}
#svc-packages-section .svc-package-list {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
}
#svc-packages-section .svc-package-list li {
  position: relative;
  padding-left: 1.1rem;
  font-size: 0.82rem;
  color: #c9c9c9;
  line-height: 1.45;
}
#svc-packages-section .svc-package-list li::before {
  content: "→";
  position: absolute;
  left: 0;
  top: 0;
  color: #FFD600;
  font-weight: 700;
}
#svc-packages-section .svc-package-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.2rem;
}
#svc-packages-section .svc-package-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: -0.005em;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  border: 1.5px solid transparent;
  font-family: 'Poppins', sans-serif;
}
#svc-packages-section .svc-package-btn-primary {
  background: #FFD600;
  color: #18191A;
  box-shadow: 0 5px 14px rgba(255, 184, 0, 0.3);
}
#svc-packages-section .svc-package-btn-primary:hover {
  background: #FFE34D;
  transform: translateY(-1px);
  box-shadow: 0 9px 22px rgba(255, 184, 0, 0.45);
}
#svc-packages-section .svc-package-btn-ghost {
  background: transparent;
  color: #FFD600;
  border-color: rgba(255, 214, 0, 0.45);
}
#svc-packages-section .svc-package-btn-ghost:hover {
  background: rgba(255, 214, 0, 0.08);
  border-color: #FFD600;
  color: #FFE34D;
}
/* Both package buttons reuse the site "Download CV" button look */
#svc-packages-section .svc-package-btn.svc-package-btn-primary,
#svc-packages-section .svc-package-btn.svc-package-btn-ghost {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  flex: 1 1 auto;
  min-width: 0;
  padding: 11px 20px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  border: none !important;
  text-transform: capitalize !important;
}
#svc-packages-section .svc-package-btn.svc-package-btn-primary {
  background: #ffd600 !important;
  color: #070707 !important;
  box-shadow: 0 6px 22px rgba(255, 214, 0, 0.45) !important;
}
#svc-packages-section .svc-package-btn.svc-package-btn-primary:hover {
  background: #e6c200 !important;
  color: #070707 !important;
  box-shadow: 0 10px 32px rgba(255, 214, 0, 0.7) !important;
  transform: translateY(-2px);
}
#svc-packages-section .svc-package-btn.svc-package-btn-ghost {
  background: #2563eb !important;
  color: #ffffff !important;
  box-shadow: 0 6px 22px rgba(37, 99, 235, 0.45) !important;
}
#svc-packages-section .svc-package-btn.svc-package-btn-ghost:hover {
  background: #1d4ed8 !important;
  color: #ffffff !important;
  box-shadow: 0 10px 32px rgba(37, 99, 235, 0.7) !important;
  transform: translateY(-2px);
}
@media (max-width: 900px) {
  #svc-packages-section .svc-package-grid { grid-template-columns: 1fr; }
  #svc-packages-section .svc-package-body { padding: 0.9rem 1rem 1rem; }
  #svc-packages-section .svc-package-list li { font-size: 0.78rem; }
}
@media (max-width: 480px) {
  #svc-packages-section { padding: 35px 16px 30px; }
  #svc-packages-section .svc-standalone-head { margin-bottom: 1rem; }
  #svc-packages-section .svc-standalone-head h2 { font-size: 1.4rem !important; }
  #svc-packages-section .svc-standalone-sub { font-size: 0.78rem; }
  #svc-packages-section .svc-package { border-radius: 12px; }
  #svc-packages-section .svc-package .svc-package-img img { height: 160px; }
  #svc-packages-section .svc-package-body { padding: 0.8rem 0.85rem 0.9rem; gap: 0.4rem; }
  #svc-packages-section .svc-package-body h4 { font-size: 0.95rem; }
  #svc-packages-section .svc-package-list { gap: 0.25rem; }
  #svc-packages-section .svc-package-list li { font-size: 0.75rem; line-height: 1.4; }
  #svc-packages-section .svc-package-actions { gap: 0.35rem; }
}

/* Rate card preview — EXACT cv-preview UI from portfolio-main /about */
#svc-rate-section {
  padding: 0 24px 60px;
  background: #050816;
  font-family: 'Poppins', sans-serif;
}
#svc-rate-section .svc-standalone-head {
  margin-bottom: 1.4rem;
}
#svc-rate-section .svc-standalone-head h2 {
  margin: 0;
  font-size: clamp(1.7rem, 3.6vw, 2.4rem) !important;
  line-height: 1.15;
}
#svc-rate-section .svc-standalone-sub {
  margin: 0.35rem auto 0;
  color: #a3a6b5;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
}
#svc-rate-section .cv-preview {
  max-width: 640px;
  margin: 0 auto;
  background: #151030;
  border: 1px solid #332a58;
  border-radius: 16px;
  overflow: hidden;
}
#svc-rate-section .cv-preview-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #332a58;
  background: #1a1240;
}
#svc-rate-section .cv-preview-eyebrow {
  display: inline-block;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #FFD600;
  margin: 0 0 0.25rem;
  opacity: 0.85;
}
#svc-rate-section .cv-preview-head h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}
#svc-rate-section .cv-preview-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
#svc-rate-section .cv-preview-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  font-family: 'Poppins', sans-serif;
}
#svc-rate-section .cv-preview-btn-ghost {
  background: transparent;
  border: 1px solid #2a2d36;
  color: #d4d6db;
}
#svc-rate-section .cv-preview-btn-ghost:hover {
  border-color: #FFD600;
  color: #FFD600;
}
#svc-rate-section .cv-preview-btn-primary {
  background: linear-gradient(135deg, #FFD600, #FFB800);
  border: 1px solid #FFD600;
  color: #18191A;
  box-shadow: 0 4px 14px rgba(255, 184, 0, 0.3);
}
#svc-rate-section .cv-preview-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(255, 184, 0, 0.45);
}
/* Rate-card buttons reuse the site "Download CV" button look */
#svc-rate-section .cv-preview-btn.cv-preview-btn-ghost,
#svc-rate-section .cv-preview-btn.cv-preview-btn-primary {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding: 11px 20px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  border: none !important;
  text-transform: capitalize !important;
}
#svc-rate-section .cv-preview-btn.cv-preview-btn-ghost {
  background: #2563eb !important;
  color: #ffffff !important;
  box-shadow: 0 6px 22px rgba(37, 99, 235, 0.45) !important;
}
#svc-rate-section .cv-preview-btn.cv-preview-btn-ghost:hover {
  background: #1d4ed8 !important;
  color: #ffffff !important;
  box-shadow: 0 10px 32px rgba(37, 99, 235, 0.7) !important;
  transform: translateY(-2px);
}
#svc-rate-section .cv-preview-btn.cv-preview-btn-primary {
  background: #ffd600 !important;
  color: #070707 !important;
  box-shadow: 0 6px 22px rgba(255, 214, 0, 0.45) !important;
}
#svc-rate-section .cv-preview-btn.cv-preview-btn-primary:hover {
  background: #e6c200 !important;
  color: #070707 !important;
  box-shadow: 0 10px 32px rgba(255, 214, 0, 0.7) !important;
  transform: translateY(-2px);
}
#svc-rate-section .cv-preview-frame {
  position: relative;
  width: 100%;
  background: #fff;
  padding: 1.5rem 1.5rem 2rem;
  box-sizing: border-box;
}
#svc-rate-section .cv-preview-frame img {
  position: relative;
  inset: auto;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 500px;
  margin: 0 auto;
  object-fit: contain;
  background: #fff;
  display: block;
  cursor: zoom-in;
}
@media (max-width: 768px) {
  #svc-rate-section { padding: 0 16px 40px; }
  #svc-rate-section .svc-standalone-head { margin-bottom: 1rem; }
  #svc-rate-section .cv-preview-head { padding: 0.8rem 1rem; }
  #svc-rate-section .cv-preview-head h3 { font-size: 0.92rem; }
  #svc-rate-section .cv-preview-actions { width: 100%; }
  #svc-rate-section .cv-preview-btn { flex: 1; justify-content: center; font-size: 0.78rem; padding: 0.5rem 0.7rem; }
  #svc-rate-section .cv-preview-frame { padding: 1rem 1rem 1.5rem; }
  #svc-rate-section .cv-preview-frame img { max-height: 360px; }
}
@media (max-width: 480px) {
  #svc-rate-section { padding: 0 16px 30px; }
  #svc-rate-section .cv-preview { border-radius: 12px; }
  #svc-rate-section .cv-preview-head h3 { font-size: 0.85rem; }
  #svc-rate-section .cv-preview-btn { padding: 8px 12px !important; font-size: 13px !important; }
  #svc-rate-section .cv-preview-frame { padding: 0.8rem; }
  #svc-rate-section .cv-preview-frame img { max-height: 300px; }
}

/* Payment + CTA — EXACT svc-pay-methods + about-cta UI from portfolio-main /about */
#svc-payment-section {
  padding: 0 24px 10px;
  background: #050816;
  font-family: 'Poppins', sans-serif;
}
#svc-payment-section .svc-pay-methods-wrap { max-width: 1100px; margin: 0 auto; }
#svc-payment-section .svc-pay-methods {
  padding-top: 1.2rem;
  border-top: 1px solid #25272f;
}
#svc-payment-section .svc-pay-methods-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #9aa0aa;
  margin: 0 0 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
#svc-payment-section .svc-pay-methods-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 0.7rem;
}
#svc-payment-section .svc-pay-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  gap: 0.9rem;
  padding: 1.6rem 1.2rem 1.4rem;
  border-radius: 16px;
  color: #f1f1f1;
  background: linear-gradient(180deg, #181a20, #131519);
  border: 1px solid #25272f;
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
  text-decoration: none;
  box-sizing: border-box;
  width: 100%;
  font-family: 'Poppins', sans-serif;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1), border-color 0.25s ease, box-shadow 0.25s ease;
}
#svc-payment-section .svc-pay-card::before {
  content: '';
  position: absolute;
  top: -30%;
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  height: 200px;
  border-radius: 50%;
  opacity: 0.16;
  filter: blur(48px);
  z-index: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
#svc-payment-section .svc-pay-card > .svc-pay-logo,
#svc-payment-section .svc-pay-card > .svc-pay-meta { position: relative; z-index: 1; }
#svc-payment-section .svc-pay-mpesa::before { background: #25D366; }
#svc-payment-section .svc-pay-mpesa:hover {
  transform: translateY(-3px);
  border-color: rgba(37, 211, 102, 0.5);
  box-shadow: 0 18px 38px rgba(37, 211, 102, 0.16);
}
#svc-payment-section .svc-pay-mpesa:hover::before {
  opacity: 0.3;
  transform: translateX(-50%) scale(1.08);
}
#svc-payment-section .svc-pay-paypal::before { background: #009cde; }
#svc-payment-section .svc-pay-paypal:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 156, 222, 0.5);
  box-shadow: 0 18px 38px rgba(0, 156, 222, 0.16);
}
#svc-payment-section .svc-pay-paypal:hover::before {
  opacity: 0.3;
  transform: translateX(-50%) scale(1.08);
}
#svc-payment-section .svc-pay-logo {
  width: auto;
  min-width: 130px;
  height: 64px;
  background: transparent;
  border: none;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
}
#svc-payment-section .svc-pay-logo svg {
  height: 56px;
  width: auto;
  display: block;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}
#svc-payment-section .svc-pay-meta {
  flex: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
#svc-payment-section .svc-pay-meta strong {
  display: block;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.01em;
}
#svc-payment-section .svc-pay-meta small {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.76rem;
  color: #9aa0aa;
  font-weight: 500;
}
#svc-payment-section .svc-pay-mpesa .svc-pay-meta small::before,
#svc-payment-section .svc-pay-paypal .svc-pay-meta small::before {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  line-height: 1;
  padding: 0.18rem 0.42rem;
  border-radius: 5px;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Twemoji Mozilla', sans-serif;
}
#svc-payment-section .svc-pay-mpesa .svc-pay-meta small::before {
  content: '🇰🇪';
  background: rgba(37, 211, 102, 0.12);
  border: 1px solid rgba(37, 211, 102, 0.32);
}
#svc-payment-section .svc-pay-paypal .svc-pay-meta small::before {
  content: '🌍';
  background: rgba(0, 156, 222, 0.12);
  border: 1px solid rgba(0, 156, 222, 0.32);
}
#svc-payment-section .svc-pay-bank::before { background: #1E5EFF; }
#svc-payment-section .svc-pay-bank:hover {
  transform: translateY(-3px);
  border-color: rgba(30, 94, 255, 0.55);
  box-shadow: 0 18px 38px rgba(30, 94, 255, 0.18);
}
#svc-payment-section .svc-pay-bank:hover::before {
  opacity: 0.3;
  transform: translateX(-50%) scale(1.08);
}
#svc-payment-section .svc-pay-bank .svc-pay-meta small::before {
  content: '🏦';
  background: rgba(30, 94, 255, 0.12);
  border: 1px solid rgba(30, 94, 255, 0.32);
}
#svc-payment-section .svc-pay-note {
  color: #6b7280;
  font-size: 0.78rem;
  margin-top: 0.8rem;
  text-align: center;
}

/* Payment modals — EXACT .modal UI from portfolio-main /about */
#svc-payment-section .modal {
  display: none;
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  animation: svcFadeIn 0.3s ease-out;
}
@keyframes svcFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
#svc-payment-section .modal-content {
  background: linear-gradient(180deg, #1d1f27, #16181d);
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  padding: 0;
  border: 1px solid #2a2d36;
  border-radius: 20px;
  width: 92%;
  max-width: 460px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02);
  overflow: visible;
  animation: svcModalPopIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes svcModalPopIn {
  from { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
  to   { transform: translate(-50%, -50%) scale(1);    opacity: 1; }
}
#svc-payment-section .close-button {
  color: #1a1a1a;
  position: absolute;
  bottom: -62px;
  left: 50%;
  right: auto;
  top: auto;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 400;
  background: #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  transition: background 0.2s ease, transform 0.25s ease, color 0.2s ease, box-shadow 0.2s ease;
  z-index: 5;
  user-select: none;
  box-shadow: 0 6px 20px rgba(0,0,0,0.45);
  line-height: 1;
}
#svc-payment-section .close-button:hover,
#svc-payment-section .close-button:focus {
  color: #1a1a1a;
  background: #ffd54d;
  cursor: pointer;
  transform: translateX(-50%) rotate(90deg);
  box-shadow: 0 8px 24px rgba(255,213,77,0.4);
}
#svc-payment-section .modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.6rem;
  margin: 0;
  border-bottom: 1px solid #2a2d36;
  position: relative;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}
#svc-payment-section .modal-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(76, 175, 80, 0.12), transparent 60%);
  pointer-events: none;
}
#svc-payment-section #paypal-modal .modal-header::before {
  background: linear-gradient(120deg, rgba(0, 156, 222, 0.14), transparent 60%);
}
#svc-payment-section .modal-logo {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
#svc-payment-section .modal-logo svg {
  width: 110px;
  height: auto;
  border-radius: 10px;
  display: block;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
}
#svc-payment-section .modal-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  margin: 0;
  position: relative;
  z-index: 1;
}
#svc-payment-section .modal-body {
  padding: 1.4rem 1.6rem 1.6rem;
}
#svc-payment-section .modal-body > p:first-child {
  color: #c9c9c9;
  font-size: 0.92rem;
  line-height: 1.55;
  margin: 0 0 1rem;
}
#svc-payment-section .payment-details {
  background: #20222b;
  border: 1px solid #2a2d36;
  border-radius: 12px;
  padding: 0.4rem 0.85rem;
  margin: 0 0 1.1rem;
  display: flex;
  flex-direction: column;
}
#svc-payment-section .payment-details p {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  margin: 0;
  padding: 0.7rem 0;
  font-size: 0.92rem;
  color: #fff;
  border-bottom: 1px solid #25272f;
  flex-wrap: wrap;
}
#svc-payment-section .payment-details p:last-child { border-bottom: none; }
#svc-payment-section .payment-details strong {
  color: #9aa0aa;
  font-weight: 600;
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  flex-shrink: 0;
  margin-right: 0.5rem;
}
#svc-payment-section .modal-footer {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  background: rgba(255, 214, 0, 0.05);
  border: 1px solid rgba(255, 214, 0, 0.18);
  border-radius: 10px;
  color: #d4d6db;
  font-style: normal;
  font-size: 0.82rem;
  line-height: 1.5;
  margin: 0;
  padding: 0.75rem 0.9rem;
  position: relative;
}
#svc-payment-section .modal-footer::before {
  content: "💡";
  flex-shrink: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}
@media (max-width: 480px) {
  #svc-payment-section .modal-content { margin: 5% auto; }
  #svc-payment-section .modal-header { padding: 1.2rem; }
  #svc-payment-section .modal-logo svg { width: 90px; }
  #svc-payment-section .modal-header h3 { font-size: 1rem; }
  #svc-payment-section .modal-body { padding: 1.1rem 1.2rem 1.3rem; }
  #svc-payment-section .payment-details p { font-size: 0.88rem; }
}

#svc-cta-section {
  padding: 10px 24px 80px;
  background: #050816;
  font-family: 'Poppins', sans-serif;
}
#svc-cta-section .about-cta {
  max-width: 1100px;
  margin: 1.6rem auto 0;
  padding: 1.6rem 1.4rem 1.2rem;
  background: linear-gradient(180deg, #1a1c22, #16181d);
  border: 1px solid #25272f;
  border-radius: 16px;
  box-sizing: border-box;
}
#svc-cta-section .about-cta-head { margin-bottom: 1.1rem; }
#svc-cta-section .about-cta-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #86efac;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.55rem;
}
#svc-cta-section .about-cta-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #25D366;
  box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.22);
  animation: ctaPulse 1.8s ease-in-out infinite;
}
@keyframes ctaPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(0.9); }
}
#svc-cta-section .about-cta-h {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.3rem;
  letter-spacing: -0.015em;
  line-height: 1.25;
}
#svc-cta-section .about-cta-p {
  color: #9aa0aa;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}
#svc-cta-section .about-cta-p strong { color: #FFD600; font-weight: 600; }
#svc-cta-section .about-cta-tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  margin: 0 0 0.85rem;
}
#svc-cta-section .about-cta-tile {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1.4rem 1.2rem;
  border-radius: 14px;
  border: 1px solid transparent;
  color: #fff;
  text-decoration: none;
  box-sizing: border-box;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
#svc-cta-section .about-cta-tile-wa { background: #25D366; border-color: #25D366; }
#svc-cta-section .about-cta-tile-wa:hover {
  background: #20BD5A;
  border-color: #20BD5A;
  box-shadow: 0 14px 32px rgba(37, 211, 102, 0.32);
  transform: translateY(-1px);
}
#svc-cta-section .about-cta-tile-cal { background: #006BFF; border-color: #006BFF; }
#svc-cta-section .about-cta-tile-cal:hover {
  background: #0F7AFF;
  border-color: #0F7AFF;
  box-shadow: 0 14px 32px rgba(0, 107, 255, 0.32);
  transform: translateY(-1px);
}
#svc-cta-section .about-cta-tile-mail { background: #C5221F; border-color: #C5221F; }
#svc-cta-section .about-cta-tile-mail:hover {
  background: #EA4335;
  border-color: #EA4335;
  box-shadow: 0 14px 32px rgba(234, 67, 53, 0.32);
  transform: translateY(-1px);
}
#svc-cta-section .about-cta-tile-icon {
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
#svc-cta-section .about-cta-tile-icon img {
  width: 26px;
  height: 26px;
  filter: brightness(0) invert(1);
}
#svc-cta-section .about-cta-tile-body { flex: 1; min-width: 0; }
#svc-cta-section .about-cta-tile-body strong {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.15rem;
  color: #fff;
}
#svc-cta-section .about-cta-tile-body small {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 500;
}
#svc-cta-section .about-cta-tile-arrow {
  font-size: 1.4rem;
  font-weight: 700;
  margin-left: auto;
  color: #fff;
  transition: transform 0.2s ease;
}
#svc-cta-section .about-cta-tile:hover .about-cta-tile-arrow { transform: translateX(4px); }
@media (max-width: 980px) {
  #svc-cta-section .about-cta-tiles { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  #svc-payment-section { padding: 0 16px 10px; }
  #svc-payment-section .svc-pay-methods-row { grid-template-columns: 1fr; gap: 0.7rem; }
  #svc-payment-section .svc-pay-card { padding: 1.4rem 1rem 1.2rem; }
  #svc-payment-section .svc-pay-logo svg { height: 50px; }
  #svc-payment-section .svc-pay-meta strong { font-size: 0.95rem; }
  #svc-cta-section { padding: 10px 16px 60px; }
  #svc-cta-section .about-cta { padding: 1.3rem 1.1rem 1.2rem; }
  #svc-cta-section .about-cta-tiles { grid-template-columns: 1fr; }
  #svc-cta-section .about-cta-h { font-size: 1.1rem; }
  #svc-cta-section .about-cta-p { font-size: 0.85rem; }
}
@media (max-width: 480px) {
  #svc-payment-section { padding: 0 16px 10px; }
  #svc-payment-section .svc-pay-methods-label { font-size: 0.7rem; margin-bottom: 0.5rem; }
  #svc-payment-section .svc-pay-card { padding: 1.1rem 0.85rem 1rem; border-radius: 12px; }
  #svc-payment-section .svc-pay-logo { min-width: 100px; }
  #svc-payment-section .svc-pay-logo svg { height: 42px; }
  #svc-payment-section .svc-pay-meta strong { font-size: 0.88rem; }
  #svc-payment-section .svc-pay-meta small { font-size: 0.72rem; }
  #svc-payment-section .modal-content { width: 95%; max-width: 340px; }
  #svc-cta-section { padding: 10px 16px 40px; }
  #svc-cta-section .about-cta { padding: 1.1rem 1rem 1rem; border-radius: 12px; }
  #svc-cta-section .about-cta-tiles { gap: 0.65rem; }
  #svc-cta-section .about-cta-tile { padding: 1rem 0.9rem; border-radius: 12px; gap: 0.8rem; }
  #svc-cta-section .about-cta-tile-icon { width: 40px; height: 40px; border-radius: 10px; }
  #svc-cta-section .about-cta-tile-icon img { width: 22px; height: 22px; }
  #svc-cta-section .about-cta-tile-body strong { font-size: 0.9rem; }
  #svc-cta-section .about-cta-tile-body small { font-size: 0.72rem; }
  #svc-cta-section .about-cta-tile-arrow { font-size: 1.2rem; }
}
/* ── Native "Work Experience" section mobile override ── */
@media (max-width: 768px) {
  section:has(.vertical-timeline) {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .vertical-timeline:before { left: 22px !important; width: 3px !important; }
  .vertical-timeline-element-icon {
    width: 46px !important;
    height: 46px !important;
    left: 0 !important;
    border: 2px solid rgba(255, 214, 0, 0.5) !important;
    box-shadow: 0 0 0 3px rgba(0, 229, 153, 0.2) !important;
  }
  .vertical-timeline-element-icon svg {
    width: 22px !important;
    height: 22px !important;
    margin-left: -11px !important;
    margin-top: -11px !important;
  }
  .vertical-timeline-element-content {
    margin-left: 60px !important;
    padding: 16px 18px !important;
    border-radius: 14px !important;
  }
  .vertical-timeline-element-content h3,
  .exp-role {
    font-size: 16px !important;
    line-height: 1.3 !important;
  }
  .exp-company {
    font-size: 14px !important;
  }
  .exp-meta {
    font-size: 11px !important;
    padding: 2px 8px !important;
  }
  .exp-summary {
    font-size: 13px !important;
    line-height: 20px !important;
  }
  .tech-chip {
    padding: 3px 10px !important;
    font-size: 11px !important;
  }
  .exp-summary::before {
    font-size: 12px !important;
  }
}
@media (max-width: 480px) {
  section:has(.vertical-timeline) {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .vertical-timeline:before { left: 18px !important; }
  .vertical-timeline-element-icon {
    width: 40px !important;
    height: 40px !important;
    border: 2px solid rgba(255, 214, 0, 0.5) !important;
  }
  .vertical-timeline-element-icon svg {
    width: 18px !important;
    height: 18px !important;
    margin-left: -9px !important;
    margin-top: -9px !important;
  }
  .vertical-timeline-element-content {
    margin-left: 52px !important;
    padding: 14px 14px !important;
    border-radius: 12px !important;
  }
  .vertical-timeline-element-content h3,
  .exp-role {
    font-size: 14px !important;
    line-height: 1.25 !important;
  }
  .exp-company {
    font-size: 13px !important;
  }
  .exp-meta {
    font-size: 10.5px !important;
    padding: 2px 7px !important;
  }
  .exp-summary {
    font-size: 12px !important;
    line-height: 18px !important;
    padding-left: 14px !important;
  }
  .exp-summary::before {
    font-size: 11px !important;
    left: 0 !important;
  }
  .tech-chip {
    padding: 2px 8px !important;
    font-size: 10px !important;
  }
  .vertical-timeline-element-content h3::after {
    width: 36px !important;
    height: 2px !important;
    bottom: -4px !important;
  }
}

/* ── Contact card mobile override ── */
@media (max-width: 768px) {
  section:has(.svc-contact-mount) {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .svc-contact-mount-content { padding: 0 !important; }
  .svc-contact-hero { margin-bottom: 0.8rem !important; }
  .svc-contact-title { font-size: clamp(1.3rem, 5vw, 1.7rem) !important; text-align: center !important; }
  .svc-contact-sub { font-size: 0.9rem !important; }
  .contact-primary-tile { padding: 0.9rem 0.9rem !important; border-radius: 12px !important; }
  .contact-primary-icon { width: 40px !important; height: 40px !important; border-radius: 10px !important; }
  .contact-primary-icon svg { width: 22px !important; height: 22px !important; }
  .contact-primary-body strong { font-size: 0.92rem !important; }
  .contact-primary-body small { font-size: 0.78rem !important; }
  .ch-ic { width: 44px !important; height: 44px !important; }
  .ch-ic i { font-size: 1.35rem !important; }
  .ch-body strong { font-size: 0.92rem !important; }
  .ch-body small { font-size: 0.8rem !important; }
  .svc-send-box { padding: 0.8rem !important; border-radius: 12px !important; }
  .svc-send-head { font-size: 0.95rem !important; margin-bottom: 0.5rem !important; }
  .svc-send-head i { font-size: 1.3rem !important; }
  .svc-send-text { font-size: 0.88rem !important; padding: 0.7rem !important; min-height: 72px !important; }
  .svc-send-btn { font-size: 0.85rem !important; padding: 0.6rem 1rem !important; }
}
@media (max-width: 480px) {
  section:has(.svc-contact-mount) {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .svc-contact-hero { margin-bottom: 0.6rem !important; }
  .svc-contact-title { font-size: clamp(1.1rem, 5vw, 1.5rem) !important; text-align: center !important; }
  .svc-contact-sub { font-size: 0.85rem !important; line-height: 1.45 !important; }
  .svc-contact-me-h { font-size: clamp(1.1rem, 5vw, 1.5rem) !important; text-align: center !important; }
  .contact-primary-tile { padding: 0.8rem 0.75rem !important; gap: 0.7rem !important; }
  .contact-primary-icon { width: 36px !important; height: 36px !important; border-radius: 8px !important; }
  .contact-primary-icon svg { width: 20px !important; height: 20px !important; }
  .contact-primary-body strong { font-size: 0.88rem !important; }
  .contact-primary-body small { font-size: 0.74rem !important; }
  .contact-channel { padding: 0.65rem 0.15rem !important; }
  .ch-ic { width: 38px !important; height: 38px !important; border-radius: 7px !important; }
  .ch-ic i { font-size: 1.2rem !important; }
  .ch-body strong { font-size: 0.88rem !important; }
  .ch-body small { font-size: 0.75rem !important; }
  .svc-send-box { padding: 0.7rem !important; }
  .svc-send-text { min-height: 64px !important; font-size: 0.84rem !important; }
}`;

  // ── Service data — EXACT copy of portfolio-main /about "What I offer" section
  var SERVICES = [
    { emoji:'🏢', title:'Custom ERPs & Fleet Systems', badge:'Shipped',
      descHtml:'Inventory, HR, finance, operations dashboards and full <strong>Custom ERPs</strong> tailored to your business workflows and scalable as you grow.' },
    { iconSrc:'/assets/service-mobile-icon.png', iconAlt:'Mobile Apps', title:'Mobile Apps with Flutter',
      desc:'Cross-platform Android & iOS apps with native performance, smooth UX, and clean architecture for long-term maintenance.' },
    { emoji:'🛒', title:'E-commerce Platforms',
      desc:'Full online stores with product management, cart, secure checkout, and M-Pesa or international payment gateway integration.' },
    { iconSrc:'/assets/service-website-icon.png', iconAlt:'Company Websites', title:'Organization & Company Websites',
      desc:'Corporate and brand websites with custom CMS, multi-page architecture, contact & lead-capture flows, and SEO-ready structure.' },
    { emoji:'👤', title:'Personal & Professional Websites',
      desc:'Portfolios, resumes, personal brand sites — modern, responsive, and tuned for the audiences that matter to you.' },
    { emoji:'💼', title:'Software Consultancy', badge:'Extra',
      desc:'Technology choice, architecture, stack decisions and digital strategy guidance to help you scale efficiently and avoid costly rework.' }
  ];

  // ── Package data — EXACT copy of portfolio-main /about "Ready-to-launch packages"
  var PACKAGES = [
    {
      thumb: '/assets/svc-website.webp',
      full: '/assets/website-package-full.png',
      imgAlt: 'DM Solution Tech — Website Package, 20% OFF',
      dataTitle: 'Website Package — 20% OFF',
      dataDesc: 'Need a Website? SEO + analytics + AI-ready structure + social/contact form + Medium auto-sync + 30+ gallery images.',
      eyebrow: 'Service · Website build',
      title: 'Need a Website? — 20% OFF',
      items: [
        'SEO optimization (ranks on Google)',
        'Analytics dashboard for performance tracking',
        'AI-ready structure for modern bots',
        'Social media + instant contact form (emails you)',
        'Automated Medium integration → blog updates',
        'Professional design 30+ gallery images'
      ],
      download: 'DM_Solution_Tech_Website_Package.png',
      waText: 'Hi%20Brian%2C%20I%27d%20like%20the%20Website%20Package.'
    },
    {
      thumb: '/assets/svc-ecommerce.webp',
      full: '/assets/ecommerce-package-full.png',
      imgAlt: 'DM Solution Tech — E-commerce Package',
      dataTitle: 'E-commerce Package — Launch Your Online Store',
      dataDesc: 'Launch your online store today. SEO, analytics, payments (M-Pesa/Stripe/PayPal), social/email integration, contact forms + messaging.',
      eyebrow: 'Service · E-commerce build',
      title: 'Launch Your Online Store Today',
      items: [
        'SEO-optimized for Google ranking',
        'Analytics dashboard for tracking performance',
        'Payment integrations (M-Pesa / Stripe / PayPal)',
        'Social media + email integration',
        'Contact forms + instant messaging setup',
        'Professional, mobile-friendly design'
      ],
      download: 'DM_Solution_Tech_Ecommerce_Package.png',
      waText: 'Hi%20Brian%2C%20I%27d%20like%20the%20E-commerce%20Package.'
    }
  ];

  // Rate card preview data — EXACT copy of portfolio-main /about
  var RATE_CARD = {
    src: '/assets/Rate-card.png',
    alt: 'Brian Kiboi - Web Design & Development Rate Card',
    download: 'Brian_Kiboi_Rate_Card.png'
  };

  function injectStyles() {
    if (document.getElementById('svc-styles')) return;
    var s = document.createElement('style');
    s.id = 'svc-styles'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  // Calendly popup widget — loaded on demand (only when the tile is clicked)
  // so its external CSS/JS never blocks the page.
  function ensureCalendly(cb) {
    if (window.Calendly) { cb(); return; }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    s.onload = function () { cb(); };
    document.head.appendChild(s);
  }

  function openCalendly() {
    ensureCalendly(function () {
      Calendly.initPopupWidget({ url: 'https://calendly.com/briankiboi83/30min' });
    });
  }

  window.__svcOpenCalendly = openCalendly;

  function injectCalendly() {
    // Auto-close the Calendly popup once a meeting is booked
    if (window.__svcCalendlyCloseWired) return;
    window.__svcCalendlyCloseWired = true;
    window.addEventListener('message', function (e) {
      if (e.data && typeof e.data.event === 'string' && e.data.event.indexOf('calendly.event_scheduled') === 0) {
        setTimeout(function () {
          if (window.Calendly && Calendly.closePopupWidget) Calendly.closePopupWidget();
        }, 2500);
      }
    });
  }

  // ── Section 1: "What I Offer" — exact clone of portfolio-main /about service cards
  function buildServicesSection() {
    var sec = document.createElement('section');
    sec.id = 'svc-deliver-section';

    var anchor = document.createElement('span');
    anchor.className = 'hash-span';
    anchor.id = 'services';
    var anchorTxt = document.createTextNode('\u00a0');
    anchor.appendChild(anchorTxt);
    sec.appendChild(anchor);

    var inner = document.createElement('div');
    inner.className = 'about-services-inner';

    var header = document.createElement('div');
    header.className = 'svc-standalone-head';

    var h2 = document.createElement('h2');
    h2.className = 'text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] text-center';
    h2.textContent = 'Services That I Offer';

    var sub = document.createElement('p');
    sub.className = 'svc-standalone-sub';
    sub.textContent = 'What I Offer';

    header.appendChild(h2);
    header.appendChild(sub);

    var grid = document.createElement('div');
    grid.className = 'services-grid';

    SERVICES.forEach(function(s) {
      // Exact same structure as portfolio-main /about .service-card
      var card = document.createElement('div');
      card.className = 'service-card';

      var icon = document.createElement('div');
      icon.className = 'service-icon';
      if (s.emoji) {
        icon.style.fontSize = '2rem';
        icon.textContent = s.emoji;
      } else {
        var img = document.createElement('img');
        img.src = s.iconSrc;
        img.alt = s.iconAlt;
        img.width = 36;
        img.height = 36;
        icon.appendChild(img);
      }

      var body = document.createElement('div');

      var title = document.createElement('div');
      title.className = 'service-title';
      title.textContent = s.title;
      if (s.badge) {
        var badge = document.createElement('span');
        badge.className = 'service-badge';
        badge.textContent = s.badge;
        title.appendChild(badge);
      }

      var desc = document.createElement('div');
      desc.className = 'service-desc';
      if (s.descHtml) {
        desc.innerHTML = s.descHtml;
      } else {
        desc.textContent = s.desc;
      }

      body.appendChild(title);
      body.appendChild(desc);
      card.appendChild(icon);
      card.appendChild(body);
      grid.appendChild(card);
    });

    inner.appendChild(header);
    inner.appendChild(grid);
    sec.appendChild(inner);
    return sec;
  }

  // ── Section 2: Ready-to-launch packages — EXACT clone of portfolio-main /about
  function buildPackagesSection() {
    var sec = document.createElement('section');
    sec.id = 'svc-packages-section';

    var inner = document.createElement('div');
    inner.style.maxWidth = '960px';
    inner.style.margin = '0 auto';

    var header = document.createElement('div');
    header.className = 'svc-standalone-head';

    var h2 = document.createElement('h2');
    h2.className = 'text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] text-center';
    h2.textContent = 'Grab a Ready-to-launch package';

    var sub = document.createElement('p');
    sub.className = 'svc-standalone-sub';
    sub.textContent = 'Choose your package and see what you get';

    header.appendChild(h2);
    header.appendChild(sub);
    header.appendChild(sub);

    var wrap = document.createElement('div');
    wrap.className = 'svc-packages';

    var grid = document.createElement('div');
    grid.className = 'svc-package-grid';

    PACKAGES.forEach(function(p) {
      var card = document.createElement('article');
      card.className = 'svc-package';

      var link = document.createElement('a');
      link.className = 'svc-package-img portfolio-item';
      link.href = p.full;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('data-title', p.dataTitle);
      link.setAttribute('data-desc', p.dataDesc);

      var img = document.createElement('img');
      img.src = p.thumb;
      img.alt = p.imgAlt;
      img.loading = 'lazy';
      link.appendChild(img);

      var body = document.createElement('div');
      body.className = 'svc-package-body';

      var brow = document.createElement('p');
      brow.className = 'svc-package-eyebrow'; brow.textContent = p.eyebrow;

      var h4 = document.createElement('h4');
      h4.textContent = p.title;

      var ul = document.createElement('ul');
      ul.className = 'svc-package-list';
      p.items.forEach(function(t) {
        var li = document.createElement('li');
        li.textContent = t;
        ul.appendChild(li);
      });

      var actions = document.createElement('div');
      actions.className = 'svc-package-actions';

      var dl = document.createElement('a');
      dl.className = 'svc-package-btn svc-package-btn-primary theme-btn cv-btn-download';
      dl.href = p.full;
      dl.setAttribute('download', p.download);
      dl.innerHTML = 'Download card <i class="fas fa-download" aria-hidden="true"></i>';

      var wa = document.createElement('a');
      wa.className = 'svc-package-btn svc-package-btn-ghost theme-btn cv-btn-download';
      wa.href = 'https://api.whatsapp.com/send?phone=254112401838&text=' + p.waText;
      wa.target = '_blank';
      wa.rel = 'noopener';
      wa.textContent = 'Get this package →';

      actions.appendChild(dl);
      actions.appendChild(wa);

      body.appendChild(brow);
      body.appendChild(h4);
      body.appendChild(ul);
      body.appendChild(actions);

      card.appendChild(link);
      card.appendChild(body);
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    inner.appendChild(header);
    inner.appendChild(wrap);
    sec.appendChild(inner);
    return sec;
  }

  // ── Section 3: Rate card preview — EXACT clone of portfolio-main /about
  function buildRateCardSection() {
    var sec = document.createElement('section');
    sec.id = 'svc-rate-section';

    var titleWrap = document.createElement('div');
    titleWrap.className = 'svc-standalone-head';

    var h2 = document.createElement('h2');
    h2.className = 'text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] text-center';
    h2.textContent = 'Rate Card';

    var sub = document.createElement('p');
    sub.className = 'svc-standalone-sub';
    sub.textContent = 'Know the cost upfront — no hidden fees.';

    titleWrap.appendChild(h2);
    titleWrap.appendChild(sub);

    var cv = document.createElement('section');
    cv.className = 'cv-preview';

    var head = document.createElement('header');
    head.className = 'cv-preview-head';

    var acts = document.createElement('div');
    acts.className = 'cv-preview-actions';

    var open = document.createElement('a');
    open.className = 'cv-preview-btn cv-preview-btn-ghost theme-btn cv-btn-download';
    open.href = RATE_CARD.src;
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = 'Open full size ↗';

    var dl = document.createElement('a');
    dl.className = 'cv-preview-btn cv-preview-btn-primary theme-btn cv-btn-download';
    dl.href = RATE_CARD.src;
    dl.setAttribute('download', RATE_CARD.download);
    dl.innerHTML = 'Download <i class="fas fa-download" aria-hidden="true"></i>';

    acts.appendChild(open);
    acts.appendChild(dl);

    head.appendChild(acts);

    var frame = document.createElement('div');
    frame.className = 'cv-preview-frame';

    var img = document.createElement('img');
    img.src = RATE_CARD.src;
    img.alt = RATE_CARD.alt;
    img.loading = 'lazy';

    frame.appendChild(img);

    cv.appendChild(head);
    cv.appendChild(frame);
    sec.appendChild(titleWrap);
    sec.appendChild(cv);
    return sec;
  }

  // ── Section 4: Accepted channels — EXACT clone of portfolio-main /about
  function buildPaymentSection() {
    var sec = document.createElement('section');
    sec.id = 'svc-payment-section';

    var wrap = document.createElement('div');
    wrap.className = 'svc-pay-methods-wrap';

    var methods = document.createElement('div');
    methods.className = 'svc-pay-methods';

    var label = document.createElement('p');
    label.className = 'svc-pay-methods-label';
    label.textContent = 'Accepted channels';

    var row = document.createElement('div');
    row.className = 'svc-pay-methods-row';
    row.appendChild(buildPayCard('mpesa'));
    row.appendChild(buildPayCard('paypal'));
    row.appendChild(buildPayCard('bank'));

    var note = document.createElement('p');
    note.className = 'svc-pay-note';
    note.textContent = '🔒 Processed securely';

    methods.appendChild(label);
    methods.appendChild(row);
    methods.appendChild(note);
    methods.appendChild(buildPaymentModal('mpesa'));
    methods.appendChild(buildPaymentModal('paypal'));
    wrap.appendChild(methods);
    sec.appendChild(wrap);
    return sec;
  }

  function buildPayCard(type) {
    var isModal = (type === 'mpesa' || type === 'paypal');
    var a = document.createElement(isModal ? 'button' : 'a');
    a.className = 'bento-tile svc-pay-card svc-pay-' + type;
    a.setAttribute('aria-label', (type === 'mpesa' ? 'M-Pesa' : type === 'paypal' ? 'PayPal' : 'Bank Transfer') + ' payment details');
    if (isModal) {
      a.type = 'button';
      a.setAttribute('data-modal-target', type + '-modal');
    } else {
      a.target = '_blank';
      a.rel = 'noopener';
      a.href = 'https://wa.me/254112401838?text=I%20would%20like%20to%20make%20a%20Bank%20Transfer%20payment.%20Please%20share%20the%20bank%20payment%20details.';
    }
    if (type === 'mpesa') {
      a.innerHTML =
        '<div class="svc-pay-logo">' +
          '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<rect width="200" height="80" rx="14" fill="#4CAF50" />' +
            '<text x="100" y="52" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#fff" letter-spacing="-1">M-PESA</text>' +
          '</svg>' +
        '</div>' +
        '<div class="svc-pay-meta">' +
          '<strong>M-Pesa</strong>' +
          '<small>Kenyan payment &middot; Tap for details <br> (other merchants also accepted)</small>' +
        '</div>';
    } else if (type === 'paypal') {
      a.innerHTML =
        '<div class="svc-pay-logo">' +
          '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<rect width="200" height="80" rx="14" fill="#fff" />' +
            '<text x="100" y="52" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif" font-size="32" font-weight="900" letter-spacing="-1">' +
              '<tspan fill="#003087">Pay</tspan><tspan fill="#009cde">Pal</tspan>' +
            '</text>' +
          '</svg>' +
        '</div>' +
        '<div class="svc-pay-meta">' +
          '<strong>PayPal</strong>' +
          '<small>International payment &middot; Tap for details <br> (other merchants also accepted)</small>' +
        '</div>';
    } else {
      a.innerHTML =
        '<div class="svc-pay-logo">' +
          '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<rect width="200" height="80" rx="14" fill="#1E5EFF" />' +
            '<text x="100" y="52" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#fff" letter-spacing="-1">BANK</text>' +
          '</svg>' +
        '</div>' +
        '<div class="svc-pay-meta">' +
          '<strong>Bank Transfer</strong>' +
          '<small>Direct bank payment &middot; Tap for details <br> (account details provided)</small>' +
        '</div>';
    }
    return a;
  }

  // Payment modals — EXACT .modal markup from portfolio-main /about
  function buildPaymentModal(type) {
    var div = document.createElement('div');
    div.className = 'modal';
    div.id = type + '-modal';
    if (type === 'mpesa') {
      div.innerHTML =
        '<div class="modal-content">' +
          '<span class="close-button" aria-label="Close">&times;</span>' +
          '<div class="modal-header">' +
            '<div class="modal-logo" aria-label="M-Pesa">' +
              '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
                '<rect width="200" height="80" rx="14" fill="#4CAF50" />' +
                '<text x="100" y="52" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#fff" letter-spacing="-1">M-PESA</text>' +
              '</svg>' +
            '</div>' +
            '<h3>M-Pesa Payment</h3>' +
          '</div>' +
          '<div class="modal-body">' +
            '<p>Please use the following details for M-Pesa payment:</p>' +
            '<div class="payment-details">' +
              '<p><strong>Pay to Phone Number:</strong> 0112401838</p>' +
              '<p><strong>Account Name:</strong> Brian Kiboi</p>' +
            '</div>' +
            '<p class="modal-footer">Thank you!</p>' +
          '</div>' +
        '</div>';
    } else {
      div.innerHTML =
        '<div class="modal-content">' +
          '<span class="close-button" aria-label="Close">&times;</span>' +
          '<div class="modal-header">' +
            '<div class="modal-logo" aria-label="PayPal">' +
              '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
                '<rect width="200" height="80" rx="14" fill="#fff" />' +
                '<text x="100" y="52" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif" font-size="32" font-weight="900" letter-spacing="-1">' +
                  '<tspan fill="#003087">Pay</tspan><tspan fill="#009cde">Pal</tspan>' +
                '</text>' +
              '</svg>' +
            '</div>' +
            '<h3>PayPal Payment</h3>' +
          '</div>' +
          '<div class="modal-body">' +
            '<p>Please use the following details for PayPal payment:</p>' +
            '<div class="payment-details">' +
              '<p><strong>PayPal Email:</strong> briankiboi92@gmail.com</p>' +
            '</div>' +
            '<p class="modal-footer">International payments are processed securely via PayPal.</p>' +
          '</div>' +
        '</div>';
    }
    return div;
  }

  // Open/close payment modals — same behavior as portfolio-main script.js
  function wirePaymentModals(scope) {
    if (!scope || !scope.addEventListener) return;
    scope.addEventListener('click', function (e) {
      var t = e.target;
      var trig = t && t.closest ? t.closest('[data-modal-target]') : null;
      if (trig) {
        e.preventDefault();
        var modal = document.getElementById(trig.getAttribute('data-modal-target'));
        if (modal) modal.style.display = 'block';
        return;
      }
      var closeBtn = t && t.closest ? t.closest('.close-button') : null;
      if (closeBtn) {
        var host = closeBtn.closest('.modal');
        if (host) host.style.display = 'none';
        return;
      }
      if (t && t.classList && t.classList.contains('modal')) {
        t.style.display = 'none';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        var open = scope.querySelectorAll('.modal');
        for (var i = 0; i < open.length; i++) {
          if (open[i].style.display === 'block') open[i].style.display = 'none';
        }
      }
    });
  }

  // ── Section 5: Final CTA — EXACT clone of portfolio-main /about
  function buildCTASection() {
    var sec = document.createElement('section');
    sec.id = 'svc-cta-section';

    var cta = document.createElement('section');
    cta.className = 'about-cta';

    var head = document.createElement('header');
    head.className = 'about-cta-head';
    head.innerHTML =
      '<span class="about-cta-status"><span class="about-cta-status-dot"></span> Available now</span>' +
      '<h3 class="about-cta-h">Ready to start your project?</h3>' +
      '<p class="about-cta-p">Ready to take your idea further?<br>Book a free <strong>consultation</strong> and let&rsquo;s map out the next step.</p>';

    var tiles = document.createElement('div');
    tiles.className = 'about-cta-tiles';
    tiles.appendChild(buildCtaTile('wa'));
    tiles.appendChild(buildCtaTile('cal'));
    tiles.appendChild(buildCtaTile('mail'));

    cta.appendChild(head);
    cta.appendChild(tiles);
    sec.appendChild(cta);
    return sec;
  }

  function buildCtaTile(type) {
    var a = document.createElement('a');
    a.className = 'about-cta-tile about-cta-tile-' + type;
    a.target = '_blank';
    a.rel = 'noopener';
    if (type === 'wa') {
      a.href = 'https://api.whatsapp.com/send?phone=254112401838&text=Hello%20Brian,%20I%27d%20like%20to%20schedule%20a%20consultation%20with%20DM%20Solution%20Tech.';
      a.innerHTML =
        '<div class="about-cta-tile-icon"><img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="" width="28" height="28"></div>' +
        '<div class="about-cta-tile-body"><strong>Schedule on WhatsApp</strong><small>Get instant replies <br><br> powered by WhatsApp</small></div>' +
        '<span class="about-cta-tile-arrow">→</span>';
    } else if (type === 'cal') {
      a.href = '#';
      a.setAttribute('onclick', "window.__svcOpenCalendly && window.__svcOpenCalendly(); return false;");
      a.innerHTML =
        '<div class="about-cta-tile-icon"><img src="https://cdn.simpleicons.org/calendly/ffffff" alt="" width="28" height="28"></div>' +
        '<div class="about-cta-tile-body"><strong>Book a 30-min meeting</strong><small>Quick intro meeting <br><br> powered by Calendly</small></div>' +
        '<span class="about-cta-tile-arrow">→</span>';
    } else {
      a.href = 'mailto:briankiboi83@gmail.com?subject=Project%20inquiry';
      a.innerHTML =
        '<div class="about-cta-tile-icon"><img src="https://cdn.simpleicons.org/gmail/ffffff" alt="" width="28" height="28"></div>' +
        '<div class="about-cta-tile-body"><strong>Email me directly</strong><small>Detailed brief mail <br><br> powered by Gmail</small></div>' +
        '<span class="about-cta-tile-arrow">→</span>';
    }
    return a;
  }

  // Remove the native contact form fields (Your Name / email / Message / Send)
  // and keep the "Get in touch — Contact." container for later use.
  var CONTACT_WA_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var CONTACT_CAL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M19.655 14.262c.281 0 .557.023.828.064 0 .005-.005.01-.005.014-.105.267-.234.534-.381.786l-1.219 2.106c-1.112 1.936-3.177 3.127-5.411 3.127h-2.432c-2.23 0-4.294-1.191-5.412-3.127l-1.218-2.106a6.251 6.251 0 0 1 0-6.252l1.218-2.106C6.736 4.832 8.8 3.641 11.035 3.641h2.432c2.23 0 4.294 1.191 5.411 3.127l1.219 2.106c.147.252.271.519.381.786 0 .004.005.009.005.014-.267.041-.543.064-.828.064-1.816 0-2.501-.607-3.291-1.306-.764-.676-1.711-1.517-3.44-1.517h-1.029c-1.251 0-2.387.455-3.2 1.278-.796.805-1.233 1.904-1.233 3.099v1.411c0 1.196.437 2.295 1.233 3.099.813.823 1.949 1.278 3.2 1.278h1.034c1.729 0 2.676-.841 3.439-1.517.791-.703 1.471-1.306 3.287-1.301Zm.005-3.237c.399 0 .794-.036 1.179-.11-.002-.004-.002-.01-.002-.014-.073-.414-.193-.823-.349-1.218.731-.12 1.407-.396 1.986-.819 0-.004-.005-.013-.005-.018-.331-1.085-.832-2.101-1.489-3.03-.649-.915-1.435-1.719-2.331-2.395-1.867-1.398-4.088-2.138-6.428-2.138-1.448 0-2.855.28-4.175.841-1.273.543-2.423 1.315-3.407 2.299S2.878 6.552 2.341 7.83c-.557 1.324-.842 2.726-.842 4.175 0 1.448.281 2.855.842 4.174.542 1.274 1.314 2.423 2.298 3.407s2.129 1.761 3.407 2.299c1.324.556 2.727.841 4.175.841 2.34 0 4.561-.74 6.428-2.137a10.815 10.815 0 0 0 2.331-2.396c.652-.929 1.158-1.949 1.489-3.03 0-.004.005-.014.005-.018-.579-.423-1.255-.699-1.986-.819.161-.395.276-.804.349-1.218.005-.009.005-.014.005-.023.869.166 1.692.506 2.404 1.035.685.505.552 1.075.446 1.416C22.184 20.437 17.619 24 12.221 24c-6.625 0-12-5.375-12-12s5.37-12 12-12c5.398 0 9.963 3.563 11.471 8.464.106.341.239.915-.446 1.421-.717.529-1.535.873-2.404 1.034.128.716.128 1.45 0 2.166-.387-.074-.782-.11-1.182-.11-4.184 0-3.968 2.823-6.736 2.823h-1.029c-1.899 0-3.15-1.357-3.15-3.095v-1.411c0-1.738 1.251-3.094 3.15-3.094h1.034c2.768 0 2.552 2.823 6.731 2.827Z"/></svg>';
  var CONTACT_ICONS = {
    call: ['fas', 'fa-phone'],
    mail: ['fas', 'fa-envelope'],
    linkedin: ['fab', 'fa-linkedin-in'],
    github: ['fab', 'fa-github'],
    medium: ['fab', 'fa-medium'],
    stack: ['fab', 'fa-stack-overflow'],
    whatsapp: ['fab', 'fa-whatsapp']
  };
  var CONTACT_CHANNELS = [
    { cls: 'ch-call', href: 'tel:+254112401838', icon: 'call', name: 'Call', val: '+254 112 401 838' },
    { cls: 'ch-mail', href: 'mailto:briankiboi83@gmail.com?subject=Project%20inquiry', icon: 'mail', name: 'Email', val: 'briankiboi83@gmail.com' },
    { cls: 'ch-linkedin', href: 'https://www.linkedin.com/in/brian-kiboi-21aa02277/', icon: 'linkedin', name: 'LinkedIn', val: 'brian-kiboi-21aa02277/' },
    { cls: 'ch-github', href: 'https://github.com/Briankiboi', icon: 'github', name: 'GitHub', val: '@Briankiboi' },
    { cls: 'ch-medium', href: 'https://briankiboi32.medium.com', icon: 'medium', name: 'Medium', val: '@briankiboi32' },
    { cls: 'ch-stack', href: 'https://stackoverflow.com/users/29328163/brian-kiboi', icon: 'stack', name: 'Stack Overflow', val: 'user:29328163' }
  ];

  // Fill the native "Get in touch / Contact." card with the reference
  // contact content (keeps the card container untouched).
  function fillNativeContactCard() {
    var retry = 0;
    function poll() {
      var heads = document.querySelectorAll('h3');
      var h = null;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].textContent && heads[i].textContent.trim() === 'Contact.') { h = heads[i]; break; }
      }
      if (!h) { if (++retry < 60) setTimeout(poll, 500); return; }
      var container = h.parentNode;
      build(container);
      if (window.MutationObserver) {
        var mo = new MutationObserver(function () {
          if (container.querySelector('form') || !container.classList.contains('svc-contact-mount')) build(container);
        });
        mo.observe(container, { childList: true });
      }
    }
    function build(container) {
      container.classList.add('svc-contact-mount');
      var form = container.querySelector('form');
      if (form) form.parentNode.removeChild(form);
      while (container.firstChild) container.removeChild(container.firstChild);
      if (!document.getElementById('svc-contact-me-title')) {
        var t = document.createElement('div');
        t.id = 'svc-contact-me-title';
        t.innerHTML = '<h2 class="svc-contact-me-h text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] text-center">Contact me</h2>';
        var section = container.parentNode;
        while (section && section.tagName !== 'SECTION') section = section.parentNode;
        if (section) section.parentNode.insertBefore(t, section);
        else container.parentNode.insertBefore(t, container);
      }
      var hero = document.createElement('div');
      hero.className = 'svc-contact-hero';
      hero.innerHTML =
        '<h2 class="svc-contact-title text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] text-center">Get in touch</h2>' +
        '<p class="svc-contact-sub">Let&rsquo;s connect.<br><strong>Building</strong> a product or <strong>hiring an engineer</strong>?</p>';
      container.appendChild(hero);
      var mount = document.createElement('div');
      mount.className = 'svc-contact-mount-content';
      var tiles = document.createElement('div');
      tiles.className = 'contact-primary-tiles';
      tiles.innerHTML =
        '<a class="contact-primary-tile contact-primary-wa" href="https://api.whatsapp.com/send?phone=254112401838" target="_blank" rel="noopener">' +
        '<div class="contact-primary-icon">' + CONTACT_WA_SVG + '</div>' +
        '<div class="contact-primary-body"><strong>Message on WhatsApp</strong><small>Instant replies &middot; powered by WhatsApp</small></div>' +
        '<span class="contact-primary-arrow">&rarr;</span></a>' +
        '<a class="contact-primary-tile contact-primary-cal" href="#" onclick="window.__svcOpenCalendly && window.__svcOpenCalendly(); return false;">' +
        '<div class="contact-primary-icon">' + CONTACT_CAL_SVG + '</div>' +
        '<div class="contact-primary-body"><strong>Book a 30-min meeting</strong><small>Quick intro &middot; powered by Calendly</small></div>' +
        '<span class="contact-primary-arrow">&rarr;</span></a>';
      mount.appendChild(tiles);
      var grid = document.createElement('div');
      grid.className = 'contact-grid';
      CONTACT_CHANNELS.forEach(function (c) {
        var a = document.createElement('a');
        a.className = 'contact-channel ' + c.cls;
        a.href = c.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = '<span class="ch-ic" aria-hidden="true"><i class="' + CONTACT_ICONS[c.icon].join(' ') + '"></i></span>' +
          '<div class="ch-body"><strong>' + c.name + '</strong><small>' + c.val + '</small></div>';
        grid.appendChild(a);
      });
      mount.appendChild(grid);
      var sendBox = document.createElement('div');
      sendBox.className = 'svc-send-box';
      sendBox.innerHTML =
        '<div class="svc-send-head"><i class="fas fa-paper-plane" aria-hidden="true"></i><strong>Send me a message</strong></div>' +
        '<textarea class="svc-send-text" rows="3" placeholder="Write your message here..."></textarea>' +
        '<button type="button" class="svc-send-btn">Send Message <i class="fas fa-paper-plane" aria-hidden="true"></i></button>';
      mount.appendChild(sendBox);
      container.appendChild(mount);
      var ta = sendBox.querySelector('.svc-send-text');
      var btn = sendBox.querySelector('.svc-send-btn');
      function sendMessage() {
        var msg = (ta.value || '').trim();
        if (!msg) { ta.focus(); return; }
        window.open('https://api.whatsapp.com/send?phone=254112401838&text=' + encodeURIComponent(msg), '_blank');
        ta.value = '';
      }
      btn.addEventListener('click', sendMessage);
      ta.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); sendMessage(); }
      });
    }
    poll();
  }

    function tryInsert() {
    var testimonials = document.querySelector('.feedbacks-wrap');
    if (!testimonials) { setTimeout(tryInsert, 500); return; }
    if (document.getElementById('svc-deliver-section')) return;

    injectStyles();
    injectCalendly();
    var parent = testimonials.parentNode;
    var anchor = testimonials.nextSibling;

    var s1 = buildServicesSection();
    var s2 = buildPackagesSection();
    var s3 = buildRateCardSection();
    var s4 = buildPaymentSection();
    var s5 = buildCTASection();

    parent.insertBefore(s1, anchor);
    parent.insertBefore(s2, s1.nextSibling);
    parent.insertBefore(s3, s2.nextSibling);
    parent.insertBefore(s4, s3.nextSibling);
    parent.insertBefore(s5, s4.nextSibling);

    wirePaymentModals(s4);
    fillNativeContactCard();
  }

  setTimeout(tryInsert, 800);
})();
