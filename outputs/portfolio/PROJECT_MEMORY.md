# Portfolio project memory and handoff

This file preserves the decisions and verified context collected in the Matera portfolio work so the project can continue across chats and devices. The ChatGPT conversation itself remains in the user's account; this is the durable project handoff, not a verbatim transcript.

## Current project state

- Portfolio source lives in `outputs/portfolio/` in the repository root. The folder contains its own historical `.git` directory; do not stage that nested metadata as a submodule. The root repository is the GitHub publication target.
- The site is a custom interactive portfolio with a scrapbook, journey chapters, Janitri deep dive, and project case-study routes. The Matera case study is under active revision.
- Local preview has used `http://127.0.0.1:4173/work/matera` and changing `?rev=` cache-busting values. Localhost URLs only work on the user's device while the server is running.
- Core implementation files include `app.js`, `styles.css`, `index.html`, `dist/`, route HTML, and `assets/`. The case-study renderer is in `app.js` near `renderMateraCaseStudy` (around the high 2600s in the current version).
- User prefers a preview link after meaningful work and has repeatedly asked to keep the approved animation and scrapbook/journey experiences intact when iterating on a specific section.

## What the Matera project is

Matera is a nurse-facing antenatal care (ANC) experience designed to extend an existing remote patient-monitoring ecosystem. The product should connect patient context, monitoring, and handover inside nurses' real workflow. The central design aim is to make monitoring feel like assistance rather than a parallel app or extra task.

The work was done solo by Shruti as UX/UI designer, with team-lead guidance and approval and AVP review. Matera remains in development. Do not present it as shipped, clinically validated, or proven to improve outcomes.

## Research and evidence boundaries

- Fieldwork was at Rangadore Memorial Hospital only.
- Six nurses participated across different duties: three junior and three senior nurses; two senior nurses worked in triage. Work contexts included triage, NST, labour, and regular ANC monitoring. Do not imply all six performed the same task or that the sample represents every care setting.
- The user learned the existing ecosystem and deployment context from the team, then visited the hospital, reviewed files/registers, observed workflow and triage/NST context, asked nurses questions, and reviewed available backend/device data.
- ASHA workers, government hospitals, and private facilities are deployment contexts and scalability requirements, not additional fieldwork sites.
- Nurses described manual calculations and duplicate entry across registers and the existing monitoring system; an NST experience that could become difficult during long runs; alerts that did not always provide a complete patient picture; fragmented patient information across files/rooms; and difficulty recalling symptom timing/frequency.
- Some encounters may have lacked MEOWS documentation. A prior draft mentioned 23 of 45 encounters, but the denominator, source, and interpretation need confirmation before publishing this as a quantitative finding. Do not infer why MEOWS was absent.
- “Two people had the symptom issue” is ambiguous (participants, patient cases, or scenarios). Do not quantify until clarified.
- Operational data previously noted from the Behance case-study summary: 9,813 registrations over 30 days, 32 active nurses, 401 nurse-days, mean 24.5 registrations/nurse-day, peak 114; 43 nurse-days above 50 and 10 above 75. Raw records were not available in the local repo and the Behance page could not be independently retrieved. Verify the source, denominator, and units before publication. Treat this as operational context, never as design impact or an outcome.
- User-reported nurse feedback came from an early ideation prototype and suggested positive interest in MEOWS, NST, and symptom flagging. Call this early feature-desirability feedback only. It is not formal usability validation, clinical validation, adoption evidence, or proof of outcomes.

## Product constraints and business context

- Care settings differ; deployments can range from ASHA contexts to government and private facilities.
- Device availability varies; ANC needs to continue with or without a monitoring device.
- The hospital assigns UHID/MRN before the Matera product touchpoint. There is no Aadhaar or OTP integration in this design.
- Business models differ: hardware, software, bundles, subscriptions, and per-person leasing. In the per-person model described by the user, one monitored patient-day is counted as one session.
- A patient may be removed from a device/tablet monitoring list because of a capacity limit and need monitoring again later. Re-adding as a new patient fragments backend history and can create a mismatch between the paper register and product session counts, with possible revenue reconciliation impact. No revenue impact amount is measured.

## Product design stories that must be represented

Treat each as a distinct design story with a clear user need, evidence, decision, flow/screens, current delivery status, feedback, and intended value. Do not flatten symptom flagging into a feature list.

### 1. Persistent patient record and return continuity

