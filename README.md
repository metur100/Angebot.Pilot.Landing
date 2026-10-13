# AngebotPilot – Website

Marketing and legal website for **AngebotPilot**, a German B2B SaaS for quotations (Angebote), customer
management, follow-up reminders and simple job tracking. Plain static HTML/CSS with vanilla JS (no framework, no build step,
no third-party requests), hosted on GitHub Pages. Languages: German (root, legally binding) and English (`/en/`,
convenience translation). Light and dark theme.

- Live: https://metur100.github.io/Angebot.Pilot.Landing/
- Web app: https://metur100.github.io/Angebot.Pilot.App/ (`#/registrieren`, `#/login`)
- API: https://angebotpilot.runasp.net

By Medin Turkes · Certi Development.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Landing page (animated hero, trades marquee, statement, pinned product story, feature bento, mobile, security, pricing, FAQ, final CTA) |
| `impressum.html` | Legal notice per § 5 DDG |
| `datenschutz.html` | Privacy policy (website, web app, mobile apps) |
| `agb.html` | Terms (B2B only, § 14 BGB) |
| `avv.html` | Data processing agreement template (Art. 28 GDPR) |
| `konto-loeschen.html` | Account & data deletion – use this URL in Google Play / App Store Connect |
| `support.html` | Help & contact – use as support URL |
| `barrierefreiheit.html` | Accessibility statement (draft) |
| `404.html` | Not-found page, bilingual (uses absolute `/Angebot.Pilot.Landing/` paths, as GitHub Pages serves it for any URL) |

English pages in `en/` mirror every German page and use the shared assets via `../assets/…`:

| German | English |
| --- | --- |
| `index.html` | `en/index.html` |
| `impressum.html` | `en/imprint.html` |
| `datenschutz.html` | `en/privacy.html` |
| `agb.html` | `en/terms.html` |
| `avv.html` | `en/dpa.html` |
| `konto-loeschen.html` | `en/delete-account.html` (English account-deletion URL for the app stores) |
| `support.html` | `en/support.html` |
| `barrierefreiheit.html` | `en/accessibility.html` |

English legal pages open with a "Convenience translation" notice linking to the German original, which alone is
legally binding. Placeholders read `[PLACEHOLDER: …]` there. Section ids are English slugs (`#how-it-works`,
`#features`, `#security`, `#pricing`, `#faq` on the landing page), so DE and EN anchors differ.

Also: `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico`, `.nojekyll`.

## Editing

- Every page is complete HTML – there is no build step. **Header and footer are repeated in every page** between
  `<!--HEADER-->…<!--/HEADER-->` and `<!--FOOTER-->…<!--/FOOTER-->` markers. `index.html` is the source of truth
  for the German pages, `en/index.html` for the English ones; when you change navigation or footer links, copy the
  marked blocks into the seven legal pages of that language (`404.html` has its own minimal header with absolute
  paths). After copying, fix two things per page: the **language switch** (`.lang-switch` in the header) links to
  the page itself and to its counterpart (e.g. `agb.html` ↔ `en/terms.html`, `aria-current="true"` on the current
  language), and legal pages set `aria-current="page"` on their own footer link.
- **Keeping DE and EN in sync:** every content change goes into both files of a pair (table above). Each page carries
  `<link rel="alternate" hreflang="de|en|x-default">` (x-default = German) and `og:locale` (`de_DE` / `en_GB`,
  British English). When a German legal text changes, update the English translation and its "Last updated" date
  too. Add new pages to both languages and to `sitemap.xml` (with `xhtml:link` alternates).
- **Theme:** light/dark via `<html data-theme="light|dark">`, set before first paint by the inline head script
  (identical on every page – copy it when adding pages). The preference `system | light | dark` comes from
  localStorage `ap.theme` (default `system` = `prefers-color-scheme`); the header button
  (`[data-theme-toggle]`) cycles system → light → dark. Dark values live in one `@media screen` block near the end
  of `site.css` (`:root[data-theme="dark"]` redefines the ink/paper/line tokens plus the semantic tokens
  `--surface`, `--accent`, `--accent-strong`, `--tint`, `--tint-line`, `--ok-text`, `--header-glass`), followed
  by a few component overrides. Use the semantic tokens instead of `#fff` / `--brand-600` for new components on
  paper sections. The night sections are dark in both themes; the hero illustration stays light. Print is always
  light. `assets/logo-dark.svg` is the logo with light text for dark backgrounds.
