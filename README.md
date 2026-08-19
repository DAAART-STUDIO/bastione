# BASTIONE — Lounge & Restaurant

Premium editorial website for **Bastione Lounge & Restaurant** in Riva del Garda, Trentino, Italy.

The project combines cinematic Lake Garda photography, editorial typography, subtle motion and a minimal contemporary Italian hospitality aesthetic.

## Project

**Website:** Bastione Lounge & Restaurant  
**Location:** Riva del Garda · Trentino · Italy  
**Repository:** https://github.com/DAAART-STUDIO/bastione

The website is designed as a cinematic digital experience rather than a conventional restaurant landing page.

Core visual principles:

- Contemporary Italian hospitality
- Editorial / architectural design
- Cinematic photography
- Strong serif typography
- Minimal interface
- Generous whitespace
- Restrained motion
- High visual hierarchy
- Responsive desktop and mobile compositions

---

## Tech Stack

The project intentionally uses a lightweight static architecture.

- HTML5
- CSS3
- Vanilla JavaScript
- JavaScript ES Modules
- JSON
- SVG
- WebP
- CSS Custom Properties
- Responsive CSS
- GSAP / ScrollTrigger where required for cinematic interactions

There is currently **no frontend framework and no required build step**.

No React, Vue or Tailwind is used.

---

## Local Development

Do not open `index.html` directly with `file://`.

The project uses JavaScript ES modules, so it must be served through HTTP.

### Python

```bash
cd Bastione
python -m http.server 8000