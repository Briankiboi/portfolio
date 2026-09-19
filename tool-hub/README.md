# Free Tools Hub

**15 free tools that run 100% in your browser.** No servers, no sign-ups, no trackers — your data never leaves your device.

Every page is a self-contained HTML tool with its own clear **How it works / Privacy / Tips** notes, a shared sticky header, and a consistent card-based UI. Open the folder in a browser and every tool works offline.


---

## ✨ Features

- **Truly client-side** — all logic runs in your browser; nothing is uploaded, saved, or tracked.
- **Works offline** — open over `file://` or serve the folder locally; most tools need nothing else.
- **Clean, consistent UI** — unified design system (`assets/css/tool.css`), sticky brand header with portfolio tabs.
- **Explainable** — every tool documents exactly how it works, what it sends, and what's stored.
- **No frameworks required** for most tools — vanilla JS; a few use Alpine.js or local CDN libs.

## 🧰 The 15 Tools

### Domain & Network
| Tool | What it does |
| --- | --- |
| [Domain Age Checker](tools/domain-age-checker.html) | Registry creation date + live DNS records via RDAP & Google Public DNS |
| [WHOIS Lookup](tools/whois-lookup.html) | Modern WHOIS via public RDAP (rdap.org, Verisign fallback) |
| [DNS Lookup](tools/dns-lookup.html) | A / AAAA / CNAME / MX / NS / TXT / SOA / ANY via Google DoH |
| [IP Geolocation & Map Finder](tools/ip-geolocation.html) | IP/domain → location with map pin + precise device GPS |
| [Ping Test](tools/ping-test.html) | HTTP round-trip, min/avg/max/jitter, packet loss & verdict |
| [URL Shortener](tools/url-shortener.html) | Local short links (`?go=code`) stored in browser history |

### SEO & Analysis
| Tool | What it does |
| --- | --- |
| [Website Auditor](tools/website-auditor.html) | 16 weighted on-page checks, score /100, grade & fix-it tips |
| [SEO Validation](tools/seo-validation.html) | Pass/Warn/Fail checks for title, meta, OG, JSON-LD, schema, alt… |
| [Broken Link Checker](tools/broken-link-checker.html) | Crawl links in any page, classify Working/Redirect/Broken/Blocked |

### Business & Everyday
| Tool | What it does |
| --- | --- |
| [Currency Converter](tools/currency-converter.html) | 40+ currencies, live daily rates, offline cache & swap |
| [Document Converter](tools/document-converter.html) | DOCX→PDF, fully on-device (mammoth + html2pdf), drag & drop |
| [QR Code Generator](tools/qr-generator.html) | Text/URL/phone into PNG or SVG, colors + error correction |
| [QR & Barcode Scanner](tools/qr-scanner.html) | Decode from camera or image, fully on-device |
| [Business Name Generator](tools/business-name-generator.html) | Industry + style combos with saved favorites |
| [Receipt Generator](tools/receipt-generator.html) | Printable receipts with logo, tax, PDF download |
| [Quotation Generator](tools/quotation-generator.html) | Professional quotes with discount, tax & PDF download |

> Note: the few tools that need live data (exchange rates, whois, DNS, geolocation, fetched pages) call only public APIs from your browser. When cross-origin reads are blocked by CORS, they transparently fall back to a public relay or to pasting raw HTML — see each tool's Privacy note.

## 🚀 Run locally

```bash
# quickest — browse without a server (file:// works for most tools)
./start.sh            # or: python3 -m http.server 8080

# then open
#   http://localhost:8080/
```

`start.sh` auto-detects `python3` (preferred) or `php`. Camera, precise geolocation and live cross-origin page fetching work best (or only) over `http://localhost`.

## 🔒 Privacy

- No backend. No accounts. No cookies, analytics, or tracking.
- Local data (favorites, short-link history, cached rates) lives only in your browser's `localStorage`.
- Each tool states exactly what it sends and where — most tools send nothing at all.

## 🛠 Tech

- Vanilla HTML/CSS/JS + a shared design system (`app.css`, `tool.css`, `hub.css`)
- Alpine.js (Alpine CDN) for the generator/form tools
- Small local libs: `qrcode.min.js`, `html5-qrcode.min.js`, `JsBarcode`, `jsPDF` (`assets/vendor/`)
- No build step — static files, deploy anywhere

## 📁 Structure

```
tools-local/
├── index.html            # hub homepage (search + category filters)
├── start.sh              # one-command local server
├── assets/
│   ├── css/              # hub.css · tool.css · app.css
│   ├── js/               # catalog.js (tool registry) · app.js (shared helpers)
│   └── vendor/           # local third-party libraries
└── tools/                # 15 self-contained tool pages
```

## 👤 Author

Built by [Brian Kiboi](https://briankiboi.is-a.dev) — DM Solution Technologies.
Contact · Rate Card · Projects · My Services via the portfolio nav in the header.

## 📄 License

Private use / open for reference. Ask before redistributing or reselling.