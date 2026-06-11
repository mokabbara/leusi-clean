LEUSI — Safety Symbols folder

Drop your individual PNG symbols into THIS folder.
The frontend will pick them up automatically. If a file is missing the symbol
card falls back to an emoji, so the app never breaks.

Required file names (lowercase, hyphenated):

— Mandatory (blue circles) —
mandatory-helmet.png
mandatory-gloves.png
mandatory-safety-shoes.png
mandatory-eye-protection.png
mandatory-hearing.png
mandatory-respirator.png
mandatory-harness.png

— Warning (yellow triangles) —
warning-electricity.png
warning-falling.png
warning-toxic.png
warning-flammable.png
warning-suspended-load.png
warning-trip.png

— Emergency (green squares) —
emergency-exit.png
emergency-first-aid.png
emergency-assembly.png
emergency-eye-wash.png

— Fire (red squares) —
fire-extinguisher.png
fire-phone.png
fire-hose.png

— Prohibition —
prohibition-no-smoking.png
prohibition-no-fire.png
prohibition-no-entry.png

Image guidance:
- Square aspect ratio (e.g. 256×256)
- Transparent background preferred
- Approx 4–20 KB per file
- Optimised PNG (or WebP if you also rename the extension in the symbol list)

Adding new symbols later:
1. Drop the PNG into this folder using the exact file name above.
2. Commit + push to GitHub. Cloudflare Pages rebuilds and the image shows up.
3. To add a NEW symbol (not yet in the list), edit `SAFETY_SYMBOLS` in
   app/index.html: add an entry with { id, file, category, emoji, labels, explain }.
