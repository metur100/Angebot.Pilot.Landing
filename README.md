# AngebotPilot – Website

Marketing and legal website for **AngebotPilot**, a German B2B SaaS for quotations (Angebote), customer
management, follow-up reminders and simple job tracking. Plain static HTML/CSS with a few lines of vanilla JS,
hosted on GitHub Pages. Language: German.

- Live: https://metur100.github.io/Angebot.Pilot.Landing/
- Web app: https://metur100.github.io/Angebot.Pilot.App/ (`#/register`, `#/login`)
- API: https://angebotpilot.runasp.net

By Medin Turkes · Certi Development.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Landing page (hero, target groups, features, flow, steps, privacy, pricing, FAQ) |
| `impressum.html` | Legal notice per § 5 DDG |
| `datenschutz.html` | Privacy policy (website, web app, mobile apps) |
| `agb.html` | Terms (B2B only, § 14 BGB) |
| `avv.html` | Data processing agreement template (Art. 28 GDPR) |
| `konto-loeschen.html` | Account & data deletion – use this URL in Google Play / App Store Connect |
| `support.html` | Help & contact – use as support URL |
| `barrierefreiheit.html` | Accessibility statement (draft) |
| `404.html` | Not-found page (uses absolute `/Angebot.Pilot.Landing/` paths, as GitHub Pages serves it for any URL) |

Also: `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico`, `.nojekyll`.

## Editing

- Every page is complete HTML – there is no build step. **Header and footer are repeated in every page**;
  when you change navigation or footer links, change them in all nine files.
- Styles: `assets/style.css` (brand tokens mirror `packages/brand/tokens.css` of the app repo).
- Icons: `assets/icons.svg` (SVG sprite, used as `<svg><use href="assets/icons.svg#i-check"/></svg>`).
- Script: `assets/main.js` – only the mobile menu toggle. No cookies, no storage, no tracking.
- Fonts: Inter (subset to Latin, WOFF2) in `assets/fonts/`, SIL Open Font License 1.1 (`OFL-Inter-LICENSE.txt`).
  The site loads nothing from third parties.
- Images: `assets/icon.svg`, `assets/logo.svg` (brand), generated `favicon-*.png`, `icon-512.png`,
  `icon-maskable-512.png`, `apple-touch-icon.png`, `og-image.png` (1200×630).
- Screenshots: the section marked `<!-- SCREENSHOTS: filled by lead with real screenshots -->` in `index.html`
  currently shows a schematic flow. Replace it with real app screenshots once available.
- Legal pages start with an HTML comment listing what must be reviewed. Visible placeholders are marked up as
  `<mark class="ph">[PLATZHALTER: …]</mark>` (orange, dashed). Search for `class="ph"` to find them all.
- When content changes, update `Stand:` dates on the legal pages and `<lastmod>` in `sitemap.xml`.

## Local preview

```sh
npx -y http-server -p 8090
# open http://localhost:8090/
```

(The 404 page uses absolute paths and only looks right under `/Angebot.Pilot.Landing/`.)

## Deployment (GitHub Pages)

1. Push to `main` of the public repo `metur100/Angebot.Pilot.Landing`.
2. Repo → *Settings* → *Pages* → *Build and deployment*: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. After a minute the site is live at https://metur100.github.io/Angebot.Pilot.Landing/.
4. Optional: Google Search Console → URL-prefix property → submit `sitemap.xml`
   (`robots.txt` only takes effect at a domain root, so it is ignored on a project page).

## Before launch – placeholders and legal review

All of these are visible on the pages (orange markers) and/or listed in HTML comments at the top of each file.

**Owner data**
- Postal address (Straße, Hausnummer, PLZ, Ort) – Impressum, Datenschutz, AGB § 1, AVV.
- Phone number (second contact channel, § 5 DDG) – Impressum.
- USt-IdNr. (or remove the line) – Impressum.
- Legal form / addition to "Certi Development"; register court + number (or remove section) – Impressum.
- Verbraucherstreitbeilegung (§ 36 VSBG) wording – confirm. The EU ODR platform was shut down on 20.07.2025; there is deliberately no link.
- Place of jurisdiction (Gerichtsstand) – AGB § 15.

**Service providers (Datenschutz § 9, AVV Anlage 2)**
- MonsterASP.NET: full company name, address, server location; sign a DPA (AVV) with them; server-log retention; backup interval and retention.
- E-mail delivery provider: choose and fill in (name, seat, third-country transfer, DPA); disable open/click tracking.
- Cloudflare R2: keep only if object storage is enabled; fill in storage location.
- Support mailbox on Gmail (Google): confirm, or switch to a business mailbox with a DPA.
- Payment provider and payment terms – once online payment is enabled (Datenschutz 5.9, AGB § 5, § 12).
- Push notifications or new app permissions – add to Datenschutz § 7 if introduced.

**Retention and deadlines**
- Retention of e-mail delivery logs; deletion period after contract end (AGB § 13, AVV § 10); notice period for new sub-processors (AVV § 6).

**Legal review (recommended for all legal texts)**
- Datenschutz: DPO requirement (§ 38 BDSG); match against the production configuration.
- AGB: liability (§ 11), term/termination (§ 12), amendments (§ 14), how AGB and AVV are accepted at registration.
- AVV: whole template ("Muster – vor Verwendung rechtlich prüfen lassen"); signature/acceptance mechanism.
- Barrierefreiheit: whether the BFSG applies (B2B; micro-enterprise exemption); add manual screen-reader test results.
- Konto löschen: confirm menu paths in the final web and mobile apps (*Einstellungen → Konto → Konto löschen*,
  *Mehr → Profil → Konto löschen*).
