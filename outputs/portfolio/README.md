# Shruti — interactive portfolio

The live portfolio is published at [shruti-portfolio.shruti786aaa.chatgpt.site](https://shruti-portfolio.shruti786aaa.chatgpt.site). The Matera case study is at [`/work/matera`](https://shruti-portfolio.shruti786aaa.chatgpt.site/work/matera); its Janitri entry card links to the same case study, and its return links restore the Matera card.

The landing page at `/` is an image-led story about Shruti entering product design. Résumé and Portfolio remain immediate navigation options. Deeper routes are still available at `/resume`, `/portfolio`, `/experience/sant-rams`, `/experience/janitri` and `/work/{slug}`, but the landing story does not list internship deliverables.

The character is the narrator, not a decorative portrait. In the NIFT scene, the transparent camera avatar remains anchored while four generated image plates change on hover, focus or tap. Further journey scenes advance between avatar image poses as the visitor scrolls. The landing page uses short character dialogue instead of internship work summaries. Reduced-motion and touch behaviour are supported.

## Landing gateway character sequence

The root landing view begins with four centered navigation options falling into place; once the last option lands, the fingertip frame appears at the right edge. Résumé, Portfolio and Connect reveal the curious closed-mouth peek and play a soft, brief hover chime; leaving returns to fingertips. “Let me show you” immediately crossfades to the happy toothy-smile frame and starts a spoken “Hello!” on hover. Clicking or pressing the invitation retries playback if the browser blocked the hover attempt. The poses share a 1024 × 1536 transparent canvas and are displayed in one viewport-sized image box to preserve registration. The original PNGs remain in `assets/`; optimized transparent WebP versions are used in the page.

The intro uses a 15-second Seedance 2.0 avatar performance, muted video, and a separate Ainsley narration. Shruti turns toward the visitor during “What’s up?”, then faces front and introduces herself with conversational gestures. The video is revealed in the cream intro scene, and speech begins with the performance; both stop when the visitor scrolls away. The voice and video are hosted at Higgsfield CDN URLs recorded in `assets/avatar-states.json`; `avatar-speaking.png` remains the loading and reduced-motion still.

## Add a project

Add a project object to the `projects` array near the top of `app.js`. Its `slug`, title, summary, category, role, company, sections and `featured` flag drive the Selected Work scene, portfolio index and case-study route. Use `featured: false` to keep a project off the homepage while listing it in the complete portfolio.

## Add an avatar pose

Add the optimized image in `assets/`, add a named entry to `avatarStates` in `app.js`, and record its scene and action in `assets/avatar-states.json`. Keep transparent character artwork separate from backgrounds where the scene needs to change around a stationary pose. `avatar-speaking.png` is the current speaking/gesture state.

## Project imagery

The supplied Figma board was used as a character and pose reference. It did not contain JAZAA, Matera or AETHER project artefacts, so this version uses editorial project covers and narrative copy rather than presenting invented product screens as shipped work. Replace these covers with the original artefacts when they are available.

## Run locally

Start the included Node server from this folder with `npm start`; it serves the portfolio at `http://127.0.0.1:4173` and falls back to the homepage for deep links. Localhost works only while that server is running on your device. Use the live URL above when opening the portfolio from another device.
