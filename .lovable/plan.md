# LUNA updates: co-founder skills, daily galaxy, AI search bar

## 1. About page — co-founder skills

Varshini Yarramsetty's card currently has only a short bio and contact links, while the founder card has a "Skills & Interests" tag row. Add a matching **Skills & Interests** tag row to the co-founder card, using the same pill styling so both profiles look consistent (content, learning experience, community growth, communication, research, design-oriented tags — exact list can be tweaked after you see it).

## 2. Real galaxy background that changes every day

Replace the current canvas dot-galaxy with a photo-real deep-space backdrop:

- Generate 7 realistic galaxy / nebula scenes (spiral galaxy, nebula clouds, star cluster, deep-field, etc.) tuned to LUNA's dark teal palette.
- The site picks one automatically based on the day of the year, so every day looks different and it repeats weekly.
- Keep it alive but calm: very slow drift/zoom plus a thin twinkling star layer over the image, subtle pointer parallax, and a soft fade near content so text stays readable.
- Honours reduced-motion (static image) and stays behind all content on every page.

## 3. AI search bar on the home page

Add a prominent search bar under the hero headline:

- Type a question, press Enter (or click Ask) → opens LunaAI in a fresh chat with your question sent automatically, and the answer streams in word by word.
- A few example prompt chips under the bar for quick starts.
- Keyboard-friendly, works on mobile.

## 4. Remove the LunaAI card from the home grid

Since the search bar is the new way into Luna AI, drop the "LunaAI 7.0" card from the home features grid (the navbar link and the /luna-ai page stay).

## 5. Streaming replies + error sweep

- Verify Luna's answers stream in progressively end to end, including the new home-page hand-off, and fix anything that blocks it (e.g. an auto-sent question that doesn't trigger the stream).
- Run a full check: typecheck/build, click through the main pages, and fix any console or runtime errors found.

## Technical notes

- `src/components/GalaxyBackground.tsx` rewritten to layer a daily-selected generated image (`src/assets/galaxy-*.jpg`, imported and picked by day index) under a light canvas twinkle layer; mounted as-is in `src/routes/__root.tsx`.
- New `src/components/HomeAiSearch.tsx` navigates to `/luna-ai` with the typed question as a search param; `/luna-ai` `validateSearch` extends to accept `q`, and `luna-ai.$threadId.tsx` auto-submits it once per thread through the existing streaming `/api/chat` route.
- `src/routes/about.tsx`: add a `cofounderSkills` array and render it in the co-founder block.
- `src/routes/index.tsx`: remove the `/luna-ai` entry from `FEATURES`, insert the search bar in the hero.
