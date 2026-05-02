# Pinary Academy Website

Static mobile-first website for Pinary Academy.

## Preview

Run:

```bash
npm start
```

Then open `http://127.0.0.1:4173`.

## Files

- `index.html` - one-page website built with Tailwind CDN and custom CSS.
- `assets/style.css` - responsive design and brand styling.
- `assets/script.js` - contact form submission handler.
- `assets/pinary-logo.svg` - editable logo asset based on the provided Pinary branding.
- `assets/pinary-og.svg` - social sharing image for Open Graph and Twitter previews.
- `google-apps-script.gs` - Google Apps Script endpoint for saving registration leads to Google Sheets.
- `server.js` - dependency-free Node.js preview server.
- `robots.txt` and `sitemap.xml` - SEO crawl files.

## SEO Notes

The site is plain HTML, so headings, copy, links, contact details, and course content are crawlable without JavaScript. Before publishing, replace `https://pinary.academy/` in `index.html`, `robots.txt`, and `sitemap.xml` with the final domain if it is different.

## Connect Google Sheets

1. Create a Google Sheet.
2. Open Extensions > Apps Script.
3. Paste the contents of `google-apps-script.gs`.
4. If the script is not bound to the sheet, replace `PASTE_SPREADSHEET_ID_HERE` with the Sheet ID.
5. Deploy as Web App.
6. Set access to "Anyone".
7. Copy the Web App URL.
8. In `assets/script.js`, replace `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web App URL.

## Edit Contact Details

Update phone, WhatsApp, email, and location in the contact section of `index.html`.

## Lead Form Fields

The registration form captures name, WhatsApp number, current status, goal, and source. These same fields are written by `google-apps-script.gs`.