Use hospital-issued UHID/MRN to retrieve an existing record or add a new patient after hospital registration. A persistent patient record should preserve prior monitoring and clinical context, so a returning patient is not accidentally treated as new after list removal. The intent includes history, recordings, doctor notes, and an activity timeline. Patient retrieval/persistent-record architecture is defined UX; distinguish designed from prototyped states precisely. This also protects continuity and the business's patient-day/session accounting.

### 2. Symptom flagging and contextual review — standalone story

Nurses can capture ANC symptoms and recurrence/frequency. A contextual review can consider recurrence, gestational age, trimester, and available vitals/MEOWS to surface a possible signal for nurse/doctor review, never a diagnosis. The nurse retains judgment and chooses whether to inform the doctor; symptoms, notes, and actions remain part of the patient record/timeline. The user described this as an interactive prototype and early feature-desirability feedback was positive. Avoid implying a clinically validated AI, automated diagnosis, or automatic doctor escalation. Show the symptom capture → recurrence/context → possible signal → nurse review/decision → record/timeline flow, and label any unbuilt states as intended UX.

### 3. MEOWS within ANC monitoring

MEOWS already existed in triage; the design extends/integrates it into the ANC nurse workflow. Describe the problem as making maternal deterioration cues available within the relevant monitoring workflow, while preserving context. Do not claim MEOWS was invented for the product or generalize the sample beyond observed research. MEOWS was an interactive prototype flow and part of early feedback.

### 4. NST and ongoing monitoring

NST can run for hours. The full CTG trace remains primary. While nurses navigate elsewhere, a minimized heart-rate gauge/update card persists on the vitals page and other sections while NST is live; it gives way to the full CTG view or NST live grid. Threshold deterioration creates an update notification. The system states that a threshold has been reached and prompts consideration of informing the doctor; the nurse decides. The doctor can view live monitoring and may communicate back, but is not involved in every case. If the nurse informs the doctor, include trace, current readings, threshold update, patient context, and an optional note; save communication/actions in the patient notes/timeline. Do not say the system automatically informs the doctor. NST/threshold states are prototyped.

### 5. Shared patient workspace and split-panel rationale

The split workspace keeps patient context available beside the current task, reducing repeated navigation. The rationale was informed by the reference-and-entry pattern nurses use in paper registers: context on one side, action/data entry on the other. A patient-list/detail split already existed in the earlier design, so frame the work as a refinement/rework for continuity and workflow fit, not the invention of split view. Compare the previous ANC design and redesign to show the change.

### 6. Intake, calculations, voice, and touch targets

The user considered quick selection, large touch targets, voice capture, emergency intake, LMP-to-EDD/GA autofill, and GPAL-to-OBS scoring with review/correction. Label these as concepts or intended UX unless the actual prototype confirms them. Do not imply all are built or validated.

## Recommended case-study narrative and hierarchy

The case study should be concise and visual, but explain reasoning like a senior product designer. Avoid long paragraphs, redundant sections, and career-timeline framing.

1. **Hero** — Matera; nurse-facing ANC experience; hook: “The monitor had the readings. Nurses had to build the story.” Explain that the designed ANC experience connects patient context and monitoring within an existing remote-care product without a parallel workflow. State role, guidance/review, six-nurse fieldwork, prototype status, and scope.
2. **Product challenge and constraints** — one ANC workflow across varied care settings; ecosystem, variable device access, hospital records/registers first, differing commercial models, and continuity/session-count implications. Make clear only Rangadore was researched.
3. **Research approach and evidence** — six nurses, roles/tasks, observation/interviews, register/files, team/system context, backend data. Separate direct field evidence from deployment requirements and secondary operational data. Use a compact evidence ledger, not fabricated personas or universal claims.
4. **Synthesis** — map workflow and friction with a grounded current-state journey: identify which user/task, context, breakdown, consequence, and evidence. If using empathy maps/personas, label them as synthesis artifacts from this bounded study, not representative population personas.
5. **Problem reframe** — keep care actions and patient context together, preserve continuity across sessions/handovers, and avoid duplicate work. Distinguish the design problem from the implementation brief.
6. **Information architecture and end-to-end flow** — show patient lookup by UHID/MRN, persistent record, current monitoring/action, context/history, and handover/notes. Label which routes are defined vs prototyped.
7. **Four design stories** — persistent patient continuity; symptom flagging; MEOWS in ANC; NST/threshold monitoring. Each story should show evidence → design choice → flow or screens → intended user/business value → status/feedback. These are co-equal; symptom flagging must not disappear.
8. **Cross-cutting decisions/design system** — refined split workspace, context beside action, timeline, status/alert hierarchy, touch targets, voice/autofill concepts, and reusable clinical patterns. Avoid claiming an implemented design system if only foundations/tokens are documented.
9. **Prototype feedback and next validation** — explain first ideation round, what nurses liked/wanted present, limitations, and next usability/clinical-safety validation questions. No impact metrics unless measured.
10. **Reflection/next steps** — what remains to prototype/test, especially continuity, symptom review comprehension, alert burden, long NST usage, handover, and record/session reconciliation.

