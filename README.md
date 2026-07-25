# logoanimations

Full-screen **animated logo reveals**, built to be screen-recorded on a phone
and posted to social. Sibling to [`animations`](https://github.com/dadafivethousand/animations),
which holds the full ad units — this repo is just the logo pieces.

## Run it

```bash
npm install
npm start          # http://localhost:3000
CI=true npm run build
```

Open it in a portrait phone viewport (~390×844). These are mobile-only —
there is no desktop layout.

## Included animations

| Component | Look | Beats |
|---|---|---|
| `LogoAssemble` | graphite stage, brand red | shards converge → mark locks + shine sweep → wordmark & tagline |
| `LogoNeonGlitch` | arcade violet, cyan/magenta split | scanline power-on → RGB glitch burst → snap into register |
| `LogoInkStamp` | cream paper, ink black, red ring | paper settles → stamp impact + dust puff → caption |

## Adding one

1. `src/Components/YourName.js` + `src/Stylesheets/YourName.css`, classes
   namespaced with a short prefix.
2. Drive the timing with `usePhases([cue1, cue2, cue3], loopAt)` and key all the
   CSS off the `.xx-p0`..`.xx-p3` root classes.
3. Point `src/App.js` at it; comment out the previous one rather than deleting.
4. Give it a **palette of its own** — see `CLAUDE.md` for why.

## Conventions

Everything else — safe margins for the recording crop, the mobile-only rule,
reduced-motion handling, the logo-foiling trick — is written up in `CLAUDE.md`.
