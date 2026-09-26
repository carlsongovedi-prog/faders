# PULSE — Concert & Event Website

A responsive, static, three-page website for a concert/events business:
**Home**, **Gallery / Portfolio**, and **Contact**. Built with plain HTML,
CSS, and JavaScript only — no frameworks, no build step, no dependencies
to install.

## Folder structure

```
pulse-events/
├── index.html        Home — hero, upcoming events, about/stats
├── gallery.html       Gallery/Portfolio — filterable photo grid + lightbox
├── contact.html        Contact — validated form, venue info, socials
├── css/
│   └── styles.css      All styling (single stylesheet, mobile-first)
├── js/
│   └── script.js       Nav toggle, gallery filter/lightbox, form validation
└── README.md           This file
```

## Running it locally

No build tools needed. Either:

1. **Double-click `index.html`** to open it in a browser, or
2. Serve it locally (recommended, avoids some browser file:// restrictions):
   ```bash
   cd pulse-events
   python3 -m http.server 8000
   # then open http://localhost:8000
   ```

## Responsive design

The layout is mobile-first and tested down to small phone widths:
- Flexible grid/flexbox layouts that stack on narrow screens
- A collapsible hamburger menu below 760px
- The gallery grid reflows from 4 → 3 → 2 columns as the screen shrinks
- Touch-friendly tap targets (buttons and links are sized for fingers, not just cursors)
- `viewport-fit=cover` and safe-area-aware spacing so it sits well on phones with notches

Test it by resizing your browser window or using your browser's device
toolbar (usually `F12` → the phone/tablet icon).

## Editing content

- **Events (Home page):** each event is a `<article class="ticket">` block
  in `index.html`. Copy one and edit the date, title, venue, time, and price.
- **Gallery images:** each photo is a `<div class="gallery-item">` block in
  `gallery.html`. Set `data-category` to `live`, `crowd`, or `festival` (or
  add your own category — just add a matching filter button too).
- **Contact details:** edit the address, email, phone, and social links
  directly inside the `.info-card` blocks in `contact.html`.

### Replacing the gallery photos

The gallery currently uses real, unmodified photographs pulled from
[Unsplash](https://unsplash.com), each one free to use commercially and
non-commercially under the [Unsplash License](https://unsplash.com/license) —
no permission or attribution required, though crediting the photographer
is a nice touch. They're loaded directly from Unsplash's image CDN
(`images.unsplash.com`), so an internet connection is needed to see them.

**Swap them for your own event photography whenever you're ready**, either by:
- dropping your own photo files into a new `images/` folder and updating
  each `<img src="...">` in `gallery.html` to point at them, or
- replacing individual Unsplash URLs with photos of your own events —
  just make sure whatever you use is properly licensed.

Keep the `alt="..."` text descriptive — it's used for accessibility and by
the lightbox caption.

## The contact form — already wired to your inbox

This is a **static** site with no server of its own, so the form is
connected to [FormSubmit](https://formsubmit.co) — a free service that
takes the POST from the form and emails it straight to
**carlsongovedi@gmail.com**. No account or signup needed.

**One-time activation step:** the *first* time the form is submitted (by
you, as a test — do this right after you publish the site), FormSubmit
sends a confirmation email to carlsongovedi@gmail.com with a link you have
to click once. After that, every future submission is delivered straight to
the inbox with no further steps.

How it's wired, in `contact.html`:
```html
<form id="contact-form" action="https://formsubmit.co/carlsongovedi@gmail.com" method="POST">
  <input type="hidden" name="_subject" value="New message from PULSE contact form" />
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_template" value="table" />
  ...
</form>
```
`js/script.js` still runs the same client-side checks (name, email format,
message length, honeypot) before the message is allowed through; once it
passes, the form does a real submit to FormSubmit.

**To change the destination email:** edit the `action="https://formsubmit.co/..."`
URL in `contact.html` to the address you want, then repeat the one-time
confirmation step above for that new address.

**Optional tweaks once the site is live at a real domain:**
- Add `<input type="hidden" name="_next" value="https://yourdomain.com/thanks.html" />`
  to redirect to a custom "message sent" page instead of FormSubmit's default one.
- Set `_captcha` to `true` if you start getting spam and want FormSubmit's
  built-in captcha step.

If you'd rather use a different provider (Formspree, Netlify Forms, or your
own backend), just swap the `action` URL and hidden fields for whatever that
service requires — the rest of the form and its validation stay the same.

## Security notes

This is a static front-end, so "secure" here means: safe against the common
front-end mistakes, not a hardened server.

- **Content-Security-Policy** meta tag on every page, restricting scripts to
  same-origin and images to same-origin/HTTPS/data URIs.
- **Input sanitization:** the contact form strips `<` and `>` characters and
  trims/length-limits input before use, and the JavaScript never writes raw
  user input into the page with `innerHTML`.
- **Honeypot field:** a hidden `company` field on the contact form traps
  simple spam bots — real visitors never see or fill it.
- **No inline event handlers** and no `eval`-style code anywhere.
- **HTTPS:** once you deploy this (see below), always serve it over HTTPS —
  most static hosts do this automatically.

If you add a real backend or form service, sanitize and validate input again
**server-side** — client-side checks (like the ones here) are for user
experience, not security, since they can always be bypassed.

## Deploying it

Any static host works, since there's no server-side code. A few free options:

- **GitHub Pages:** push this folder to a repo, enable Pages in settings.
- **Netlify / Vercel:** drag-and-drop the folder in their dashboard, or connect a repo.
- **Any shared hosting / cPanel:** upload the files via FTP into your public folder.

## Browser support

Works in all modern evergreen browsers (Chrome, Firefox, Safari, Edge) on
phones, tablets, and desktops. No polyfills required.