Possible top-level navigation can group content as Context, Research, Findings, Flow, Principles, Design choices, Feedback, Intended value, Next test, but avoid making it visually overlong or detached from the narrative.

## Portfolio truth and writing rules

- Separate “observed,” “reported,” “reviewed in aggregate data,” “designed,” “prototyped,” “tested as an early idea,” “intended value,” and “not yet validated.”
- Never invent outcomes, adoption, safety improvements, time saved, revenue recovered, clinical efficacy, dates, locations, or employer/brand details.
- Do not call a possible symptom-risk signal an AI diagnosis. It is a review cue for a human.
- Do not claim that doctor notification is automatic. Nurse chooses to inform.
- Do not claim the team researched all care settings; only Rangadore was the fieldwork site.
- Do not imply the product is shipped. It remains under development.
- Avoid repeated generic UX language. Use concrete details and concise explanations of design rationale and tradeoffs.
- Use citations/source notes for operational data and identify what is user-reported vs independently verified.

## Reference artifacts

- Current ANC Figma: https://www.figma.com/design/2fCrSdBPX90JpncH6V6W0L/ANC-for-chat-gpt?node-id=527-54637
- Previous ANC nurse app redesign Figma: https://www.figma.com/design/hUl3SXFPCysJksn0v5EPn7/ANC-Nurse-App-%E2%80%94-Dashboard-Redesign?t=ayXKISLCgpcyNZxt-1
- Behance case study: https://www.behance.net/gallery/252994607/Matera-UIUX-Case-Study-Graduation-Project?platform=direct
- These links should be inspected if access is available; the Behance page was not retrievable during earlier work.

## Current next step

Continue refining the Matera project showcase while keeping the evidence boundaries above. The user wants symptom flagging presented as a distinct design story, alongside MEOWS, NST, patient continuity, and the workflow decisions. Preserve the approved hero/avatar sequence unless the user asks to change it.

## 2026-10-14 update: Matera entry point and case-study revision

- The Matera answer card in the Janitri deep dive is now intended to be a keyboard-accessible link to `/work/matera`, with an explicit “Explore the case study” CTA. Returning from the case study targets `/experience/janitri#matera-answer`, restoring the same Matera card rather than the top of the Janitri page.
- Matera now has a standalone symptom-review section: symptom capture → recurrence/frequency → context (GA, trimester, available vitals/MEOWS) → possible signal for human review → nurse decision and record. This is explicitly framed as an ideation-prototype capability and possible review cue, never a diagnosis or automatic doctor alert. Early feedback is feature interest, not usability, clinical, adoption, or outcome validation.
- The case-study sequence now has ten sections and includes a dedicated “Symptom review” navigation item. Prototype boundaries and section numbering were updated in both source and distribution copies.
- Removed the unverified MEOWS 23/45 count and ambiguous “two cases” symptom count. The aggregate workload summary remains separately labeled as an earlier case-study data summary, not Rangadore fieldwork or redesign impact. Direct fieldwork remains six nurses at Rangadore Memorial Hospital; other care contexts are deployment requirements, not fieldwork sites.
- Updated answer-card styling, keyboard focus state, local cache versions, and source/distribution assets. JavaScript syntax was checked with the bundled Node runtime.
- The user-owned GitHub repository `smokingace0218/portfolio` is private. It previously contained only `README.md` and `PROJECT_MEMORY.md`; the website source was missing despite the README linking to it. GitHub Pages is unavailable for this repository unless its plan is upgraded or repository visibility is changed. Keep the repository private unless the user explicitly requests otherwise.
- The existing public Sites deployment is `https://shruti-portfolio.shruti786aaa.chatgpt.site`; the old localhost preview at port 4173 is device-only and is not a shareable link. The live deployment must be updated from the connected Sites source and verified before sharing as current.
- The Matera card route is `/work/matera`; it returns to `/experience/janitri#matera-answer`. Ensure direct routes have a fallback so they work after refresh.
