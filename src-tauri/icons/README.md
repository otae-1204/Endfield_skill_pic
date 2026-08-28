# App icons

The Windows app icon uses the character image provided by the project user,
cropped to the artwork bounds and placed on a transparent square canvas. The
cropped source is `endfield-character.png`; it is not an original project
asset. See the repository root `NOTICE.md` for attribution and redistribution
notes.

`icon.ico` and the platform-sized PNGs in this directory are generated with
`npx tauri icon src-tauri/icons/endfield-character.png --output src-tauri/icons`.
