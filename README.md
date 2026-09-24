# Econspire front end

A static website in `dist/`. Run it locally with:

```powershell
python -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173/`. No package installation or build step is required.

- `dist/index.html` contains the page structure and content.
- `dist/styles.css` contains the visual system and responsive layouts.
- `dist/app.js` controls the case guide, menu, scroll effects and photo carousel.
- `dist/events-firebase.js` reads published future events from Cloud Firestore.
- `dist/blank.html` is the temporary destination for participation, volunteer and ambassador links.
- `dist/assets/` contains the supplied Econspire images and recent event photos from the Telegram export.

New event records are created in the separate Econspire Manager app and stored in Firebase project `econspire-4436d`. The public page shows only records marked `published` whose date has not passed in Uzbekistan. No event was prefilled because the supplied channel export contains no future announcement after 20 September 2026.

See `CONTENT_NOTES.md` for the source and recency decisions behind the current copy.