- **localStorage (no cookies, no tracking):** only two preferences, shared with the web app on the same origin and
  written only when the visitor actively chooses: `ap.theme` (theme button) and `ap.locale` = `de|en` (language
  switch, and on any click into the web app from a page in that language, so the app opens in the same language).
  The privacy policy (§ 4, both languages) mentions this.
- Styles: `assets/site.css` – design tokens at the top (night/brand/cyan/violet palette, `--display` and `--serif`
  fonts), then one block per landing section, then the legal-page layout (`.page-doc`, `.page-head`, `.doc-layout`,
  `.toc`, `.doc`), responsive rules (1100 px nav, 1080/960/640 px layout) and `prefers-reduced-motion`/print rules.
- Script: `assets/site.js` – one `requestAnimationFrame` scroll loop that writes CSS variables (`--scroll`, `--hp`
  hero, `--sp` story, `--fp` final, `--pp` parallax); IntersectionObserver reveals (`data-reveal`,
  `data-stagger`); header glass/dark switching over `[data-dark]` sections; mobile menu; the hero scene player
  (timed class sequence, paused off-screen and in hidden tabs, pointer tilt only on fine pointers); the pinned
  story (desktop ≥ 960 px only); the VAT calculator (integer cents, half-away-from-zero rounding like the product);
  FAQ accordion; legal-page TOC highlighting; theme toggle, `theme-color` updates and the language preference. Texts and number
  formats follow `<html lang>` (`de-DE` / `en-GB`, e.g. "1.557,60 €" vs "€1,557.60"); accent words of the statement
  come from `data-words="word|word"`. No cookies, no tracking; localStorage only for the two preferences below.
- Motion: everything respects `prefers-reduced-motion` (the inline head script adds `.reduced-motion`, which
  disables the scene loop, pinning and parallax and shows final states).
- Icons: `assets/icons.svg` (SVG sprite, still used by the `.notice` boxes on the legal pages).
- Fonts (`assets/fonts/`, subset WOFF2, SIL Open Font License 1.1): Inter (body), Inter Display (headings) –
  `OFL-Inter-LICENSE.txt`; Instrument Serif Italic (accent words) – `OFL-InstrumentSerif-LICENSE.txt`. The Impressum
  names both licenses.
- Screenshots (shared by both languages; they show the German app UI): `assets/shots/` holds real screenshots of the web app (`web-quotation-pdf-880.webp`)
  and the Android app (`android-*-560.webp`), taken from the running product with demo data. The "So funktioniert's"
  section has six steps (quotation → PDF → follow-ups → online acceptance → dashboard → invoice). On desktop the
  browser frame shows whole app screens, `story-screen-*.webp` (captured at 1180×738 px, 1280×800 px for the editor,
  at 2× pixel density, stored 1840 px wide). On phones the step cards show `story-mobile-*.webp`, focused crops from
  the app's own 400 px layout. Replace them when the UI changes; keep file names so the markup stays valid.
- Images: `assets/icon.svg`, `assets/logo.svg` (brand), generated `favicon-*.png`, `icon-512.png`,
  `icon-maskable-512.png`, `apple-touch-icon.png`, `og-image.png` (1200×630).
- Legal pages start with an HTML comment listing what must be reviewed (English pages: short English summary). Visible placeholders are marked up as
  `<mark class="ph">[PLATZHALTER: …]</mark>` (orange, dashed). Search for `class="ph"` to find them all.
- When content changes, update `Stand:` / "Last updated" dates on the legal pages (both languages) and `<lastmod>`
  in `sitemap.xml`.

## Local preview

```sh
npx -y http-server -p 8090
# open http://localhost:8090/ and http://localhost:8090/en/
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

**English version**
- English legal pages are convenience translations – have them checked together with the German texts; keep both in sync.
- English UI labels in menu paths (e.g. *Settings → My account → Delete account*) are written ahead of the app's English
  UI, with the German labels in brackets – align them with the final English app texts.
