# Econspire front end

A static website in `dist/`. Run it locally with:

```powershell
python -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173/`. No package installation or build step is required.

- `dist/index.html` contains the page structure and content.
- `dist/styles.css` contains the visual system and responsive layouts.
- `dist/app.js` controls the case guide, menu, scroll effects and future event list.
- `dist/blank.html` is the temporary destination for participation, volunteer and ambassador links.
- `dist/assets/` contains the supplied Econspire images and recent event photos from the Telegram export.

The confirmed upcoming event data lives in `UPCOMING_EVENTS` at the top of `dist/app.js`. It is empty because the supplied channel export contains no event after 20 September 2026. Add records only after a new announcement is verified. The source of future event updates can be connected later without changing the page layout.

See `CONTENT_NOTES.md` for the source and recency decisions behind the current copy.
