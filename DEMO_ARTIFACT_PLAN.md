# Demo Artifact Plan

## Where To Keep Artifacts

Keep submission planning at the repo root and evidence assets in repo-level folders:

- `ai-logs/` - required by contest rules; must contain at least one `.txt`, `.md`, or `.jsonl` file.
- `demo-artifacts/` - optional but recommended for screenshots, Loom link notes, and demo script.
- `REFLECTION.md` - recommended at repo root so judges can find it quickly.

The Loom video itself does not live in the repo. Put the Loom URL in `demo-artifacts/README.md`, `REFLECTION.md`, and the contest submission form.

## Recommended Repo Layout

```text
ai-logs/
  copilot-session-clean.md
demo-artifacts/
  README.md
  demo-script.md
  screenshots/
    01-sign-in.png
    02-onboarding.png
    03-scan.png
    04-nutrition-results.png
    05-diary.png
    06-progress.png
    07-community.png
REFLECTION.md
```

## Screenshots To Capture

Prioritize polished screenshots because judges see them first:

1. Sign-in / auth gate
2. Onboarding profile and goal setup
3. Scan screen with camera/gallery controls
4. AI nutrition results with calories and macros
5. Fix Results / manual correction state
6. Saved meal confirmation or diary entry
7. Home / daily diary view after Phase 4
8. Macro progress view after Phase 4
9. Progress/streaks view after Phase 5
10. Community/share view after Phase 6

For the current Phase 3 checkpoint, screenshots 1, 3, 4, 5, and scan-to-save evidence are the most relevant.

## Loom Walkthrough Plan

Target length: 3 to 5 minutes.

1. Brief intro: name, app name, goal of the app.
2. Explain the app architecture: Expo mobile app, Fastify API proxy, shared TypeScript contracts, local-first SQLite.
3. Demo authentication/onboarding gate.
4. Demo scan flow: camera/gallery selection, analyze action, result state.
5. Demo Nutrition Results: calories, macros, serving stepper, Fix Results, Done save.
6. Explain privacy: photos local-first, backend proxy for AI, no client-side API keys, sharing opt-in only.
7. Show tests passing in terminal.
8. Close with what is complete and what the next phase adds.

## Reflection Outline

Create `REFLECTION.md` with these sections:

- What I built
- What was easy
- What was difficult
- What I learned
- How I used AI
- Architecture decisions
- What I would improve next

## Final Submission Checklist

- [ ] `ai-logs/` exists and contains at least one clean log file.
- [ ] No secrets appear in AI logs or source files.
- [ ] Screenshots are polished and named in display order.
- [ ] Loom URL is available and public/unlisted as required.
- [ ] Reflection is written.
- [ ] `npm run typecheck` passes.
- [ ] `npm test -- --runInBand` passes.
- [ ] `npm run lint` passes.
- [ ] GitHub repository is public.