const BASE_PATH = window.__PORTFOLIO_BASE__ || (location.hostname.endsWith('.github.io') && (location.pathname === '/portfolio' || location.pathname.startsWith('/portfolio/')) ? '/portfolio' : '');
const ASSET = location.protocol === 'file:' ? new URL('../../assets/', location.href).href : `${BASE_PATH}/assets/`;

// Character states are named separately from story scenes so new poses can be
// added without changing the narrative structure.
const avatarStates = Object.freeze({
  peek: { src: 'avatar-peek.png', alt: 'Shruti peeking into the page' },
  hello: { src: 'avatar-wave.png', alt: 'Shruti giving a small hello wave' },
  present: { src: 'avatar-intro.webp', alt: 'Shruti standing with her camera and backpack' },
  camera: { src: 'avatar-camera.webp', alt: 'Shruti looking through her camera' },
  travel: { src: 'avatar-travel.webp', alt: 'Shruti travelling with luggage' },
  travelStep: { src: 'avatar-travel-step.png', alt: 'Shruti taking another step with her suitcase' },
  presentWork: { src: 'avatar-present.png', alt: 'Shruti presenting visual work' },
  speaking: { src: 'avatar-speaking.png', alt: 'Shruti speaking with a small, open hand gesture' },
  research: { src: 'avatar-research-new.png', alt: 'Shruti studying her notebook and research notes' },
  blankCanvas: { src: 'avatar-laptop.png', alt: 'Shruti thinking beside a blank laptop' },
  tablet: { src: 'avatar-tablet.webp', alt: 'Shruti holding a tablet' }
});

// Add projects here; `featured` controls the homepage selection.
const projects = [
  {
    slug: 'jazaa', title: 'JAZAA', year: '2025', featured: true, company: 'Sant Ram’s Jewellers',
    category: 'Brand identity · Visual communication · Digital experience', status: 'case-study-in-progress', thumbnail: '', media: [], prototypeUrl: '', relatedExperience: 'sant-rams',
    summary: 'I helped shape the early visual and digital pieces of a lab-grown diamond brand.',
    role: 'Visual design intern · Brand identity and digital',
    sections: [
      ['A brand taking shape', 'I joined while the brand was finding its voice. I helped turn early ideas into a visual world people could recognise.'],
      ['Finding its visual language', 'I explored logo directions, type, identity, photography and launch content—building pieces that could feel like one brand.'],
      ['A digital home', 'I worked on the website’s structure and UX/UI, bringing the brand’s emerging visual language into its digital experience.'],
      ['What stayed with me', 'A brand is made through many small decisions. The words, images and digital experience all need to feel part of the same story.']
    ]
  },
  {
    slug: 'cms', title: 'CMS', year: '2025', featured: true, company: 'Janitri Innovations',
    category: 'Healthcare UX · Alerts · Empty states', status: 'case-study-in-progress', thumbnail: '', media: [],
    prototypeUrl: 'https://www.figma.com/proto/RH6iVlPE10Mx0FLOpOemXw/CMS--Copy-?node-id=1-97411&t=ntwoLUSdHy2c0apM-1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A97411',
    relatedExperience: 'janitri',
    summary: 'Alert and empty-state design for a centralized maternal and fetal monitoring system supporting Assam public health.',
    role: 'UX/UI designer · Alerts and empty states',
    sections: [
      ['A network to monitor', 'The system supported centralized maternal and fetal monitoring across 41 government hospitals and 82 cCTG devices in Assam.'],
      ['When attention matters', 'I worked on alert states so critical information could stand out within a shared monitoring workflow.'],
      ['When there is nothing to show', 'I designed empty states to make the system’s status clear when no monitoring information was available.'],
      ['Scope and evidence', 'My contribution focused on alert and empty-state design for a public-health rollout across Assam.']
    ]
  },
  {
    slug: 'matera', title: 'MATERA', year: '2026', featured: true, company: 'Janitri Innovations',
    category: 'Healthcare UX · Field research · Workflow design · Prototyping', status: 'case-study-in-progress', thumbnail: '', media: [], prototypeUrl: '', relatedExperience: 'janitri',
    summary: 'The monitor had the readings. Nurses had to build the story. A nurse-facing ANC experience connecting patient context, symptom review and monitoring.',
    role: 'Solo UX/UI designer · Team-lead guidance and AVP review',
    sections: [
      ['The product challenge', 'Connect patient context, monitoring and handover inside an existing remote-care product—without adding a parallel workflow.'],
      ['Research and workflow', 'Fieldwork with six nurses at Rangadore Memorial Hospital informed the workflow. Other care settings were deployment requirements, not research sites.'],
      ['Symptom review', 'Prototype symptom capture, recurrence and contextual review as a possible signal for a nurse—not a diagnosis.'],
      ['Monitoring and continuity', 'Prototype MEOWS and long-running NST states; define persistent patient history and return-visit continuity.'],
      ['What remains to prove', 'Matera is in development. Early ideation feedback explored feature desirability; workflow fit and outcomes remain to be tested.']
    ]
  },
  {
    slug: 'aether', title: 'AETHER', year: 'Independent', featured: true, company: 'Independent exploration',
    category: 'Product thinking · Travel · Interaction design', status: 'independent-exploration', thumbnail: '', media: [], prototypeUrl: '', relatedExperience: '',
    summary: 'A travel concept for people who know the feeling they want before they know the destination.',
    role: 'Independent product exploration',
    sections: [
      ['Start with a feeling', 'A trip often starts with a mood before it has a destination. What if planning began there?'],
      ['Follow the feeling', 'AETHER is an independent concept connecting atmosphere to landscapes, seasons, places and maps.'],
      ['Still exploring', 'This is my own product exploration. I’m bringing visual communication, research and interaction design together to see where the idea can go.']
    ]
  }
];

const chapters = [
  ['nift', 'NIFT · Notice'], ['chandigarh', 'Chandigarh · Travel'], ['sant-rams', 'Sant Ram’s · Make'],
  ['shift', 'The question changes'], ['bengaluru', 'Bengaluru · Travel'], ['janitri', 'Janitri · Understand'],
  ['scale', 'Janitri · Scale'], ['selected-work', 'Selected work'], ['about', 'About'], ['contact', 'Now']
];

const main = document.getElementById('main');
const progressFill = document.getElementById('scene-progress-fill');
const menuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
let scrollPending = false;
let interfaceAudioContext;
let lastMateraScrollCueAt = 0;
let interfaceAudioUnlocked = false;
let lastHoverSoundTarget = null;
let lastHoverSoundAt = 0;
let lastPhysicalPointerMoveAt = 0;
let lastPointerScrollAt = -Infinity;
let lastInterfaceSoundAt = 0;
let lastInteractionModality = 'pointer';
let interfaceSoundNodes = [];
const lastControlSoundAt = new WeakMap();
const jumpedLandingSections = new WeakSet();
let storyCueBusyUntil = 0;
let journeyTypeText;
let activeStoryCueMedia = null;
let activeStoryCueNodes = [];
let storyCueGeneration = 0;
let lastJumpCueAt = -Infinity;

function stopActiveStoryCue() {
  if (activeStoryCueMedia) {
    activeStoryCueMedia.pause();
    activeStoryCueMedia.currentTime = 0;
    activeStoryCueMedia = null;
  }
  activeStoryCueNodes.forEach(node => { try { node.stop(); } catch {} });
  activeStoryCueNodes = [];
}

function stopInterfaceSound() {
  interfaceSoundNodes.forEach(node => { try { node.stop(); } catch {} });
  interfaceSoundNodes = [];
}

function playStoryCue(kind, forceSynthesis = false, owner = null) {
  // Several observers can report the same arrival during the first frame.
  // Keep one jump cue per landing so a single CTA never sounds like a chorus.
  if (kind === 'jump') {
    if (owner instanceof Element) {
      if (jumpedLandingSections.has(owner)) return;
      jumpedLandingSections.add(owner);
    }
    const now = performance.now();
    if (!forceSynthesis && now - lastJumpCueAt < 950) return;
    if (!forceSynthesis) lastJumpCueAt = now;
  }
  // Let a button's short acknowledgement finish when the story cue begins.
  // Cutting these nodes here made secondary CTA sounds disappear on arrival.
  stopActiveStoryCue();
  const cueGeneration = ++storyCueGeneration;
  const mediaCue = kind === 'camera'
    ? document.querySelector('.story-cue--camera')
    : kind === 'touchdown'
      ? document.querySelector('.story-cue--landing')
      : null;
  if (mediaCue && !forceSynthesis) {
    mediaCue.pause();
    mediaCue.currentTime = 0;
    activeStoryCueMedia = mediaCue;
    storyCueBusyUntil = performance.now() + (Number.isFinite(mediaCue.duration) && mediaCue.duration > 0 ? mediaCue.duration * 1000 : 700);
    mediaCue.addEventListener('ended', () => { if (activeStoryCueMedia === mediaCue) activeStoryCueMedia = null; storyCueBusyUntil = 0; }, { once: true });
    const playback = mediaCue.play();
    if (playback?.catch) playback.catch(() => {
      if (cueGeneration !== storyCueGeneration) return;
      activeStoryCueMedia = null;
      playStoryCue(kind, true);
    });
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  interfaceAudioContext ||= new AudioContextClass();
  const context = interfaceAudioContext;
  const play = () => {
    const now = context.currentTime;
    storyCueBusyUntil = performance.now() + ({ camera: 220, drop: 380, touchdown: 340, jump: 420, location: 560 }[kind] || 300);
    const makeTone = (frequency, endFrequency, startAt, duration, volume, type = 'sine') => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), startAt + duration);
      gain.gain.setValueAtTime(volume, startAt);
      gain.gain.exponentialRampToValueAtTime(.0001, startAt + duration);
      oscillator.connect(gain).connect(context.destination);
      activeStoryCueNodes.push(oscillator);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + .005);
    };
    if (kind === 'drop' || kind === 'touchdown' || kind === 'jump') {
      const length = Math.floor(context.sampleRate * (kind === 'jump' ? .38 : .22));
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        const progress = i / length;
        samples[i] = (Math.random() * 2 - 1) * Math.pow(1 - progress, kind === 'jump' ? 1.8 : 2.8);
      }
      const noise = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      noise.buffer = buffer;
      filter.type = kind === 'jump' ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(kind === 'jump' ? 1350 : 260, now);
      filter.frequency.exponentialRampToValueAtTime(kind === 'jump' ? 180 : 90, now + length / context.sampleRate);
      gain.gain.setValueAtTime(kind === 'jump' ? .28 : .72, now);
      gain.gain.exponentialRampToValueAtTime(.0001, now + length / context.sampleRate);
      noise.connect(filter).connect(gain).connect(context.destination);
      activeStoryCueNodes.push(noise);
      noise.start(now);
      noise.stop(now + length / context.sampleRate);
      if (kind === 'jump') {
        makeTone(210, 78, now + .12, .28, .16, 'sine');
      } else {
        makeTone(kind === 'drop' ? 128 : 88, kind === 'drop' ? 44 : 38, now, kind === 'drop' ? .3 : .26, kind === 'drop' ? .35 : .48, 'sine');
        makeTone(kind === 'drop' ? 480 : 185, 90, now + .012, .13, .12, 'triangle');
      }
    } else if (kind === 'camera') {
      // A punchy phone-camera capture: sharp transient, compact mechanism, short body.
      makeTone(1680, 540, now, .075, .28, 'triangle');
      makeTone(240, 72, now + .008, .19, .48, 'sine');
      makeTone(920, 360, now + .018, .115, .26, 'triangle');
      const length = Math.floor(context.sampleRate * .075);
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6);
      const snap = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      snap.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = .65;
      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .075);
      snap.connect(filter).connect(gain).connect(context.destination);
      activeStoryCueNodes.push(snap);
      snap.start(now);
      snap.stop(now + .076);
    } else if (kind === 'location') {
      makeTone(540, 980, now, .22, .22, 'sine');
      makeTone(150, 58, now + .2, .32, .44, 'sine');
      makeTone(320, 105, now + .205, .19, .2, 'triangle');
      const length = Math.floor(context.sampleRate * .16);
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.4);
      const impact = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      impact.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.value = 300;
      gain.gain.setValueAtTime(.72, now + .2);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .36);
      impact.connect(filter).connect(gain).connect(context.destination);
      activeStoryCueNodes.push(impact);
      impact.start(now + .2);
      impact.stop(now + .361);
    }
  };
  if (context.state === 'suspended') context.resume().then(() => { if (cueGeneration === storyCueGeneration) play(); }).catch(() => {});
  else play();
}

// Guide the default path after three seconds of inactivity. Scrolling, typing,
// or other input restarts the window; hovering or focusing a choice pauses it.
function guideStoryChoices(owner, choices, continueStory, delay = 3000) {
  if (!owner) return;
  const controls = choices.filter(control => control && !control.hidden);
  if (!controls.length) return;
  let active = true;
  let timer;
  let finalCueTimer;
  let engaged = false;
  const isVisible = () => {
    const rect = owner.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };
  const refreshEngagement = () => {
    engaged = controls.some(control => control.matches(':hover, :focus'));
  };
  const clearFinalCue = () => controls.forEach(control => control.classList.remove('is-guided-choice-final'));
  const clearTimer = () => {
    clearTimeout(timer);
    clearTimeout(finalCueTimer);
    timer = undefined;
    finalCueTimer = undefined;
  };
  const finish = (advance = false) => {
    if (!active) return;
    active = false;
    clearTimer();
    owner.classList.remove('is-guiding-choices');
    controls.forEach(control => control.classList.remove('is-guided-choice', 'is-guided-choice-final'));
    window.removeEventListener('pointerdown', onInput, true);
    window.removeEventListener('touchstart', onInput, true);
    window.removeEventListener('keydown', onInput, true);
    window.removeEventListener('wheel', onInput, true);
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('pointermove', onPointerMove, true);
    controls.forEach(control => {
      control.removeEventListener('pointerdown', onChoice);
      control.removeEventListener('click', onChoice);
      control.removeEventListener('focus', onFocus);
      control.removeEventListener('blur', onBlur);
    });
    if (advance && owner.isConnected && isVisible()) continueStory?.();
  };
  const schedule = () => {
    clearTimer();
    clearFinalCue();
    refreshEngagement();
    if (!active || engaged) return;
    finalCueTimer = window.setTimeout(() => {
      if (!active || engaged) return;
      controls.forEach(control => control.classList.add('is-guided-choice-final'));
      // Automatic guidance stays visual; hover audio requires user interaction.
    }, Math.max(0, delay - 900));
    timer = window.setTimeout(() => finish(true), delay);
  };
  const onInput = () => schedule();
  const onScroll = () => {
    if (!isVisible()) finish(false);
    else { refreshEngagement(); schedule(); }
  };
  const onChoice = () => finish(false);
  const onFocus = () => { engaged = true; clearTimer(); clearFinalCue(); };
  const onBlur = () => {
    refreshEngagement();
    schedule();
  };
  const onPointerMove = event => {
    const pointTarget = document.elementFromPoint(event.clientX, event.clientY);
    const hovered = controls.some(control => control.matches(':hover') || (pointTarget && control.contains(pointTarget)));
    const nextEngaged = hovered || controls.some(control => control.matches(':focus'));
    if (nextEngaged === engaged) return;
    engaged = nextEngaged;
    schedule();
  };
  owner.classList.add('is-guiding-choices');
  controls.forEach(control => {
    control.classList.add('is-guided-choice');
    control.addEventListener('pointerdown', onChoice);
    control.addEventListener('click', onChoice);
    control.addEventListener('focus', onFocus);
    control.addEventListener('blur', onBlur);
  });
  window.addEventListener('pointerdown', onInput, { capture: true, passive: true });
  window.addEventListener('touchstart', onInput, { capture: true, passive: true });
  window.addEventListener('keydown', onInput, true);
  window.addEventListener('wheel', onInput, { capture: true, passive: true });
  window.addEventListener('scroll', onScroll, { capture: true, passive: true });
  window.addEventListener('pointermove', onPointerMove, { capture: true, passive: true });
  schedule();
}

function afterIdPoseSettles(avatar, callback) {
  const showFrame = avatar?.querySelector('.sant-id-frame--show');
  if (!showFrame) { callback(); return; }
  let settled = false;
  let fallbackTimer;
  const finish = () => {
    if (settled) return;
    settled = true;
    clearTimeout(fallbackTimer);
    showFrame.removeEventListener('transitionend', onTransitionEnd);
    callback();
  };
  const onTransitionEnd = event => {
    if (event.target === showFrame && event.propertyName === 'opacity') finish();
  };
  showFrame.addEventListener('transitionend', onTransitionEnd);
  fallbackTimer = window.setTimeout(finish, 850);
}

function playCameraCaptureThen(callback) {
  const cue = document.querySelector('.story-cue--camera');
  if (!cue) {
    playStoryCue('camera');
    window.setTimeout(callback, 900);
    return;
  }
  let finished = false;
  let fallbackTimer;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(fallbackTimer);
    cue.removeEventListener('ended', finish);
    callback();
  };
  cue.addEventListener('ended', finish);
  const duration = Number.isFinite(cue.duration) && cue.duration > 0 ? cue.duration * 1000 + 120 : 1200;
  fallbackTimer = window.setTimeout(finish, duration);
  playStoryCue('camera');
}

function playInterfaceHoverSound(target, isPress = false) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  interfaceAudioContext ||= new AudioContextClass();
  const context = interfaceAudioContext;
  const playTone = () => {
    const stamp = performance.now();
    if ((!isPress && stamp < storyCueBusyUntil) || stamp - lastInterfaceSoundAt < (isPress ? 90 : 420) || stamp - (lastControlSoundAt.get(target) || 0) < (isPress ? 260 : 850)) return;
    lastInterfaceSoundAt = stamp;
    lastControlSoundAt.set(target, stamp);
    const now = context.currentTime;
    const tone = context.createOscillator();
    const gain = context.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(740, now);
    tone.frequency.exponentialRampToValueAtTime(988, now + .075);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.22, now + .014);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .19);
    tone.connect(gain);
    gain.connect(context.destination);
    interfaceSoundNodes.push(tone);
    tone.addEventListener('ended', () => { interfaceSoundNodes = interfaceSoundNodes.filter(node => node !== tone); }, { once: true });
    tone.start(now);
    tone.stop(now + .2);
  };
  const stamp = performance.now();
  if (target === lastHoverSoundTarget && stamp - lastHoverSoundAt < 260) return;
  lastHoverSoundTarget = target;
  lastHoverSoundAt = stamp;
  if (context.state === 'suspended') {
    context.resume().then(() => playTone()).catch(() => {});
  } else playTone();
}

function playTypewriterKey(context) {
  if (!context || context.state !== 'running') return;
  const now = context.currentTime;
  const length = 1920;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const tone = context.createOscillator();
  const toneGain = context.createGain();
  source.buffer = buffer;
  filter.type = 'highpass';
  filter.frequency.value = 720;
  gain.gain.setValueAtTime(.15, now);
  gain.gain.exponentialRampToValueAtTime(.001, now + .038);
  source.connect(filter).connect(gain).connect(context.destination);
  tone.type = 'triangle';
  tone.frequency.setValueAtTime(1480, now);
  tone.frequency.exponentialRampToValueAtTime(920, now + .034);
  toneGain.gain.setValueAtTime(.065, now);
  toneGain.gain.exponentialRampToValueAtTime(.0001, now + .04);
  tone.connect(toneGain).connect(context.destination);
  source.start(now);
  source.stop(now + .04);
  tone.start(now);
  tone.stop(now + .041);
}

function playMateraScrollCue() {
  const context = interfaceAudioContext;
  const stamp = performance.now();
  if (!context || stamp - lastMateraScrollCueAt < 180) return;
  lastMateraScrollCueAt = stamp;
  const play = () => {
    if (context.state !== 'running') return;
    const now = context.currentTime;
    const length = Math.floor(context.sampleRate * .085);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const noiseGain = context.createGain();
    const tone = context.createOscillator();
    const toneGain = context.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(980, now);
    filter.Q.value = .55;
    noiseGain.gain.setValueAtTime(.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(.075, now + .014);
    noiseGain.gain.exponentialRampToValueAtTime(.0001, now + .085);
    source.connect(filter).connect(noiseGain).connect(context.destination);
    tone.type = 'sine';
    tone.frequency.setValueAtTime(430, now);
    tone.frequency.exponentialRampToValueAtTime(290, now + .075);
    toneGain.gain.setValueAtTime(.0001, now);
    toneGain.gain.exponentialRampToValueAtTime(.06, now + .012);
    toneGain.gain.exponentialRampToValueAtTime(.0001, now + .08);
    tone.connect(toneGain).connect(context.destination);
    source.start(now);
    source.stop(now + .09);
    tone.start(now);
    tone.stop(now + .085);
  };
  if (context.state === 'suspended') context.resume().then(play).catch(() => {});
  else play();
}

function unlockInterfaceHoverSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  interfaceAudioContext ||= new AudioContextClass();
  const context = interfaceAudioContext;
  const syncState = () => {
    interfaceAudioUnlocked = context.state === 'running';
    document.body.dataset.audioState = context.state;
    if (interfaceAudioUnlocked) try { sessionStorage.setItem('portfolio-audio-unlocked', '1'); } catch {}
  };
  if (!context.storyStateBound) {
    context.storyStateBound = true;
    context.addEventListener('statechange', syncState);
  }
  syncState();
  if (context.state !== 'running' && context.state !== 'closed') context.resume().then(syncState).catch(syncState);
}

// Prepare the shared engine before any automatic section sequence starts.
// The browser can suspend a fresh visit until its first genuine interaction.
unlockInterfaceHoverSound();

document.addEventListener('pointerdown', event => {
  unlockInterfaceHoverSound();
  const control = soundTargetFrom(event.target);
  // A browser blocks audio until a real gesture. If the first hover happened
  // before audio was unlocked, play that control's cue on this first press;
  // after that, its hover cue works without another click.
  if (control) playInterfaceHoverSound(control, true);
}, { capture: true });
document.addEventListener('pointerdown', () => { lastInteractionModality = 'pointer'; }, { capture: true });
document.addEventListener('touchstart', () => { lastInteractionModality = 'pointer'; }, { capture: true, passive: true });
document.addEventListener('keydown', event => {
  if (event.key === 'Tab' || event.key.startsWith('Arrow') || event.key === 'Enter' || event.key === ' ') lastInteractionModality = 'keyboard';
  unlockInterfaceHoverSound();
}, { capture: true });
document.addEventListener('wheel', unlockInterfaceHoverSound, { capture: true, passive: true });
document.addEventListener('touchstart', unlockInterfaceHoverSound, { capture: true, passive: true });
// Browsers can suspend Web Audio when a tab is backgrounded. Once the visitor
// has enabled sound with a real gesture, resume the same context on return.
const resumeUnlockedStoryAudio = () => {
  if (!interfaceAudioContext || interfaceAudioContext.state === 'running' || interfaceAudioContext.state === 'closed') return;
  unlockInterfaceHoverSound();
};
document.addEventListener('visibilitychange', () => { if (!document.hidden) resumeUnlockedStoryAudio(); });
window.addEventListener('focus', resumeUnlockedStoryAudio);
const soundTargetFrom = target => target instanceof Element ? target.closest('.button-link, .gateway-link, .gateway-invite, .text-link, .intro-summary-continue, .gate-continue, .sant-id-next, .ux-tag-along, .scene-next, .journey-team-cta, .lens-trigger, .jd-logo-link, .site-header a, .site-header button, .portfolio-project-card, .portfolio-tabs button') : null;
document.addEventListener('pointermove', event => {
  if (event.isTrusted && event.pointerType !== 'touch') lastPhysicalPointerMoveAt = performance.now();
}, { passive: true });
// Scrolling can move a CTA under a stationary cursor and emit pointerover.
// Treat that as layout movement, not an intentional hover; require the user
// to move the pointer again after scrolling before a hover cue can play.
window.addEventListener('scroll', () => { lastPointerScrollAt = performance.now(); }, { capture: true, passive: true });
document.addEventListener('pointerover', event => {
  const control = soundTargetFrom(event.target);
  const now = performance.now();
  const pointerRecentlyMoved = now - lastPhysicalPointerMoveAt < 700;
  const pointerMovedAfterScroll = lastPhysicalPointerMoveAt > lastPointerScrollAt;
  const notScrollSettling = now - lastPointerScrollAt > 180;
  if (event.isTrusted && event.pointerType !== 'touch' && control && pointerRecentlyMoved && pointerMovedAfterScroll && notScrollSettling && !control.contains(event.relatedTarget)) playInterfaceHoverSound(control);
});
document.addEventListener('focusin', event => {
  const control = soundTargetFrom(event.target);
  if (control && lastInteractionModality === 'keyboard') playInterfaceHoverSound(control);
});

function image(path, alt, className = '', eager = false) {
  return `<img class="${className}" src="${ASSET}${path}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

function character(state, className = '', eager = false) {
  const pose = avatarStates[state];
  if (!pose) return '';
  return image(pose.src, pose.alt, className, eager);
}

function renderHome() {
  document.body.dataset.page = 'journey';
  main.innerHTML = `
    <section class="hero-gateway" id="gateway" data-pose="fingers" aria-label="Choose how to meet Shruti">
      <nav class="gateway-menu" aria-label="Quick links">
        <a class="gateway-link" href="${ASSET}shruti-kumari-resume.pdf" data-gaze="left">Résumé <span aria-hidden="true">↗</span></a>
        <a class="gateway-link" href="/portfolio" data-route="/portfolio">Portfolio <span aria-hidden="true">↗</span></a>
        <a class="gateway-link" href="/contact" data-route="/contact" data-gaze="left">Connect <span aria-hidden="true">↗</span></a>
        <button class="gateway-invite" type="button" aria-describedby="gateway-reply">Come along <span aria-hidden="true">↓</span></button>
      </nav>
      <audio class="gateway-hello-audio" preload="auto" src="${ASSET}avatar-hello.wav" aria-hidden="true"></audio>
      <div class="gateway-character" aria-hidden="true">
        ${image('gateway-frame-01-fingertips.webp', '', 'gateway-frame gateway-fingers', true)}
        ${image('gateway-frame-02-curious-peek.webp', '', 'gateway-frame gateway-curious', true)}
        ${image('gateway-frame-02-curious-left.webp', '', 'gateway-frame gateway-curious-left', true)}
        ${image('gateway-frame-03-happy-smile.webp', '', 'gateway-frame gateway-happy', true)}
        <svg class="gateway-frame gateway-blink-frame gateway-blink-curious" viewBox="0 0 1024 1536" width="1024" height="1536" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" data-blink-src="${ASSET}gateway-curious-blink.png"><defs><filter id="gateway-curious-soft"><feGaussianBlur stdDeviation="3.5"/></filter><mask id="gateway-curious-eyes" maskUnits="userSpaceOnUse"><g fill="white" filter="url(#gateway-curious-soft)"><ellipse cx="676" cy="544" rx="76" ry="57"/><ellipse cx="842" cy="437" rx="64" ry="65"/></g></mask></defs><image href="${ASSET}gateway-curious-blink.png" width="1024" height="1536" mask="url(#gateway-curious-eyes)"/></svg>
        <svg class="gateway-frame gateway-blink-frame gateway-blink-happy" viewBox="0 0 1024 1536" width="1024" height="1536" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" data-blink-src="${ASSET}gateway-happy-blink.png"><defs><filter id="gateway-happy-soft"><feGaussianBlur stdDeviation="3.5"/></filter><mask id="gateway-happy-eyes" maskUnits="userSpaceOnUse"><g fill="white" filter="url(#gateway-happy-soft)"><ellipse cx="676" cy="544" rx="76" ry="57"/><ellipse cx="842" cy="437" rx="64" ry="65"/></g></mask></defs><image href="${ASSET}gateway-happy-blink.png" width="1024" height="1536" mask="url(#gateway-happy-eyes)"/></svg>
      </div>
      <p class="gateway-reply" id="gateway-reply" aria-live="polite"></p>
    </section>

    <div class="journey-content" id="journey-content" hidden>
      <section class="intro-scene" id="top" aria-label="Meet Shruti">
        <div class="intro-avatar" id="intro-avatar">
          <video class="intro-speaking intro-speaking-video" playsinline muted preload="auto" fetchpriority="high" aria-label="Shruti turns to face the visitor and introduces herself" poster="https://d2ol7oe51mr4n9.cloudfront.net/user_3HGZD0LKCjtuivCHwrpylyAJpwf/ff287a48-2da0-4e6e-ab9c-d777297ed19c.jpg">
            <source src="https://d2ol7oe51mr4n9.cloudfront.net/user_3HGZD0LKCjtuivCHwrpylyAJpwf/f690f897-a5f5-4ccb-9bcb-192939d117af.mp4" type="video/mp4">
          </video>
        </div>
        <audio class="intro-narration-audio" preload="auto" src="https://d8j0ntlcm91z4.cloudfront.net/user_3HGZD0LKCjtuivCHwrpylyAJpwf/hf_20261001_210437_54bc9ee3-38d4-4a14-916d-cc21ceeddbf6.wav" aria-hidden="true"></audio>
        <div class="intro-copy">
          <p class="eyebrow intro-cue" data-intro-at="2.6">About me</p>
          <h1><span class="intro-cue intro-heading-word" data-intro-at="3.4">Hi,</span> <span class="intro-cue intro-heading-word" data-intro-at="3.8">I’m</span><br><em><span class="intro-cue intro-heading-word" data-intro-at="4.3">Shruti.</span></em></h1>
          <p class="intro-static-copy"><span class="intro-copy-chunk intro-cue" data-intro-at="5.6">I've always been a little too curious for my own good.</span><span class="intro-copy-chunk intro-cue" data-intro-at="7.4">And somehow, that turned into a career in design.</span></p>
          <div class="intro-summary-action" inert>
            <a class="intro-summary-continue" href="#nift" aria-hidden="true">Tag along <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <button class="intro-skip" type="button" hidden>Skip intro <span aria-hidden="true">↓</span></button>
      </section>

    <section class="landing-scene nift-section" id="nift" aria-label="NIFT taught Shruti to notice">
      <div class="nift-scene" data-topic="idle" data-prelude="first">
        <div class="nift-prelude" aria-live="polite" aria-atomic="true">
          <div class="nift-prelude-line nift-prelude-first" aria-label="I didn't just learn to look. I learned what to look for."><span>I didn't just learn to look.</span><em> I learned what to look for.</em></div>
          <div class="nift-prelude-line nift-prelude-logo" aria-label="National Institute of Fashion Technology"><img src="${ASSET}NIFT_official_logo.svg" alt="NIFT logo" width="316" height="316"></div>
          <p class="nift-prelude-line nift-prelude-third ux-typewriter" aria-live="polite" aria-atomic="true">Turns out, there's a lot more to seeing.</p>
        </div>
        <div class="nift-plates" aria-hidden="true">
          <img class="nift-plate plate-composition" src="${ASSET}nift-composition-scene.png" alt="" fetchpriority="high">
          <img class="nift-plate plate-colour" src="${ASSET}nift-colour-scene.png" alt="" loading="lazy">
          <img class="nift-plate plate-stories" src="${ASSET}nift-stories-scene.png" alt="" loading="lazy">
          <img class="nift-plate plate-details" src="${ASSET}nift-details-scene.png" alt="" loading="lazy">
        </div>
        <p class="nift-overline">where I started</p>
        <div class="nift-figure">
          <div class="nift-avatar-pair" role="img" aria-label="Shruti holding her camera with a warm, inviting smile">
            <img class="nift-avatar nift-avatar-open" src="${ASSET}nift-camera-peek-inviting.png" alt="" aria-hidden="true" fetchpriority="high">
            <img class="nift-avatar nift-avatar-blink" src="${ASSET}nift-camera-peek-blink.png" alt="" aria-hidden="true">
          </div>
          <button class="lens-trigger" type="button" aria-label="Reveal NIFT Fashion Communication in Shruti’s camera lens" aria-expanded="false"><span class="lens-label">NIFT</span><span class="lens-reveal">Fashion<br>Communication</span></button>
        </div>
        <div class="nift-voice"><p class="avatar-dialogue"><span>Shruti</span><em>“I thought I was learning to make images. I was learning to notice.”</em></p></div>
        <div class="topic-controls" role="group" aria-label="Change the learning scene around Shruti">
          <button type="button" data-topic-choice="composition" aria-pressed="false">Composition</button>
          <button type="button" data-topic-choice="colour" aria-pressed="false">Colour</button>
          <button type="button" data-topic-choice="stories" aria-pressed="false">Storytelling</button>
          <button type="button" data-topic-choice="details" aria-pressed="false">Details</button>
        </div>
        <p class="topic-caption" aria-live="polite">Framing · balance · visual hierarchy</p>
        <a class="scene-next" href="#chandigarh-gate" aria-label="Continue to the industry experience invitation">↓</a>
      </div>
    </section>

    <section class="chapter-gate" id="chandigarh-gate" data-stage="waiting" aria-label="Continue to Chandigarh">
      <div class="gate-opening">
        <p class="eyebrow gate-eyebrow" aria-label="The next chapter">The next chapter</p>
        <p class="gate-thought" aria-label="Learning it was one thing. Doing it for real? Another."><span class="gate-copy-line gate-copy-line--one" aria-hidden="true">Learning it was one thing.</span><strong class="gate-copy-line gate-copy-line--highlight" aria-hidden="true">Doing it for real?</strong><span class="gate-copy-line gate-copy-line--last" aria-hidden="true">Another.</span></p>
        <button class="button-link gate-continue" type="button" tabindex="-1">Off to my first internship <span aria-hidden="true">↓</span></button>
      </div>
    </section>

    <section class="chandigarh-arrival" id="chandigarh" aria-label="Shruti arrives in Chandigarh" tabindex="-1">
      <audio class="story-cue story-cue--landing" src="${ASSET}jump-landing-thud.wav" preload="auto"></audio>
      <div class="arrival-sky" aria-hidden="true"></div>
      <div class="arrival-copy" aria-live="polite">
        <div class="arrival-location" aria-label="Chandigarh, June to August 2025">
          <svg class="arrival-location-pin" viewBox="0 0 24 30" aria-hidden="true"><path d="M12 29S2 17.5 2 11a10 10 0 1 1 20 0c0 6.5-10 18-10 18Z"/><circle cx="12" cy="11" r="3.2"/></svg>
          <p class="arrival-city" aria-label="Chandigarh, June to August 2025"><span class="arrival-place"></span><span class="arrival-date"></span></p>
        </div>
        <h2 class="arrival-caption" aria-label="Okay. Time to put it all to work."></h2>
      </div>
      <span class="arrival-scene-shadow" aria-hidden="true"></span>
      <div class="arrival-avatar" aria-hidden="true">
        <img class="arrival-sequence-frame arrival-frame--drop" src="${ASSET}chandigarh-drop-entry-aligned.png" alt="" width="1493" height="1054" fetchpriority="high">
        <img class="arrival-sequence-frame arrival-frame--midair" src="${ASSET}chandigarh-drop-midair-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--impact" src="${ASSET}chandigarh-touchdown-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--recover" src="${ASSET}chandigarh-walk-recover-aligned.png" alt="" width="1493" height="1053" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-one" src="${ASSET}chandigarh-walk-left-lead-blink-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-two" src="${ASSET}chandigarh-walk-pass-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-three" src="${ASSET}chandigarh-walk-next-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
      </div>
    </section>

    <section class="sant-preview sant-id-chapter" id="sant-rams" aria-label="Shruti proudly shows her first internship ID">
      <audio class="story-cue story-cue--camera" src="${ASSET}iphone-camera-capture-v2.wav" preload="auto"></audio>
      <div class="sant-id-headline" aria-live="polite">
        <p class="sant-id-lead">From classroom ideas to a real brand.</p>
        <h2><span class="sant-id-company-line"></span></h2>
      <div class="sant-id-actions">
          <a class="button-link sant-id-next" href="#design-shift" tabindex="-1">Keep going <span aria-hidden="true">↓</span></a>
          <a class="text-link sant-id-deeper" href="/experience/sant-rams" tabindex="-1">See what I worked on <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="sant-id-avatar" data-id-pose="down" aria-hidden="true">
        <img class="sant-id-frame sant-id-frame--down" src="${ASSET}sant-id-look-down.png" alt="" width="1494" height="1053" fetchpriority="high">
        <img class="sant-id-frame sant-id-frame--show" src="${ASSET}sant-id-show.png" alt="" width="1494" height="1052" loading="eager" decoding="async">
      </div>
      <article class="sant-id-detail-card" aria-label="Shruti Singh, Visual Design Intern at Sant Ram’s Jewellers">
        <span class="sant-id-logo-wrap"><img class="sant-id-detail-logo" src="https://santrams.in/wp-content/uploads/2023/06/SANT-RAMS-LOGO.png" alt="Sant Ram’s Jewellers" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="sant-id-logo-fallback" hidden>SANT RAM’S</span></span>
        <div class="sant-id-detail-photo"><img src="${ASSET}sant-id-show.png" alt="" loading="eager" decoding="async"></div>
        <strong>SHRUTI</strong>
        <span>VISUAL COMMUNICATION<br>DESIGN INTERN</span>
        <small>SANT RAM’S JEWELLERS</small>
        <i>CHANDIGARH · 2025</i>
      </article>
      <p class="sr-only">Shruti Singh, Visual Design Intern at Sant Ram’s Jewellers, June to August 2025.</p>
    </section>

    <section class="ux-transition" id="design-shift" aria-label="Shruti's shift from visual design to user experience design" data-step="0">
      <div class="ux-transition-sticky">
        <p class="ux-transition-kicker">A quieter question, underneath the work</p>
        <div class="ux-transition-thesis" aria-label="I loved making things look good. But something kept bothering me."><p><span class="ux-typewriter" data-type-text>I loved making things look good.</span></p><p><em><span class="ux-typewriter" data-type-text>But something kept bothering me.</span></em></p></div>
        <div class="ux-thinking-avatar" aria-hidden="true">
          <img class="ux-thinker-looks-good" src="${ASSET}avatar-research-looks-good.png" alt="" width="1536" height="1024" loading="eager" decoding="async">
          <img class="ux-thinker-questioning" src="${ASSET}avatar-research-questioning.png" alt="" width="1536" height="1024" loading="eager" decoding="async">
          <img class="ux-thinker-gaze" src="${ASSET}avatar-research-new-gaze.png" alt="" width="1536" height="1024" loading="eager" decoding="async">
          <img class="ux-thinker-bridge" src="${ASSET}avatar-research-bridge.png" alt="" width="1536" height="1024" loading="eager" decoding="async">
          <img class="ux-thinker-realisation" src="${ASSET}avatar-research-solve-open.png" alt="" width="1536" height="1024" loading="eager" decoding="async">
          <img class="ux-thinker-solve-blink" src="${ASSET}avatar-research-solve-blink.png" alt="" width="1536" height="1024" loading="eager" decoding="async">
          <img class="ux-thinker-blink" src="${ASSET}avatar-research-new-blink.png" alt="" width="1536" height="1024" loading="eager" decoding="async">
        </div>
        <div class="ux-question-marks" aria-hidden="true"><span class="ux-question-mark">?</span><span class="ux-question-mark">?</span><span class="ux-question-mark">?</span><span class="ux-question-mark">?</span></div>
        <div class="ux-thought-field" aria-live="polite">
          <p class="ux-thought ux-thought--one" data-question="0">Would someone know what to do here?</p>
          <p class="ux-thought ux-thought--two" data-question="1">What if they got stuck?</p>
          <p class="ux-thought ux-thought--three" data-question="2">Wait. Am I solving the right problem?</p>
          <p class="ux-thought ux-thought--four" data-question="3">That’s when I started looking beyond the screen.</p>
          <div class="ux-final-thought"><div class="ux-final-copy"><p>And a lot closer at people.</p><a class="button-link ux-tag-along" href="#janitri-gate">Follow the questions <span aria-hidden="true">↓</span></a></div></div>
        </div>
      </div>
    </section>

    <section class="chapter-gate janitri-gate" id="janitri-gate" data-stage="waiting" aria-label="Continue to Janitri Innovations">
      <div class="gate-opening">
        <p class="eyebrow gate-eyebrow" aria-label="The next chapter">The next chapter</p>
        <p class="gate-thought" aria-label="I wanted to know what design could actually change."><span class="gate-copy-line gate-copy-line--one" aria-hidden="true">I wanted to know what</span><strong class="gate-copy-line gate-copy-line--highlight" aria-hidden="true">design could actually change.</strong></p>
        <button class="button-link gate-continue" type="button" tabindex="-1">Let’s find out <span aria-hidden="true">↓</span></button>
      </div>
    </section>

    <section class="chandigarh-arrival janitri-arrival" id="bengaluru-arrival" aria-label="Shruti arrives in Bengaluru" tabindex="-1">
      <div class="arrival-sky" aria-hidden="true"></div>
      <div class="arrival-copy" aria-live="polite">
        <div class="arrival-location" aria-label="Bengaluru, December 2025 to April 2026">
          <svg class="arrival-location-pin" viewBox="0 0 24 30" aria-hidden="true"><path d="M12 29S2 17.5 2 11a10 10 0 1 1 20 0c0 6.5-10 18-10 18Z"/><circle cx="12" cy="11" r="3.2"/></svg>
          <p class="arrival-city" aria-label="Bengaluru, December 2025 to April 2026"><span class="arrival-place"></span><span class="arrival-date"></span></p>
        </div>
        <h2 class="arrival-caption" aria-label="New city. New problems. Much bigger questions."></h2>
      </div>
      <span class="arrival-scene-shadow" aria-hidden="true"></span>
      <div class="arrival-avatar" aria-hidden="true">
        <img class="arrival-sequence-frame arrival-frame--drop" src="${ASSET}chandigarh-drop-entry-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--midair" src="${ASSET}chandigarh-drop-midair-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--impact" src="${ASSET}chandigarh-touchdown-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--recover" src="${ASSET}chandigarh-walk-recover-aligned.png" alt="" width="1493" height="1053" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-one" src="${ASSET}chandigarh-walk-left-lead-blink-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-two" src="${ASSET}chandigarh-walk-pass-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-three" src="${ASSET}chandigarh-walk-next-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
      </div>
    </section>

    <section class="sant-id-chapter janitri-id-chapter" id="janitri" aria-label="Shruti shows her Janitri internship ID">
      <div class="sant-id-headline" aria-live="polite">
        <p class="sant-id-lead">This time, design meant something different.</p>
        <h2><span class="sant-id-company-line"></span></h2>
        <div class="sant-id-actions">
          <a class="button-link sant-id-next" href="#next-reflection" tabindex="-1">Keep going <span aria-hidden="true">↓</span></a>
          <a class="text-link sant-id-deeper" href="/experience/janitri" tabindex="-1">Step inside <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="sant-id-avatar" data-id-pose="down" aria-hidden="true">
        <img class="sant-id-frame sant-id-frame--down" src="${ASSET}sant-id-look-down.png" alt="" width="1494" height="1053" loading="eager" decoding="async">
        <img class="sant-id-frame sant-id-frame--show" src="${ASSET}sant-id-show.png" alt="" width="1494" height="1052" loading="eager" decoding="async">
      </div>
      <article class="sant-id-detail-card janitri-id-card" aria-label="Shruti, UI/UX Design Intern at Janitri Innovations">
        <img class="janitri-id-logo" src="https://cdn.prod.website-files.com/637a0e4c359e1d804d8ec5b7/65afb2e7e04845c25685113d_Janitri%20logo.webp" alt="Janitri">
        <div class="sant-id-detail-photo"><img src="${ASSET}sant-id-show.png" alt="" loading="eager" decoding="async"></div>
        <strong>SHRUTI</strong>
        <span>UI/UX DESIGN<br>INTERN</span>
        <small>JANITRI INNOVATIONS PVT. LTD.</small>
        <i>BENGALURU · 2025—26</i>
      </article>
      <p class="sr-only">Shruti, UI/UX Design Intern at Janitri Innovations, Bengaluru, December 2025 to April 2026.</p>
    </section>

    <section class="next-reflection" id="next-reflection" aria-label="The next chapter" tabindex="-1">
      <p class="eyebrow ux-typewriter" data-reflection-line="The next chapter"></p>
      <h2><span class="ux-typewriter" data-reflection-line="Just when I thought I had it figured out…"></span></h2>
      <p class="next-reflection-copy"><span class="ux-typewriter" data-reflection-line="A new question was already waiting."></span></p>
    </section>

    <section class="chandigarh-arrival next-journey" id="next-journey" aria-label="Where the journey goes next" tabindex="-1">
      <div class="arrival-avatar" aria-hidden="true">
        <img class="arrival-sequence-frame arrival-frame--drop" src="${ASSET}chandigarh-drop-entry-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--midair" src="${ASSET}chandigarh-drop-midair-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--impact" src="${ASSET}chandigarh-touchdown-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--recover" src="${ASSET}chandigarh-walk-recover-aligned.png" alt="" width="1493" height="1053" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-one" src="${ASSET}chandigarh-walk-left-lead-blink-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-two" src="${ASSET}chandigarh-walk-pass-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
        <img class="arrival-sequence-frame arrival-frame--stride-three" src="${ASSET}chandigarh-walk-next-aligned.png" alt="" width="1493" height="1054" loading="eager" decoding="async">
      </div>
      <div class="next-journey-copy">
        <p class="eyebrow">The journey so far</p>
        <h2>So, where to next?</h2>
        <ol class="journey-stops"><li class="journey-stop"><svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 29S2 17.5 2 11a10 10 0 1 1 20 0c0 6.5-10 18-10 18Z"/><circle cx="12" cy="11" r="3.2"/></svg><a class="text-link" href="#nift">NIFT<span aria-hidden="true">↗</span></a></li><li class="journey-stop"><svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 29S2 17.5 2 11a10 10 0 1 1 20 0c0 6.5-10 18-10 18Z"/><circle cx="12" cy="11" r="3.2"/></svg><a class="text-link" href="#sant-rams">Sant Ram’s<span aria-hidden="true">↗</span></a></li><li class="journey-stop"><svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 29S2 17.5 2 11a10 10 0 1 1 20 0c0 6.5-10 18-10 18Z"/><circle cx="12" cy="11" r="3.2"/></svg><a class="text-link" href="#janitri">Janitri Innovations<span aria-hidden="true">↗</span></a></li></ol>
        <div class="journey-invitation" inert>
          <a class="button-link journey-team-cta" href="mailto:Shruti786aaa@gmail.com" aria-label="Your team? Connect with Shruti">
            <span class="journey-next-label">NEXT</span><span class="journey-team-label">YOUR TEAM?</span><span aria-hidden="true">↗</span>
          </a>
          <p class="journey-team-note">WHAT IF IT’S<br>WITH YOU?</p>
        </div>
      </div>
    </section>

    <section class="next-ending" id="next-ending" aria-label="The next chapter">
      <div class="next-ending-inner">
        <p class="eyebrow next-ending-kicker">Next chapter</p>
        <p class="next-ending-room">room for one more.</p>
        <p class="next-ending-copy">I’m looking for a team to ask better questions with, challenge ideas, and build things that make a difference.</p>
        <div class="next-ending-actions">
          <a class="button-link" href="mailto:Shruti786aaa@gmail.com">Let’s make something together <span aria-hidden="true">↗</span></a>
          <a class="text-link next-process-cta" href="/design-process" hidden>My design process <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    </div>`;
  bindGateway();
  restoreJourneyPosition();
}

function bindGateway() {
  const gateway = document.querySelector('.hero-gateway');
  if (!gateway) return;
  const invite = gateway.querySelector('.gateway-invite');
  const reply = gateway.querySelector('.gateway-reply');
  const helloAudio = gateway.querySelector('.gateway-hello-audio');
  if (helloAudio) helloAudio.volume = 1;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) gateway.classList.add('is-ready');
  else invite.addEventListener('animationend', event => {
    if (event.target === invite && event.animationName === 'gateway-arrive') {
      gateway.classList.add('is-ready');
    }
  }, { once: true });
  let revealTimer;
  let retreatTimer;
  let activeIntent = '';
  let blinkTimer;
  const blinkAssets = [...gateway.querySelectorAll('[data-blink-src]')].map(layer => {
    const asset = new Image(); asset.src = layer.dataset.blinkSrc; return asset;
  });
  const stopGatewayBlink = () => { clearTimeout(blinkTimer); delete gateway.dataset.blink; };
  const scheduleGatewayBlink = (delay = 3000 + Math.random() * 1700) => {
    clearTimeout(blinkTimer);
    if (reducedMotion || document.hidden || gateway.classList.contains('is-entering') || gateway.dataset.pose === 'fingers') return;
    blinkTimer = window.setTimeout(() => {
      if (!gateway.isConnected || document.hidden || gateway.classList.contains('is-entering') || gateway.dataset.pose === 'fingers') return;
      if (!blinkAssets.every(asset => asset.complete && asset.naturalWidth > 0)) { scheduleGatewayBlink(800); return; }
      gateway.dataset.blink = 'closed';
      blinkTimer = window.setTimeout(() => { delete gateway.dataset.blink; scheduleGatewayBlink(); }, 135);
    }, delay);
  };
  document.addEventListener('visibilitychange', () => { stopGatewayBlink(); if (!document.hidden) scheduleGatewayBlink(1200); });
  window.addEventListener('pagehide', stopGatewayBlink);

  const playHello = () => {
    if (!helloAudio) return;
    helloAudio.volume = 1;
    if (!helloAudio.paused && !helloAudio.ended) return;
    helloAudio.currentTime = 0;
    helloAudio.play().catch(() => {});
  };
  const clearMotionTimers = () => {
    clearTimeout(revealTimer);
    clearTimeout(retreatTimer);
  };
  const setPose = pose => { stopGatewayBlink(); gateway.dataset.pose = pose; if (pose !== 'fingers') scheduleGatewayBlink(1100); };
  const setGaze = gaze => {
    if (gaze === 'left') {
      gateway.dataset.gaze = 'left';
      return;
    }
    delete gateway.dataset.gaze;
  };
  const beginPeek = (mode, gaze = '', speak = false) => {
    clearMotionTimers();
    activeIntent = mode;
    gateway.dataset.intent = mode;
    setGaze(gaze);
    reply.textContent = '';
    setPose('fingers');
    if (mode === 'menu') {
      revealTimer = window.setTimeout(() => {
        if (activeIntent !== 'menu') return;
        setPose('curious');
      }, reducedMotion ? 0 : 170);
    } else {
      setPose('happy');
      reply.textContent = 'Hello!';
      if (speak) playHello();
    }
  };
  const returnToFingers = () => {
    if (gateway.classList.contains('is-entering')) return;
    if (gateway.querySelector('.gateway-link:hover, .gateway-invite:hover, .gateway-link:focus-visible, .gateway-invite:focus-visible')) return;
    clearMotionTimers();
    if (helloAudio) {
      helloAudio.pause();
      helloAudio.currentTime = 0;
    }
    activeIntent = '';
    delete gateway.dataset.intent;
    reply.textContent = '';
    retreatTimer = window.setTimeout(() => {
      setPose('fingers');
      setGaze('');
    }, reducedMotion ? 0 : 90);
  };
  gateway.addEventListener('pointerover', event => {
    const link = event.target.closest('.gateway-link');
    if (!link || link.contains(event.relatedTarget)) return;
    beginPeek('menu', link.dataset.gaze);
  });
  gateway.addEventListener('focusin', event => {
    const link = event.target.closest('.gateway-link');
    if (link) beginPeek('menu', link.dataset.gaze);
  });
  invite.addEventListener('pointerenter', event => beginPeek('invite', '', event.pointerType === 'mouse' || event.pointerType === 'pen'));
  invite.addEventListener('focus', () => beginPeek('invite'));
  gateway.querySelectorAll('.gateway-link, .gateway-invite').forEach(control => {
    control.addEventListener('pointerleave', () => window.setTimeout(returnToFingers, 70));
    control.addEventListener('blur', () => window.setTimeout(returnToFingers, 70));
  });
  invite.addEventListener('click', () => {
    const story = document.getElementById('journey-content');
    document.body.classList.add('story-open');
    story.hidden = false;
    story.classList.add('is-revealed');
    stopGatewayBlink();
    gateway.classList.add('is-entering');
    bindHomeInteractions();
    bindScrollStory();
    observeReveal();
    // The intro begins behind the fading gateway on the same click. This lets
    // Shruti turn while the gateway clears, so speech lands after the reveal.
    requestAnimationFrame(() => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      startIntroAvatar();
      requestAnimationFrame(() => { root.style.scrollBehavior = previousScrollBehavior; });
    });
    const finishEntrance = () => {
      gateway.hidden = true;
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finishEntrance();
    else {
      const onEntranceEnd = event => {
        if (event.target !== gateway || event.animationName !== 'gateway-out') return;
        gateway.removeEventListener('animationend', onEntranceEnd);
        finishEntrance();
      };
      gateway.addEventListener('animationend', onEntranceEnd);
    }
  });
}

function startIntroAvatar() {
  const wrap = document.getElementById('intro-avatar');
  if (!wrap || wrap.dataset.observing === 'true') return;
  const video = wrap.querySelector('.intro-speaking-video');
  const narration = document.querySelector('.intro-narration-audio');
  const scene = wrap.closest('.intro-scene');
  const continueAction = document.querySelector('.intro-summary-action');
  const continueLink = continueAction?.querySelector('.intro-summary-continue');
  const skipButton = scene?.querySelector('.intro-skip');
  if (!video || !narration || !scene || !continueAction || !continueLink || !skipButton) return;
  const guideIntroContinue = () => guideStoryChoices(scene, [continueLink], () => continueLink.click());
  wrap.dataset.observing = 'true';
  video.muted = true;
  video.volume = 0;
  let visible = false;
  let active = false;
  let preparing = false;
  let finished = false;
  let hasStarted = false;
  let narrationUnavailable = false;
  let generation = 0;
  let narrationStartTimer;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrationDelay = 2.05;
  const narrationRate = 1.25;
  const introCues = [...scene.querySelectorAll('[data-intro-at]')];
  const syncIntroCopy = () => {
    const timeline = reducedMotion ? narration.currentTime / narrationRate : video.currentTime;
    introCues.forEach(cue => cue.classList.toggle('is-visible', timeline >= Number(cue.dataset.introAt)));
    const canSkip = !finished && timeline >= 0.8;
    skipButton.hidden = !canSkip;
    skipButton.classList.toggle('is-visible', canSkip);
  };
  let cueFrame = 0;
  const animateIntroCopy = () => {
    if (!active) return;
    syncIntroCopy();
    cueFrame = requestAnimationFrame(animateIntroCopy);
  };
  const waitForPresentedFrame = () => new Promise(resolve => {
    let settled = false;
    const finish = ready => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(ready);
    };
    const timeout = window.setTimeout(() => finish(video.readyState >= 2 && video.videoWidth > 0), 3500);
    if (typeof video.requestVideoFrameCallback === 'function') {
      video.requestVideoFrameCallback(() => finish(true));
    } else if (video.readyState >= 2 && video.videoWidth > 0) {
      requestAnimationFrame(() => finish(true));
    } else {
      video.addEventListener('loadeddata', () => requestAnimationFrame(() => finish(video.videoWidth > 0)), { once: true });
    }
  });
  const waitUntilReady = media => {
    if (media.readyState >= 3) return Promise.resolve();
    return new Promise(resolve => {
      const done = () => resolve();
      media.addEventListener('canplay', done, { once: true });
      media.addEventListener('error', done, { once: true });
      window.setTimeout(done, 5000);
    });
  };
  const finish = () => {
    const voiceFinished = narration.ended || narrationUnavailable;
    if (!active || (reducedMotion ? !voiceFinished : (!video.ended || !voiceFinished))) return;
    active = false;
    finished = true;
    cancelAnimationFrame(cueFrame);
    syncIntroCopy();
    video.pause();
    narration.pause();
    continueAction.inert = false;
    continueAction.querySelector('.intro-summary-continue').removeAttribute('aria-hidden');
    continueAction.classList.add('is-ready');
    scene.classList.add('intro-finished');
    skipButton.hidden = true;
    guideIntroContinue();
  };
  const stop = () => {
    generation += 1;
    preparing = false;
    if (active) active = false;
    clearTimeout(narrationStartTimer);
    cancelAnimationFrame(cueFrame);
    video.pause();
    narration.pause();
  };
  skipButton.addEventListener('click', () => {
    if (finished) return;
    stop();
    finished = true;
    if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = video.duration;
    introCues.forEach(cue => cue.classList.add('is-visible'));
    continueAction.inert = false;
    continueAction.querySelector('.intro-summary-continue').removeAttribute('aria-hidden');
    continueAction.classList.add('is-ready');
    scene.classList.add('intro-finished');
    skipButton.hidden = true;
    guideIntroContinue();
  });
  const play = async () => {
    if (!visible || active || preparing || finished) return;
    preparing = true;
    narrationUnavailable = false;
    const run = ++generation;
    video.pause();
    narration.pause();
    if (!hasStarted) {
      video.currentTime = 0;
      narration.currentTime = 0;
    } else if (!reducedMotion) {
      narration.currentTime = Math.max(0, (video.currentTime - narrationDelay) * narrationRate);
    }
    if (reducedMotion) narration.load();
    if (reducedMotion) await waitUntilReady(narration);
    if (run !== generation || !visible) return;
    preparing = false;
    // Shorten the pause before speech and tighten the longer narration pauses
    // so the voice follows the clip's lip movement more closely.
    video.playbackRate = 1;
    narration.playbackRate = narrationRate;
    narration.preservesPitch = true;
    if (reducedMotion) {
      video.pause();
      video.currentTime = 0;
      active = true;
      narration.play().then(animateIntroCopy).catch(() => { narrationUnavailable = true; finish(); });
      hasStarted = true;
    } else {
      wrap.classList.add('has-talking-frame');
      // The source clip contains the earlier narration. Keep it muted so the
      // revised standalone Ainsley take is the only voice the visitor hears.
      video.muted = true;
      video.volume = 0;
      const started = await Promise.allSettled([video.play(), waitForPresentedFrame()]);
      if (run !== generation || !visible || started[0].status === 'rejected' || started[1].status === 'rejected' || !started[1].value) {
        stop();
        return;
      }
      active = true;
      hasStarted = true;
      animateIntroCopy();
      const remainingTurnPause = Math.max(0, narrationDelay * 1000 - video.currentTime * 1000);
      narrationStartTimer = window.setTimeout(() => {
        if (run === generation && visible && active) narration.play().catch(() => { narrationUnavailable = true; finish(); });
      }, remainingTurnPause);
    }
  };
  video.addEventListener('ended', finish);
  narration.addEventListener('ended', finish);
  narration.addEventListener('error', () => { narrationUnavailable = true; finish(); });
  video.addEventListener('error', () => {
    if (!finished) {
      finished = true;
      introCues.forEach(cue => cue.classList.add('is-visible'));
      continueAction.inert = false;
      continueAction.querySelector('.intro-summary-continue').removeAttribute('aria-hidden');
      continueAction.classList.add('is-ready');
      scene.classList.add('intro-finished');
      skipButton.hidden = true;
      guideIntroContinue();
    }
  }, { once: true });
  const observer = new IntersectionObserver(entries => {
    const entry = entries[0];
    if (entry.isIntersecting && entry.intersectionRatio >= 0.52) visible = true;
    else if (!entry.isIntersecting || entry.intersectionRatio < 0.18) visible = false;
    if (visible) play();
    else stop();
  }, { threshold: [0, 0.18, 0.52, 0.8] });
  observer.observe(scene);
}

function bindHomeInteractions() {
  bindNiftBlink();
  bindNiftNarration();
  bindNiftSceneSequence();
  bindNiftPrelude();
  bindChandigarhArrival();
  bindSantRamReveal();
  bindJanitriJourney();
  bindUxTransition();
  bindHowIThink();
  bindNextJourney();
  bindNextEnding();
  bindNextReflection();
  document.querySelectorAll('.next-process-cta').forEach(link => link.addEventListener('click', () => {
    history.replaceState(history.state, '', `${location.pathname}${location.search}#next-ending`);
  }));
  document.querySelectorAll('[data-topic-choice]').forEach(button => {
    const activate = () => setTopic(button.dataset.topicChoice);
    button.addEventListener('mouseenter', activate);
    button.addEventListener('focus', activate);
    button.addEventListener('click', activate);
  });
  const lens = document.querySelector('.lens-trigger');
  if (lens) {
    const openLens = () => { lens.setAttribute('aria-expanded', 'true'); lens.closest('.nift-scene').classList.add('is-lens-open'); };
    const closeLens = () => { lens.setAttribute('aria-expanded', 'false'); lens.closest('.nift-scene').classList.remove('is-lens-open'); };
    lens.addEventListener('mouseenter', openLens);
    lens.addEventListener('focus', openLens);
    lens.addEventListener('click', openLens);
    lens.addEventListener('mouseleave', () => { if (!lens.matches(':focus-visible') && !window.matchMedia('(hover: none)').matches) closeLens(); });
    lens.addEventListener('blur', closeLens);
  }
  const details = {
    mothers: 'Research and task flows for a B2C revamp that contributed to a released product with 10K+ Android downloads.',
    neonatal: 'Information architecture, user flows, interaction patterns and key interfaces for a neonatal care application.',
    doctors: 'Clinical information structured for rapid monitoring and decision-making.',
    matera: 'A nurse-facing maternal-care system shaped by hospital research, workflow thinking and product design.'
  };
  document.querySelectorAll('[data-desk]').forEach(button => {
    const reveal = () => {
    document.querySelectorAll('[data-desk]').forEach(item => { item.setAttribute('aria-pressed', String(item === button)); });
    document.getElementById('desk-detail-copy').textContent = details[button.dataset.desk];
    };
    button.addEventListener('mouseenter', reveal); button.addEventListener('focus', reveal); button.addEventListener('click', reveal);
  });
  document.querySelectorAll('[data-hobby]').forEach(button => {
    const tell = () => { document.querySelector('.hobby-note').textContent = button.dataset.hobby; };
    button.addEventListener('mouseenter', tell); button.addEventListener('focus', tell); button.addEventListener('click', tell);
  });
}

function bindNextReflection() {
  const section = document.getElementById('next-reflection');
  if (!section || section.dataset.bound) return;
  section.dataset.bound = 'true';
  const lines = [...section.querySelectorAll('[data-reflection-line]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speed = 62;
  let visible = false, elapsed = 0, last = 0, raf = 0, done = false, lastCount = 0;
  let offset = 350;
  const timings = lines.map(line => {
    const start = offset;
    offset += line.dataset.reflectionLine.length * speed + 350;
    return start;
  });
  const end = offset + 800;
  const tick = now => {
    if (!visible || document.hidden || !section.isConnected) { raf=0; last=0; return; }
    if (last) elapsed += now-last;
    last=now;
    let count=0, sound=false;
    lines.forEach((line,i) => {
      const copy=line.dataset.reflectionLine;
      const n=Math.min(copy.length,Math.max(0,Math.floor((elapsed-timings[i])/speed)));
      const text=copy.slice(0,n);
      if (text!==line.textContent && n && copy[n-1]!==' ') sound=true;
      line.textContent=text;
      line.classList.toggle('is-typing', elapsed>=timings[i] && elapsed<timings[i]+copy.length*speed+300);
      count+=n;
    });
    if (count>lastCount && sound && interfaceAudioContext?.state==='running') playTypewriterKey(interfaceAudioContext);
    lastCount=count;
    if (elapsed>=end) {
      done=true; raf=0;
      document.getElementById('next-journey')?.scrollIntoView({behavior:'smooth',block:'start'});
    } else raf=requestAnimationFrame(tick);
  };
  const resume=()=>{
    if (visible && !document.hidden && !done && !raf) { last=0;raf=requestAnimationFrame(tick); }
    else if (!visible || document.hidden) { cancelAnimationFrame(raf);raf=0;last=0; }
  };
  if (reduced) {
    lines.forEach(line=>{line.textContent=line.dataset.reflectionLine;});
    return;
  }
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting && entry.intersectionRatio>=.5;resume();},{threshold:[0,.5]}).observe(section);
  document.addEventListener('visibilitychange',resume);
}

function bindNextJourney() {
  const section = document.getElementById('next-journey');
  if (!section || section.dataset.bound) return;
  section.dataset.bound = 'true';
  const avatar = section.querySelector('.arrival-avatar');
  const stops = [...section.querySelectorAll('.journey-stop')];
  const invitation = section.querySelector('.journey-invitation');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let elapsed = 0, last = 0, raf = 0, visible = false, ready = false, cueIndex = 0;
  const pose = value => { avatar.dataset.pose = value; };
  let endSlateTimer = 0;
  const scheduleEndSlate = (delay, expectedTarget = '') => {
    window.clearTimeout(endSlateTimer);
    endSlateTimer = window.setTimeout(() => {
      if (!section.isConnected || document.hidden) return;
      if (expectedTarget) {
        const target = document.getElementById(expectedTarget);
        if (!target) return;
        const rect = target.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      }
      document.getElementById('next-ending')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    }, delay);
  };
  stops.forEach(stop => {
    const link = stop.querySelector('a');
    link?.addEventListener('click', event => {
      event.preventDefault();
      const destination = link.hash.slice(1);
      const target = document.getElementById(destination);
      if (!target) return;
      section.dataset.userActed = 'true';
      section.dataset.destinationChosen = destination;
      history.pushState(history.state, '', `#${destination}`);
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
      scheduleEndSlate(6500, destination);
    });
  });
  section.querySelector('.journey-team-cta')?.addEventListener('click', () => {
    section.dataset.userActed = 'true';
    window.clearTimeout(endSlateTimer);
  });
  const cues = [
    [0, () => { pose('drop'); section.classList.add('is-arriving'); playStoryCue('jump', false, section); }],
    [250, () => pose('midair')],
    [1220, () => { pose('impact'); section.classList.add('is-touchdown'); playStoryCue('touchdown'); }],
    [1600, () => pose('recover')],
    [2110, () => { pose('stride-cycle'); section.classList.remove('is-arriving','is-touchdown'); section.classList.add('is-landed','is-copy-visible'); }],
    ...stops.flatMap((stop, i) => [
      [2800 + i * 1000, () => stop.classList.add('is-dropping')],
      [3220 + i * 1000, () => { playStoryCue('location'); stop.classList.add('is-label-visible'); }]
    ]),
    [6100, () => {
      invitation.inert = false;
      section.classList.add('is-invitation-visible');
      if (section.dataset.userActed !== 'true') {
        const choices = [...section.querySelectorAll('.journey-stop a, .journey-team-cta')];
        guideStoryChoices(section, choices, () => scheduleEndSlate(0));
      }
    }]
  ].sort((a,b) => a[0]-b[0]);
  const tick = now => {
    if (!visible || document.hidden || !section.isConnected) { raf = 0; return; }
    if (last) elapsed += now-last;
    last = now;
    while (cueIndex < cues.length && elapsed >= cues[cueIndex][0]) cues[cueIndex++][1]();
    if (cueIndex < cues.length) raf = requestAnimationFrame(tick);
    else raf = 0;
  };
  const resume = () => {
    section.classList.toggle('is-paused', !visible || document.hidden);
    if (visible && !document.hidden && ready && !raf && cueIndex < cues.length) { last=0; raf=requestAnimationFrame(tick); }
    else if (!visible || document.hidden) { cancelAnimationFrame(raf); raf=0; last=0; }
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .3;
    resume();
  }, {threshold:[0,.3,.6]});
  if (reduced) {
    pose('recover'); section.classList.add('is-copy-visible','is-invitation-visible');
    stops.forEach(stop => stop.classList.add('is-dropping','is-label-visible'));
    invitation.inert=false;
  } else {
    Promise.allSettled([...avatar.querySelectorAll('img')].map(image => image.decode?.())).then(() => { ready=true; resume(); });
    observer.observe(section);
    document.addEventListener('visibilitychange', resume);
  }
}

function bindNextEnding() {
  const section = document.getElementById('next-ending');
  const copy = section?.querySelector('.next-ending-copy');
  if (!section || !copy || section.dataset.bound) return;
  section.dataset.bound = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fullCopy = copy.textContent.trim();
  let started = false;
  const typeCopy = () => {
    if (started) return;
    started = true;
    section.classList.add('is-visible');
    if (reduced) { section.classList.add('is-copy-complete'); return; }
    window.setTimeout(() => {
      if (!section.isConnected) return;
      copy.textContent = '';
      copy.classList.add('is-typing');
      const chars = Array.from(fullCopy);
      let index = 0;
      const interval = 31;
      const write = () => {
        if (!section.isConnected) return;
        const char = chars[index++];
        copy.textContent += char;
        if (char !== ' ' && interfaceAudioContext?.state === 'running') playTypewriterKey(interfaceAudioContext);
        if (index < chars.length) window.setTimeout(write, interval);
        else {
          copy.classList.remove('is-typing');
          section.classList.add('is-copy-complete');
        }
      };
      write();
    }, 560);
  };
  if (reduced) { typeCopy(); return; }
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= .35) typeCopy();
  }, { threshold: [.35, .6] }).observe(section);
}

function bindHowIThink() {
  const section = document.querySelector('.how-think');
  const film = section?.querySelector('.think-film');
  const video = section?.querySelector('.think-film-video');
  const caption = section?.querySelector('.think-film-caption');
  const beatCopy = section?.querySelector('.think-film-line');
  const replay = section?.querySelector('.think-film-replay');
  const ending = section?.querySelector('.think-ending');
  if (!section || !film || !video || !caption || !beatCopy || !ending) return;
  const syncFilmFill = () => {
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 12;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const corners = [[0, 0], [11, 0], [0, 11], [11, 11]].map(([x, y]) => {
        const offset = (y * canvas.width + x) * 4;
        return [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
      });
      const channels = [0, 1, 2].map(channel => corners.map(pixel => pixel[channel]).sort((a, b) => a - b).slice(1, 3).reduce((sum, value) => sum + value, 0) / 2);
      const fill = `#${channels.map(value => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
      section.style.setProperty('--think-film-fill', fill);
      film.style.setProperty('--think-film-fill', fill);
      film.querySelector('.think-film-media')?.style.setProperty('--think-film-fill', fill);
      video.style.setProperty('--think-film-fill', fill);
      const processBranch = document.querySelector('.design-process-branch');
      if (processBranch) {
        processBranch.style.setProperty('--think-film-fill', fill);
        processBranch.style.backgroundColor = fill;
        document.body.style.setProperty('--think-film-fill', fill);
        document.body.style.backgroundColor = fill;
        document.querySelector('main')?.style.setProperty('background-color', fill);
      }
      section.dataset.fillSynced = 'true';
    } catch (error) {
      // Keep the warm paper fallback if the browser cannot sample the video frame.
    }
  };
  const trySyncFilmFill = () => {
    if (section.dataset.fillSynced === 'true') return;
    if (typeof video.requestVideoFrameCallback === 'function' && video.readyState >= 2) {
      video.requestVideoFrameCallback(() => { syncFilmFill(); if (section.dataset.fillSynced !== 'true') requestAnimationFrame(trySyncFilmFill); });
    } else requestAnimationFrame(syncFilmFill);
  };
  video.addEventListener('loadeddata', trySyncFilmFill);
  video.addEventListener('playing', trySyncFilmFill);
  video.addEventListener('timeupdate', trySyncFilmFill);
  if (video.readyState >= 2) requestAnimationFrame(trySyncFilmFill);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const beats = [
    ['look', 'LOOK', 'Notice what’s there before deciding what to change.'],
    ['question', 'QUESTION', 'Ask what’s missing—and who it’s missing for.'],
    ['understand', 'UNDERSTAND', 'Find out what people need and what gets in their way.'],
    ['make', 'MAKE', 'Turn what you’ve learned into something people can use.'],
    ['test', 'TEST', 'See what works, notice what doesn’t, and make it clearer.'],
    ['learn', 'LEARN', 'Keep what you discovered. Let it shape the next version.']
  ];
  let current = false;
  let completed = false;
  let preludeTimer = 0;
  let preludeInterval = 0;
  let captionInterval = 0;
  let activeCaptionWord = '';
  let typingStarted = false;
  let filmStarted = false;
  let endingTimers = [];
  const processBranch = location.pathname.replace(/\/$/, '') === '/design-process';
  const prelude = section.querySelector('.think-film-prelude');
  const preludeText = 'Somewhere along the way, I found my way of figuring things out.';
  const typeCaption = word => {
    window.clearInterval(captionInterval);
    captionInterval = 0;
    activeCaptionWord = word;
    caption.textContent = '';
    caption.classList.add('is-typing');
    const characters = Array.from(word);
    let index = 0;
    captionInterval = window.setInterval(() => {
      if (!current) return;
      const character = characters[index++];
      caption.textContent += character;
      if (character !== ' ' && interfaceAudioContext?.state === 'running') playTypewriterKey(interfaceAudioContext);
      if (index >= characters.length) {
        window.clearInterval(captionInterval);
        captionInterval = 0;
        caption.classList.remove('is-typing');
      }
    }, 64);
  };
  const primePreludeAudio = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    interfaceAudioContext ||= new AudioContextClass();
    if (interfaceAudioContext.state !== 'running') interfaceAudioContext.resume().catch(() => {});
  };
  ['wheel', 'pointerdown', 'touchstart', 'keydown'].forEach(type => {
    window.addEventListener(type, primePreludeAudio, { passive: type !== 'keydown', capture: true });
  });
  primePreludeAudio();
  const typePrelude = () => {
    if (typingStarted || !prelude) {
      playTogether();
      return;
    }
    typingStarted = true;
    film.classList.add('is-intro');
    prelude.textContent = '';
    prelude.classList.add('is-typing');
    const characters = Array.from(preludeText);
    let index = 0;
    preludeInterval = window.setInterval(() => {
      if (!current) return;
      const character = characters[index++];
      prelude.textContent += character;
      if (character !== ' ' && interfaceAudioContext?.state === 'running') playTypewriterKey(interfaceAudioContext);
      if (index >= characters.length) {
        window.clearInterval(preludeInterval);
        preludeInterval = 0;
        prelude.classList.remove('is-typing');
        prelude.classList.add('is-typed');
        preludeTimer = window.setTimeout(() => {
          if (!current) return;
          film.classList.remove('is-intro');
          prelude.textContent = '';
          prelude.classList.remove('is-typed');
          playTogether();
        }, 900);
      }
    }, 48);
  };
  const setEndingStage = stage => { ending.dataset.stage = stage; };
  const finishFilm = () => {
    caption.textContent = 'LEARN';
    beatCopy.textContent = beats[5][2];
    film.dataset.beat = 'learn';
    completed = true;
    if (processBranch) {
      const referrer = document.referrer;
      const cameFromSlate = referrer && new URL(referrer).origin === location.origin && new URL(referrer).pathname === '/';
      if (cameFromSlate && history.length > 1) history.back();
      else location.replace('/#next-ending');
      return;
    }
    if (ending.dataset.stage !== 'waiting') return;
    endingTimers = [
      window.setTimeout(() => setEndingStage('reflection'), 650),
      window.setTimeout(() => setEndingStage('process'), 2300),
      window.setTimeout(() => setEndingStage('career'), 4400),
      window.setTimeout(() => setEndingStage('invitation'), 6100)
    ];
  };
  const start = () => {
    if (reduced) {
      film.classList.add('is-reduced');
      film.classList.remove('is-intro');
      prelude?.classList.remove('is-typing');
      if (prelude) prelude.textContent = '';
      caption.textContent = 'LOOK → QUESTION → UNDERSTAND → MAKE → TEST → LEARN';
      beatCopy.textContent = 'Notice, ask, understand, make, test and learn. Then let what you learn shape the next version.';
      film.classList.add('is-complete');
      setEndingStage('invitation');
      return;
    }
    if (completed) return;
    if (current) return;
    current = true;
    film.dataset.beat = beats[0][0];
    typePrelude();
  };
  const stop = () => {
    current = false;
    window.clearInterval(preludeInterval);
    window.clearTimeout(preludeTimer);
    preludeInterval = 0;
    preludeTimer = 0;
    prelude?.classList.remove('is-typing');
    window.clearInterval(captionInterval);
    captionInterval = 0;
    caption.classList.remove('is-typing');
    if (!filmStarted) {
      typingStarted = false;
      prelude?.classList.remove('is-typed');
      if (prelude) prelude.textContent = '';
      film.classList.add('is-intro');
    }
    cancelAnimationFrame(syncFrame);
    video.pause();
    video.playbackRate = 1;
  };
  const beatStarts = [0, 2.4, 4.8, 7.2, 9.6, 12];
  let syncFrame = 0;
  const updateBeat = () => {
    const index = Math.min(beats.length - 1, beatStarts.reduce((active, startAt, i) => video.currentTime >= startAt ? i : active, 0));
    if (film.dataset.beat !== beats[index][0]) {
      film.dataset.beat = beats[index][0];
      typeCaption(beats[index][1]);
      beatCopy.textContent = beats[index][2];
    }
  };
  const syncPlayback = () => {
    if (!current) return;
    updateBeat();
    syncFrame = requestAnimationFrame(syncPlayback);
  };
  const playTogether = () => {
    caption.textContent = '';
    caption.classList.remove('is-typing');
    beatCopy.textContent = beats[0][2];
    film.dataset.beat = beats[0][0];
    video.currentTime = 0;
    video.playbackRate = 1;
    video.muted = false;
    video.volume = 1;
    const videoStart = video.play();
    videoStart.then(() => {
      filmStarted = true;
      replay.hidden = true;
      typeCaption(beats[0][1]);
      cancelAnimationFrame(syncFrame);
      syncPlayback();
    }).catch(() => {
      current = false;
      video.pause();
      video.currentTime = 0;
      replay.hidden = false;
    });
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= .28) start();
    else if (!entry.isIntersecting && entry.intersectionRatio <= .05) stop();
  }, { threshold: [0, .05, .28, .6] });
  observer.observe(film);
  video.addEventListener('timeupdate', updateBeat);
  video.addEventListener('ended', () => { current = false; finishFilm(); });
  video.addEventListener('error', () => { replay.hidden = false; });
  replay.addEventListener('click', () => {
    completed = false;
    setEndingStage('waiting');
    endingTimers.forEach(window.clearTimeout);
    endingTimers = [];
    current = true;
    typingStarted = true;
    filmStarted = false;
    film.classList.remove('is-intro');
    playTogether();
  });
}

function bindChandigarhArrival() {
  const gate = document.querySelector('.chapter-gate');
  const arrival = document.querySelector('.chandigarh-arrival');
  const continueButton = gate?.querySelector('.gate-continue');
  if (!gate || !arrival || !continueButton || gate.dataset.bound) return;
  gate.dataset.bound = 'true';
  let unlocked = false;
  let sceneStarted = false;
  let typingAudio;
  const primeTypingAudio = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      interfaceAudioContext ||= new AudioContextClass();
      if (interfaceAudioContext.state !== 'running') interfaceAudioContext.resume().catch(() => {});
    }
    if (!typingAudio) typingAudio = interfaceAudioContext;
    if (!typingAudio) return;
    gate.dataset.typingSound = typingAudio.state;
    if (typingAudio.state !== 'running') typingAudio.resume().catch(() => {});
  };
  const typingGestureOptions = { passive: true, capture: true };
  window.addEventListener('pointerdown', primeTypingAudio, typingGestureOptions);
  window.addEventListener('touchstart', primeTypingAudio, typingGestureOptions);
  window.addEventListener('keydown', primeTypingAudio);
  window.addEventListener('wheel', primeTypingAudio, typingGestureOptions);
  continueButton.addEventListener('click', primeTypingAudio);
  primeTypingAudio();
  const typeTick = () => {
    if (!typingAudio) return;
    if (typingAudio.state !== 'running') return;
    playTypewriterKey(typingAudio);
  };
  const typeText = (element, copy, duration, cue, owner = gate, sound = true) => {
    if (!element) return;
    element.textContent = '';
    owner.dataset.typing = cue;
    const interval = duration / Math.max(1, copy.length);
    let index = 0;
    const typeCharacter = () => {
      if (index >= copy.length) return;
      const character = copy[index++];
      element.textContent += character;
      if (character !== ' ' && sound) typeTick();
      if (index < copy.length) window.setTimeout(typeCharacter, interval);
    };
    typeCharacter();
  };
  journeyTypeText = typeText;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let touchStartY = null;
  const gateTop = () => gate.getBoundingClientRect().top + window.scrollY;
  const holdAtGate = event => {
    if (unlocked) return;
    const top = gateTop();
    const scroll = window.scrollY;
    const down = event.type === 'wheel'
      ? event.deltaY > 0 && (scroll >= top - 2 || scroll + event.deltaY >= top)
      : event.type === 'touchmove'
        ? touchStartY !== null && touchStartY > (event.touches[0]?.clientY ?? touchStartY) && (scroll >= top - 2 || scroll + (touchStartY - event.touches[0].clientY) * 1.5 >= top)
        : scroll >= top - 2;
    if (down) {
      event.preventDefault();
      if (scroll < top - 2) window.scrollTo({ top, behavior: 'instant' });
    }
  };
  window.addEventListener('touchstart', event => { touchStartY = event.touches[0]?.clientY ?? null; }, { passive: true });
  window.addEventListener('touchend', () => { touchStartY = null; }, { passive: true });
  window.addEventListener('wheel', holdAtGate, { passive: false });
  window.addEventListener('touchmove', holdAtGate, { passive: false });
  window.addEventListener('keydown', event => {
    if (unlocked || !['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) return;
    if (event.target instanceof HTMLElement && event.target.closest('a,button')) return;
    const top = gateTop();
    const isPageJump = ['PageDown', ' ', 'End'].includes(event.key);
    if (window.scrollY < top - 2 && (!isPageJump || window.scrollY + innerHeight * .85 < top)) return;
    event.preventDefault();
    window.scrollTo({ top, behavior: 'instant' });
  });
  continueButton.addEventListener('click', () => {
    unlocked = true;
    gate.classList.add('is-unlocked');
    arrival.classList.add('is-prepared');
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    const arrivalTop = arrival.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: arrivalTop, behavior: reduced ? 'instant' : 'smooth' });
  });
  const invitationObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || entry.intersectionRatio < .4 || sceneStarted) return;
    sceneStarted = true;
    if (reduced) {
      gate.dataset.stage = 'invitation';
      gate.querySelector('.gate-eyebrow').textContent = 'The next chapter';
      gate.querySelector('.gate-copy-line--one').textContent = 'Learning it was one thing.';
      gate.querySelector('.gate-copy-line--highlight').textContent = 'Doing it for real?';
      gate.querySelector('.gate-copy-line--last').textContent = 'Another.';
      continueButton.tabIndex = 0;
      guideStoryChoices(gate, [continueButton], () => continueButton.click());
      return;
    }
    gate.querySelector('.gate-eyebrow').textContent = '';
    gate.querySelector('.gate-copy-line--one').textContent = '';
    gate.querySelector('.gate-copy-line--highlight').textContent = '';
    gate.querySelector('.gate-copy-line--last').textContent = '';
    gate.dataset.stage = 'label';
    typeText(gate.querySelector('.gate-eyebrow'), 'The next chapter', 1000, 'eyebrow');
    window.setTimeout(() => { if (gate.dataset.typing === 'eyebrow') gate.dataset.typing = ''; }, 1050);
    window.setTimeout(() => {
      gate.dataset.stage = 'copy';
      typeText(gate.querySelector('.gate-copy-line--one'), 'Learning it was one thing.', 1450, 'line-one');
    }, 1200);
    window.setTimeout(() => {
      typeText(gate.querySelector('.gate-copy-line--highlight'), 'Doing it for real?', 1050, 'highlight');
    }, 2850);
    window.setTimeout(() => {
      typeText(gate.querySelector('.gate-copy-line--last'), 'Another.', 550, 'last');
    }, 4050);
    window.setTimeout(() => {
      gate.dataset.typing = '';
      gate.dataset.stage = 'invitation';
      continueButton.tabIndex = 0;
      guideStoryChoices(gate, [continueButton], () => continueButton.click());
    }, 5100);
  }, { threshold: [.4, .65] });
  invitationObserver.observe(gate);
  const arrivalObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || entry.intersectionRatio < .38 || arrival.dataset.played) return;
    arrival.dataset.played = 'true';
    const avatar = arrival.querySelector('.arrival-avatar');
    if (reduced) {
      avatar.dataset.pose = 'stride-one';
      arrival.classList.add('is-landed');
      arrival.querySelector('.arrival-place').textContent = 'CHANDIGARH';
      arrival.querySelector('.arrival-date').textContent = 'JUNE—AUGUST 2025';
      arrival.querySelector('.arrival-caption').textContent = 'Okay. Time to put it all to work.';
      arrival.classList.add('is-location-revealed');
      return;
    }
    if (!avatar) return;
    const setPose = pose => { avatar.dataset.pose = pose; };
    // Preload the sequence before the first frame so every handoff is ready.
    avatar.querySelectorAll('img').forEach(image => { image.decode?.().catch(() => {}); });
      setPose('drop');
      playStoryCue('jump', false, arrival);
    arrival.classList.add('is-arriving');
    window.setTimeout(() => {
      setPose('midair');
    }, 250);
    window.setTimeout(() => {
      setPose('impact');
      playStoryCue('touchdown');
      arrival.classList.add('is-touchdown');
    }, 1220);
    window.setTimeout(() => setPose('recover'), 1600);
    window.setTimeout(() => {
      setPose('stride-cycle');
      arrival.classList.add('is-landed');
      arrival.classList.remove('is-arriving', 'is-touchdown');
      const place = arrival.querySelector('.arrival-place');
      const date = arrival.querySelector('.arrival-date');
      const caption = arrival.querySelector('.arrival-caption');
      if (reduced) {
        place.textContent = 'CHANDIGARH';
        date.textContent = 'JUNE—AUGUST 2025';
        caption.textContent = 'First stop: the working world.';
        return;
      }
      typeText(caption, 'Okay. Time to put it all to work.', 2950, 'caption', arrival);
      window.setTimeout(() => {
        playStoryCue('location');
        arrival.classList.add('is-location-revealed');
        window.setTimeout(() => {
          typeText(place, 'CHANDIGARH', 700, 'city', arrival);
          window.setTimeout(() => {
            typeText(date, 'JUNE—AUGUST 2025', 900, 'city-date', arrival);
            window.setTimeout(() => {
              arrival.dataset.typing = '';
              setPose('recover');
              arrival.classList.remove('is-landed');
              if (arrival.dataset.santTransitionScheduled) return;
              arrival.dataset.santTransitionScheduled = 'true';
              window.setTimeout(() => {
                const next = document.querySelector('.sant-id-chapter');
                if (!next) return;
                const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
                const nextTop = next.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: nextTop, behavior: reduced ? 'instant' : 'smooth' });
              }, 550);
            }, 650);
          }, 450);
        }, 420);
      }, 3000);
    }, 2110);
  }, { threshold: [.38, .55] });
  arrivalObserver.observe(arrival);
}

function bindSantRamReveal() {
  const section = document.querySelector('.sant-id-chapter');
  const avatar = section?.querySelector('.sant-id-avatar');
  if (!section || !avatar || section.dataset.bound) return;
  section.dataset.bound = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let choiceMade = false;
  let touchStartY = null;
  const lockTop = () => {
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    return section.getBoundingClientRect().top + window.scrollY - headerHeight;
  };
  const holdAtId = event => {
    if (choiceMade || !section.dataset.played) return;
    const top = lockTop();
    const scroll = window.scrollY;
    const down = event.type === 'wheel'
      ? event.deltaY > 0
      : touchStartY !== null && touchStartY > (event.touches[0]?.clientY ?? touchStartY);
    const triesToPass = down && (scroll >= top - 2 || scroll + (event.deltaY || (touchStartY - (event.touches[0]?.clientY ?? touchStartY)) * 1.5) >= top);
    if (!triesToPass) return;
    event.preventDefault();
    if (Math.abs(scroll - top) > 2) window.scrollTo({ top, behavior: 'instant' });
  };
  window.addEventListener('touchstart', event => { touchStartY = event.touches[0]?.clientY ?? null; }, { passive: true });
  window.addEventListener('touchend', () => { touchStartY = null; }, { passive: true });
  window.addEventListener('wheel', holdAtId, { passive: false });
  window.addEventListener('touchmove', holdAtId, { passive: false });
  window.addEventListener('scroll', () => {
    if (choiceMade || !section.dataset.played) return;
    const top = lockTop();
    if (window.scrollY > top + 2) window.scrollTo({ top, behavior: 'instant' });
  }, { passive: true });
  window.addEventListener('keydown', event => {
    if (choiceMade || !section.dataset.played || !['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) return;
    if (event.target instanceof HTMLElement && event.target.closest('a,button')) return;
    if (window.scrollY < lockTop() - 2) return;
    event.preventDefault();
  });
  section.querySelectorAll('.sant-id-next, .sant-id-deeper').forEach(choice => {
    choice.addEventListener('click', () => { choiceMade = true; });
  });
  const reveal = () => {
    if (section.dataset.played) return;
    section.dataset.played = 'true';
    avatar.querySelectorAll('img').forEach(image => image.decode?.().catch(() => {}));
    section.classList.add('is-revealed');
    if (reduced) {
      avatar.dataset.idPose = 'show';
      section.classList.add('is-card-captured', 'is-copy-complete');
      section.querySelector('.sant-id-lead').textContent = 'From classroom ideas to a real brand.';
      section.querySelector('.sant-id-company-line').textContent = 'The House of Sant Ram’s';
      section.querySelector('.sant-id-deeper').tabIndex = 0;
      section.querySelector('.sant-id-next').tabIndex = 0;
      section.classList.add('is-next-available');
      guideStoryChoices(section, [section.querySelector('.sant-id-next'), section.querySelector('.sant-id-deeper')], () => section.querySelector('.sant-id-next')?.click());
      return;
    }
    avatar.dataset.idPose = 'down';
    section.querySelector('.sant-id-lead').textContent = 'From classroom ideas to a real brand.';
    window.setTimeout(() => {
      avatar.dataset.idPose = 'show';
      // Start the capture just before the 650 ms pose crossfade finishes so
      // the shutter lands on the completed ID reveal; keep the card reveal
      // gated on the sound ending.
      window.setTimeout(() => {
        playCameraCaptureThen(() => {
          section.classList.add('is-card-captured');
          window.setTimeout(() => {
            journeyTypeText?.(section.querySelector('.sant-id-company-line'), 'The House of Sant Ram’s', 1750, 'sant-company', section);
            window.setTimeout(() => {
              section.dataset.typing = '';
              section.classList.add('is-copy-complete');
              section.querySelector('.sant-id-deeper').tabIndex = 0;
              window.setTimeout(() => {
                section.classList.add('is-next-available');
                section.querySelector('.sant-id-next').tabIndex = 0;
                guideStoryChoices(section, [section.querySelector('.sant-id-next'), section.querySelector('.sant-id-deeper')], () => section.querySelector('.sant-id-next')?.click());
              }, 420);
            }, 1800);
          }, 240);
        });
      }, 420);
    }, 1450);
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= .28) reveal();
  }, { threshold: [.28, .5] });
  observer.observe(section);
}

function bindUxTransition() {
  const section = document.querySelector('.ux-transition');
  if (!section || section.dataset.bound) return;
  section.dataset.bound = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let thesisTypingStarted = false;
  let questionBlinkLoop = 0;
  let thoughtAudioContext;
  let typingAudioContext;
  const avatar = section.querySelector('.ux-thinking-avatar');
  section.querySelectorAll('.ux-thought[data-question]').forEach(question => { question.dataset.fullText = question.textContent.trim(); question.textContent = ''; });
  const avatarFramesReady = Promise.all([...avatar.querySelectorAll('img')].map(frame => frame.decode().catch(() => {})));
  const primeTypingAudio = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    interfaceAudioContext ||= new AudioCtx();
    typingAudioContext ||= interfaceAudioContext;
    if (typingAudioContext.state !== 'running') typingAudioContext.resume().catch(() => {});
  };
  const typeTick = () => {
    const ctx = typingAudioContext;
    playTypewriterKey(ctx);
  };
  const primeOnGesture = { passive: true, capture: true };
  window.addEventListener('wheel', primeTypingAudio, primeOnGesture);
  window.addEventListener('pointerdown', primeTypingAudio, primeOnGesture);
  window.addEventListener('touchstart', primeTypingAudio, primeOnGesture);
  window.addEventListener('keydown', primeTypingAudio, true);
  primeTypingAudio();
  const startThesisTyping = onComplete => {
    if (thesisTypingStarted) return;
    thesisTypingStarted = true;
    const lines = [...section.querySelectorAll('.ux-typewriter[data-type-text]')];
    lines.forEach(line => { line.dataset.fullText = line.textContent; line.textContent = ''; });
    const typeLine = (index) => {
      const line = lines[index];
      if (!line) { onComplete?.(); return; }
      const chars = Array.from(line.dataset.fullText || '');
      line.classList.add('is-typing');
      let cursor = 0;
      const timer = window.setInterval(() => {
        line.textContent = chars.slice(0, ++cursor).join('');
        if (chars[cursor - 1] !== ' ') typeTick();
        if (cursor >= chars.length) {
          clearInterval(timer);
          line.classList.remove('is-typing');
          line.classList.add('is-typed');
          window.setTimeout(() => typeLine(index + 1), 420);
        }
      }, 54);
    };
    if (reduced) {
      lines.forEach(line => { line.textContent = line.dataset.fullText; line.classList.add('is-typed'); });
      onComplete?.();
      return;
    }
    typeLine(0);
  };
  const dropSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      thoughtAudioContext ||= (interfaceAudioContext ||= new AudioCtx());
      const ctx = thoughtAudioContext;
      const play = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(290, now + .16);
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(.075, now + .012);
        gain.gain.exponentialRampToValueAtTime(.0001, now + .22);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + .23);
      };
      if (ctx.state === 'suspended') ctx.resume().then(play).catch(() => {});
      else play();
    } catch {}
  };
  const dropQuestionMark = index => {
    const mark = section.querySelectorAll('.ux-question-mark')[index];
    if (!mark) return null;
    mark.classList.remove('is-dropped');
    void mark.offsetWidth;
    mark.classList.add('is-dropped');
    dropSound();
    return mark;
  };
  const setStep = (step, questioning = false) => {
    avatar?.classList.remove('is-questioning', 'is-meeting-viewer');
    if (questioning) avatar?.classList.add('is-questioning');
    section.dataset.step = String(step);
  };
  const blinkThenLook = (step, questioning = true, done) => {
    if (!avatar || reduced) {
      setStep(step, questioning);
      done?.();
      return;
    }
    avatar.classList.remove('is-questioning', 'is-meeting-viewer');
    void avatar.offsetWidth;
    avatar.classList.add('is-blinking');
    window.setTimeout(() => {
      avatar.classList.remove('is-blinking');
      avatar.classList.add('is-meeting-viewer');
      window.setTimeout(() => {
        avatar.classList.remove('is-meeting-viewer');
        setStep(step, questioning);
        done?.();
      }, 360);
    }, 145);
  };
  const lookToQuestion = (step, done) => {
    if (!avatar || reduced) {
      setStep(step, true);
      done?.();
      return;
    }
    avatar.classList.remove('is-questioning');
    avatar.classList.add('is-meeting-viewer');
    window.setTimeout(() => {
      avatar.classList.remove('is-meeting-viewer');
      setStep(step, true);
      done?.();
    }, 300);
  };
  const startQuestionBlinkLoop = () => {
    if (reduced || questionBlinkLoop) return;
    questionBlinkLoop = window.setInterval(() => {
      const step = Number(section.dataset.step);
      if (step > 6) {
        window.clearInterval(questionBlinkLoop);
        questionBlinkLoop = 0;
        return;
      }
      if (step >= 3 && step <= 6 && !avatar.classList.contains('is-blinking') && !avatar.classList.contains('is-meeting-viewer')) {
        avatar.classList.add('is-blinking');
        window.setTimeout(() => avatar.classList.remove('is-blinking'), 165);
      }
    }, 3600);
  };
  const playThoughts = () => {
    const showQuestions = step => {
      if (step <= 6) {
        lookToQuestion(step, () => {
          dropQuestionMark(step - 3);
          window.setTimeout(() => {
            const question = section.querySelector(`[data-question="${step - 3}"]`);
            if (!question) { showQuestions(step + 1); return; }
            const copy = question.dataset.fullText || question.textContent.trim();
            question.textContent = copy;
            question.classList.add('is-revealed');
            if (!reduced) {
              question.classList.remove('is-dropping');
              void question.offsetWidth;
              question.classList.add('is-dropping');
              window.setTimeout(() => question.classList.remove('is-dropping'), 720);
            }
            window.setTimeout(() => showQuestions(step + 1), reduced ? 520 : 900);
          }, reduced ? 0 : 120);
        });
      } else if (step === 7) {
        blinkThenLook(7, true, () => window.setTimeout(() => blinkThenLook(8, true, () => {
          const tagAlong = section.querySelector('.ux-tag-along');
          guideStoryChoices(section, [tagAlong], () => tagAlong?.click());
        }), 1450));
      }
    };
    blinkThenLook(1, false, () => window.setTimeout(() => blinkThenLook(2, true, () => {
      window.setTimeout(() => showQuestions(3), 1100);
    }), 1150));
  };
  const begin = () => {
    if (section.dataset.autoplay === 'started') return;
    section.dataset.autoplay = 'started';
    avatar.classList.add('is-blinking');
    window.setTimeout(() => avatar.classList.remove('is-blinking'), 150);
    const entryBlink = window.setInterval(() => {
      if (section.dataset.step !== '0') { window.clearInterval(entryBlink); return; }
      avatar.classList.add('is-blinking');
      window.setTimeout(() => avatar.classList.remove('is-blinking'), 150);
    }, 2850);
    avatarFramesReady.then(() => startThesisTyping(() => window.setTimeout(() => {
      window.clearInterval(entryBlink);
      startQuestionBlinkLoop();
      playThoughts();
    }, 1900)));
  };
  if (reduced) section.classList.add('is-reduced-motion');
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= .2) {
      begin();
      observer.disconnect();
    }
  }, { threshold: [.2, .35] });
  observer.observe(section);
  if (section.getBoundingClientRect().top < window.innerHeight * .8) begin();
}

function bindJanitriJourney() {
  const gate = document.querySelector('.janitri-gate');
  const arrival = document.querySelector('.janitri-arrival');
  const idSection = document.querySelector('.janitri-id-chapter');
  const continueButton = gate?.querySelector('.gate-continue');
  if (!gate || !arrival || !idSection || !continueButton || gate.dataset.bound) return;
  gate.dataset.bound = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let unlocked = false;
  let idUnlocked = false;
  let idPlayed = false;
  let touchStartY = null;

  const typeText = journeyTypeText;
  const scrollToSection = section => {
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    const top = section.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
  };
  const topOfGate = () => gate.getBoundingClientRect().top + window.scrollY;
  const holdAtGate = event => {
    if (unlocked) return;
    const top = topOfGate();
    const scroll = window.scrollY;
    const down = event.type === 'wheel'
      ? event.deltaY > 0 && (scroll >= top - 2 || scroll + event.deltaY >= top)
      : touchStartY !== null && touchStartY > (event.touches[0]?.clientY ?? touchStartY) && (scroll >= top - 2 || scroll + (touchStartY - event.touches[0].clientY) * 1.5 >= top);
    if (!down) return;
    event.preventDefault();
    if (scroll < top - 2) window.scrollTo({ top, behavior: 'instant' });
  };
  window.addEventListener('touchstart', event => { touchStartY = event.touches[0]?.clientY ?? null; }, { passive: true });
  window.addEventListener('touchend', () => { touchStartY = null; }, { passive: true });
  window.addEventListener('wheel', holdAtGate, { passive: false });
  window.addEventListener('touchmove', holdAtGate, { passive: false });

  // A refreshed/shared Janitri gate URL should not land on the intentionally
  // empty pre-animation state. Keep the normal typed entrance for visitors
  // arriving from Sant Ram's, but make a direct gate link immediately usable.
  const directGateEntry = location.hash === '#janitri-gate';
  let typedOnce = directGateEntry;
  if (directGateEntry) {
    gate.querySelector('.gate-eyebrow').textContent = 'The next chapter';
    gate.querySelector('.gate-copy-line--one').textContent = 'I wanted to know what';
    gate.querySelector('.gate-copy-line--highlight').textContent = 'design could actually change.';
    gate.dataset.stage = 'invitation';
    continueButton.tabIndex = 0;
    guideStoryChoices(gate, [continueButton], () => continueButton.click());
  }
  const gateObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || entry.intersectionRatio < .4 || typedOnce) return;
    typedOnce = true;
    if (reduced || !typeText) {
      gate.dataset.stage = 'invitation';
      gate.querySelector('.gate-eyebrow').textContent = 'The next chapter';
      gate.querySelector('.gate-copy-line--one').textContent = 'I wanted to know what';
      gate.querySelector('.gate-copy-line--highlight').textContent = 'design could actually change.';
      continueButton.tabIndex = 0;
      return;
    }
    const eyebrow = gate.querySelector('.gate-eyebrow');
    const first = gate.querySelector('.gate-copy-line--one');
    const highlight = gate.querySelector('.gate-copy-line--highlight');
    eyebrow.textContent = first.textContent = highlight.textContent = '';
    gate.dataset.stage = 'label';
    typeText(eyebrow, 'The next chapter', 1000, 'eyebrow', gate);
    window.setTimeout(() => {
      if (gate.dataset.typing === 'eyebrow') gate.dataset.typing = '';
      gate.dataset.stage = 'copy';
    typeText(first, 'I wanted to know what', 1250, 'line-one', gate);
    }, 1200);
    window.setTimeout(() => typeText(highlight, 'design could actually change.', 1900, 'highlight', gate), 3050);
    window.setTimeout(() => {
      gate.dataset.typing = '';
      gate.dataset.stage = 'invitation';
      continueButton.tabIndex = 0;
      guideStoryChoices(gate, [continueButton], () => continueButton.click());
    }, 5600);
  }, { threshold: [.4, .65] });
  gateObserver.observe(gate);
  window.addEventListener('keydown', event => {
    if (unlocked || !['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) return;
    if (event.target instanceof HTMLElement && event.target.closest('a,button')) return;
    const top = topOfGate();
    if (window.scrollY < top - 2) return;
    event.preventDefault();
    window.scrollTo({ top, behavior: 'instant' });
  });

  continueButton.addEventListener('click', () => {
    unlocked = true;
    gate.classList.add('is-unlocked');
    arrival.classList.add('is-prepared');
    scrollToSection(arrival);
  });

  const arrivalObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || entry.intersectionRatio < .38 || arrival.dataset.played) return;
    arrival.dataset.played = 'true';
    const avatar = arrival.querySelector('.arrival-avatar');
    const setPose = pose => { avatar.dataset.pose = pose; };
    if (!avatar) return;
    if (reduced) {
      setPose('recover');
      arrival.classList.add('is-landed', 'is-location-revealed');
      arrival.querySelector('.arrival-place').textContent = 'BENGALURU';
      arrival.querySelector('.arrival-date').textContent = 'DECEMBER 2025—APRIL 2026';
      arrival.querySelector('.arrival-caption').textContent = 'New city. New problems. Much bigger questions.';
      window.setTimeout(() => scrollToSection(idSection), 900);
      return;
    }
    avatar.querySelectorAll('img').forEach(image => image.decode?.().catch(() => {}));
    setPose('drop');
    playStoryCue('jump', false, arrival);
    arrival.classList.add('is-arriving');
    window.setTimeout(() => setPose('midair'), 250);
    window.setTimeout(() => { setPose('impact'); playStoryCue('touchdown'); arrival.classList.add('is-touchdown'); }, 1220);
    window.setTimeout(() => setPose('recover'), 1600);
    window.setTimeout(() => {
      setPose('stride-cycle');
      arrival.classList.add('is-landed');
      arrival.classList.remove('is-arriving', 'is-touchdown');
      typeText?.(arrival.querySelector('.arrival-caption'), 'New city. New problems. Much bigger questions.', 3000, 'caption', arrival);
      window.setTimeout(() => {
        playStoryCue('location');
        arrival.classList.add('is-location-revealed');
        window.setTimeout(() => {
          typeText?.(arrival.querySelector('.arrival-place'), 'BENGALURU', 700, 'city', arrival);
          window.setTimeout(() => {
            typeText?.(arrival.querySelector('.arrival-date'), 'DECEMBER 2025—APRIL 2026', 1000, 'city-date', arrival);
            window.setTimeout(() => {
              arrival.dataset.typing = '';
              setPose('recover');
              arrival.classList.remove('is-landed');
              window.setTimeout(() => scrollToSection(idSection), 600);
            }, 700);
          }, 550);
        }, 420);
      }, 3150);
    }, 2110);
  }, { threshold: [.38, .55] });
  arrivalObserver.observe(arrival);

  const avatar = idSection.querySelector('.sant-id-avatar');
  // Returning from the Janitri deep dive is a deliberate destination. Keep the
  // ID scene in place so its timed guide cannot carry the visitor onward again.
  if (idSection.dataset.returnedFromDeepDive === 'true') idUnlocked = true;
  const revealId = () => {
    if (idPlayed) return;
    idPlayed = true;
    avatar.querySelectorAll('img').forEach(image => image.decode?.().catch(() => {}));
    idSection.dataset.played = 'true';
    idSection.classList.add('is-revealed');
    const lead = idSection.querySelector('.sant-id-lead');
    const company = idSection.querySelector('.sant-id-company-line');
    const next = idSection.querySelector('.sant-id-next');
    const deeper = idSection.querySelector('.sant-id-deeper');
    lead.textContent = 'This time, design meant something different.';
    if (reduced) {
      avatar.dataset.idPose = 'show';
      company.textContent = 'Janitri Innovations Pvt. Ltd.';
      idSection.classList.add('is-card-captured', 'is-copy-complete', 'is-next-available');
      next.tabIndex = deeper.tabIndex = 0;
      if (!idUnlocked) guideStoryChoices(idSection, [next, deeper], () => next.click());
      return;
    }
    avatar.dataset.idPose = 'down';
    window.setTimeout(() => {
      avatar.dataset.idPose = 'show';
      afterIdPoseSettles(avatar, () => {
        playCameraCaptureThen(() => {
          idSection.classList.add('is-card-captured');
          window.setTimeout(() => {
            typeText?.(company, 'Janitri Innovations Pvt. Ltd.', 2200, 'janitri-company', idSection);
            window.setTimeout(() => {
              idSection.dataset.typing = '';
              idSection.classList.add('is-copy-complete');
              deeper.tabIndex = 0;
              window.setTimeout(() => {
                idSection.classList.add('is-next-available');
                next.tabIndex = 0;
                if (!idUnlocked) guideStoryChoices(idSection, [next, deeper], () => next.click());
              }, 420);
            }, 2300);
          }, 240);
        });
      });
    }, 1450);
  };
  const idObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= .28) revealId();
  }, { threshold: [.28, .5] });
  idObserver.observe(idSection);
  if (idSection.dataset.returnedFromDeepDive === 'true') revealId();
  idSection.querySelectorAll('.sant-id-next, .sant-id-deeper').forEach(link => link.addEventListener('click', () => { idUnlocked = true; }));
  const holdAtId = event => {
    if (idUnlocked || !idSection.dataset.played) return;
    const top = idSection.getBoundingClientRect().top + window.scrollY - (document.querySelector('.site-header')?.getBoundingClientRect().height || 0);
    const scroll = window.scrollY;
    const down = event.type === 'wheel' ? event.deltaY > 0 : touchStartY !== null && touchStartY > (event.touches[0]?.clientY ?? touchStartY);
    const delta = event.deltaY || (touchStartY - (event.touches[0]?.clientY ?? touchStartY)) * 1.5;
    if (!down || !(scroll >= top - 2 || scroll + delta >= top)) return;
    event.preventDefault();
    if (Math.abs(scroll - top) > 2) window.scrollTo({ top, behavior: 'instant' });
  };
  window.addEventListener('wheel', holdAtId, { passive: false });
  window.addEventListener('touchmove', holdAtId, { passive: false });
  window.addEventListener('scroll', () => {
    if (idUnlocked || !idSection.dataset.played) return;
    const top = idSection.getBoundingClientRect().top + window.scrollY - (document.querySelector('.site-header')?.getBoundingClientRect().height || 0);
    if (window.scrollY > top + 2) window.scrollTo({ top, behavior: 'instant' });
  }, { passive: true });
  window.addEventListener('keydown', event => {
    if (idUnlocked || !idSection.dataset.played || !['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) return;
    if (event.target instanceof HTMLElement && event.target.closest('a,button')) return;
    event.preventDefault();
  });
}

function bindNiftNarration() {
  const stage = document.querySelector('.nift-scene');
  const copy = document.querySelector('.nift-prelude-third');
  const controls = document.querySelector('.topic-controls');
  if (!stage || !copy || !controls || stage.dataset.narrationBound) return;
  stage.dataset.narrationBound = 'true';
  const text = "Turns out, there's a lot more to seeing.";
  const topics = ['composition', 'colour', 'stories', 'details'];
  let typingTimer = 0;
  let cycleTimers = [];
  let sequence = 0;
  let stageVisible = false;
  let copyComplete = false;
  let topicsPlaying = false;
  const topicLead = 900;
  const topicGap = 800;
  const playTopics = token => {
    cycleTimers.forEach(clearTimeout);
    cycleTimers = [];
    if (!stageVisible) { topicsPlaying = false; return; }
    topicsPlaying = true;
    topics.forEach((topic, index) => {
      cycleTimers.push(window.setTimeout(() => {
        if (token !== sequence || !stageVisible) return;
        setTopic(topic);
        // The automatic topic preview must not impersonate a user hover.
      }, topicLead + index * topicGap));
    });
    cycleTimers.push(window.setTimeout(() => {
      if (token === sequence && stageVisible) {
        setTopic('idle');
        topicsPlaying = false;
        stage.dispatchEvent(new CustomEvent('nift-topics-complete', { bubbles: true }));
      }
    }, topicLead + topics.length * topicGap));
  };
  const typeCopy = () => {
    window.clearInterval(typingTimer);
    cycleTimers.forEach(clearTimeout);
    cycleTimers = [];
    const token = ++sequence;
    copyComplete = false;
    topicsPlaying = false;
    setTopic('idle');
    copy.textContent = '';
    copy.classList.remove('is-typed');
    copy.classList.add('is-typing');
    stage.classList.add('nift-copy-visible');
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      interfaceAudioContext ||= new AudioContextClass();
      if (interfaceAudioContext.state !== 'running') interfaceAudioContext.resume().catch(() => {});
    }
    const characters = Array.from(text);
    let index = 0;
    typingTimer = window.setInterval(() => {
      if (token !== sequence) return;
      const character = characters[index++];
      copy.textContent += character;
      if (character !== ' ' && stageVisible && interfaceAudioContext?.state === 'running') playTypewriterKey(interfaceAudioContext);
      if (index >= characters.length) {
        window.clearInterval(typingTimer);
        typingTimer = 0;
        copy.classList.remove('is-typing');
        copy.classList.add('is-typed');
        copyComplete = true;
        stage.dispatchEvent(new CustomEvent('nift-copy-typed', { bubbles: true }));
        playTopics(token);
      }
    }, 40);
  };
  stage.addEventListener('nift-copy-arrived', typeCopy);
  stage.addEventListener('nift-copy-cancel', () => {
    ++sequence;
    copyComplete = false;
    topicsPlaying = false;
    window.clearInterval(typingTimer);
    cycleTimers.forEach(clearTimeout);
    copy.classList.remove('is-typing');
    copy.classList.remove('is-typed');
    stage.classList.remove('nift-copy-visible');
    setTopic('idle');
  });
  const stageObserver = new IntersectionObserver(([entry]) => {
    stageVisible = entry.isIntersecting && entry.intersectionRatio > .05;
    if (!stageVisible && topicsPlaying) {
      cycleTimers.forEach(clearTimeout);
      cycleTimers = [];
      sequence += 1;
      topicsPlaying = false;
      setTopic('idle');
    } else if (stageVisible && copyComplete && !topicsPlaying) {
      playTopics(++sequence);
    }
  }, { threshold: [0, .05, .2] });
  stageObserver.observe(stage);
}

function bindNiftPrelude() {
  const link = document.querySelector('.intro-summary-continue');
  const section = document.querySelector('.nift-section');
  const scene = document.querySelector('.nift-scene');
  if (!link || !section || !scene || link.dataset.preludeBound) return;
  link.dataset.preludeBound = 'true';
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let entryObserver;
  const startPrelude = () => {
    if (scene.dataset.preludePlayed === 'true') return;
    scene.dataset.preludePlayed = 'true';
    entryObserver?.disconnect();
    scene.classList.remove('nift-ready', 'prelude-reveal');
    scene.classList.remove('nift-copy-visible');
    const prelude = scene.querySelector('.nift-prelude');
    const say = stage => {
      scene.dataset.prelude = stage;
      if (stage === 'third') scene.classList.add('nift-copy-visible');
      if (stage === 'first' && !reducedMotion()) scene.dispatchEvent(new CustomEvent('nift-prelude-first', { bubbles: true }));
      prelude.setAttribute('aria-label', ({
        first: "I didn't just learn to look. I learned what to look for.",
        logo: 'National Institute of Fashion Technology logo.',
        third: "Turns out, there's a lot more to seeing."
      }[stage] || ''));
    };
    say('first');
    scene.classList.add('prelude-active');
    section.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' });

    const runSequence = () => {
      const reduced = reducedMotion();
      const beat = reduced ? 850 : 1000;
      const fadeGap = reduced ? 100 : 180;
      const logoBeat = reduced ? 450 : 560;
      window.setTimeout(() => say('out'), beat);
      window.setTimeout(() => {
        say('logo');
        window.setTimeout(() => {
          say('out');
          window.setTimeout(() => {
            scene.addEventListener('nift-copy-typed', () => {
              window.setTimeout(() => {
                scene.classList.add('prelude-reveal');
                window.setTimeout(() => {
                  scene.classList.remove('prelude-active');
                  scene.classList.add('nift-ready');
                }, reduced ? 100 : 320);
              }, reduced ? 100 : 360);
            }, { once: true });
            say('third');
            scene.dispatchEvent(new CustomEvent('nift-copy-arrived', { bubbles: true }));
          }, fadeGap);
        }, logoBeat);
      }, beat + fadeGap);
    };
    // The entry observer already waits until NIFT is in view. Do not gate this
    // sequence on a second intersection threshold: the tall story frame may
    // never reach that ratio in a shorter desktop viewport.
    requestAnimationFrame(() => requestAnimationFrame(runSequence));
  };

  link.addEventListener('click', event => {
    event.preventDefault();
    if (scene.dataset.preludePlayed === 'true') {
      section.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' });
      window.setTimeout(() => {
        scene.dataset.preludePlayed = 'false';
        startPrelude();
      }, reducedMotion() ? 0 : 680);
      return;
    }
    startPrelude();
  });

  scene.addEventListener('nift-topics-complete', () => {
    const continueLink = scene.querySelector('.scene-next');
    guideStoryChoices(section, [continueLink], () => continueLink?.click());
  });

  scene.addEventListener('nift-replay', () => {
    scene.dataset.preludePlayed = 'false';
    startPrelude();
  });

  entryObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) startPrelude();
  }, { threshold: [0.2] });
  entryObserver.observe(section);
}

function bindNiftBlink() {
  const avatar = document.querySelector('.nift-avatar-pair');
  const scene = document.querySelector('.nift-section');
  if (!avatar || !scene || avatar.dataset.blinkBound) return;
  avatar.dataset.blinkBound = 'true';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let timer;
  let visible = false;
  let preludeBlinkRequested = false;
  const scheduleBlink = () => {
    if (!visible) return;
    const firstNiftBeat = scene.querySelector('.nift-scene')?.dataset.prelude === 'first' && avatar.dataset.didPreludeBlink !== 'true';
    if (firstNiftBeat) avatar.dataset.didPreludeBlink = 'true';
    timer = window.setTimeout(() => {
      avatar.classList.add('is-blinking');
      window.setTimeout(() => {
        avatar.classList.remove('is-blinking');
        scheduleBlink();
      }, 155);
    }, firstNiftBeat ? 420 : 2200 + Math.random() * 1300);
  };
  const blinkForPrelude = () => {
    if (!visible) return;
    window.clearTimeout(timer);
    preludeBlinkRequested = false;
    avatar.dataset.didPreludeBlink = 'true';
    avatar.classList.add('is-blinking');
    window.setTimeout(() => {
      avatar.classList.remove('is-blinking');
      scheduleBlink();
    }, 165);
  };
  scene.addEventListener('nift-prelude-first', () => {
    preludeBlinkRequested = true;
    blinkForPrelude();
  });
  // Track the portrait itself. The full NIFT section can already intersect
  // while the avatar is still below the fold, which used to spend the first
  // blink before Tag Along had scrolled the portrait into view.
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .02;
    window.clearTimeout(timer);
    if (!visible) avatar.classList.remove('is-blinking');
    else if (preludeBlinkRequested) blinkForPrelude();
    else scheduleBlink();
  }, { threshold: [0, .02, .2] });
  observer.observe(avatar);
}

let niftSequenceTimer;
function bindNiftSceneSequence() {
  const figure = document.querySelector('.nift-figure');
  const controls = document.querySelector('.topic-controls');
  if (!figure || !controls || figure.dataset.sequenceBound) return;
  figure.dataset.sequenceBound = 'true';
  const topics = ['composition', 'colour', 'stories', 'details'];
  let cycling = false;
  const stop = (reset = true) => {
    cycling = false;
    clearTimeout(niftSequenceTimer);
    if (reset) setTopic('idle');
  };
  figure.addEventListener('pointerenter', () => {
    stop(false);
    cycling = true;
    let index = 0;
    setTopic(topics[index]);
    const advance = () => {
      if (!cycling || index >= topics.length - 1) { cycling = false; return; }
      setTopic(topics[++index]);
      niftSequenceTimer = setTimeout(advance, 1050);
    };
    niftSequenceTimer = setTimeout(advance, 1050);
  });
  figure.addEventListener('pointerleave', () => stop(true));
  controls.addEventListener('pointerleave', event => {
    if (!figure.contains(event.relatedTarget)) stop(true);
  });
  controls.addEventListener('focusout', event => {
    if (!controls.contains(event.relatedTarget)) stop(true);
  });
}

function setTopic(topic) {
  const stage = document.querySelector('.nift-scene');
  if (!stage) return;
  stage.dataset.topic = topic;
  stage.classList.toggle('has-topic', topic !== 'idle');
  const captions = {
    composition: 'Framing · where the eye lands',
    colour: 'Colour · mood and contrast',
    stories: 'Storytelling · images in sequence',
    details: 'Details · small choices, big feeling'
  };
  document.querySelector('.topic-caption').textContent = captions[topic];
  const voice = document.querySelector('.nift-voice .avatar-dialogue em');
  if (voice) voice.textContent = ({
    composition: '“I started noticing how a frame guides your eye.”',
    colour: '“Colour could change the whole feeling.”',
    stories: '“A picture could hold a whole sequence.”',
    details: '“And the smallest things had a story too.”'
  })[topic];
  document.querySelectorAll('.nift-plate').forEach(plate => plate.classList.toggle('is-active', topic !== 'idle' && plate.classList.contains(`plate-${topic}`)));
  document.querySelectorAll('[data-topic-choice]').forEach(button => button.setAttribute('aria-pressed', String(topic !== 'idle' && button.dataset.topicChoice === topic)));
}

function bindScrollStory() {
  const opening = document.querySelector('.opening');
  const update = () => {
    scrollPending = false;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progressFill.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
    if (opening) {
      const rect = opening.getBoundingClientRect();
      const range = Math.max(1, opening.offsetHeight - innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / range));
      const stage = progress < .04 ? 0 : progress < .30 ? 1 : progress < .58 ? 2 : progress < .82 ? 3 : 4;
      opening.dataset.stage = String(stage);
      const whisper = opening.querySelector('.opening-whisper');
      if (whisper) whisper.textContent = stage === 0 ? '…' : stage === 1 ? 'oh.' : stage === 2 ? 'okay.' : '';
    }
    const ending = document.querySelector('.ending-section');
    if (ending) {
      const rect = ending.getBoundingClientRect();
      const range = Math.max(1, ending.offsetHeight - innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / range));
      const stage = progress < .07 ? 0 : progress < .26 ? 1 : progress < .45 ? 2 : progress < .64 ? 3 : progress < .82 ? 4 : 5;
      ending.dataset.endStage = String(stage);
    }
    document.querySelectorAll('.travel-section, .bengaluru-section').forEach(section => {
      const figure = section.querySelector('.travel-figure');
      if (!figure) return;
      const rect = section.getBoundingClientRect();
      const travelProgress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (rect.height + innerHeight)));
      figure.dataset.pose = travelProgress < .52 ? 'first-step' : 'second-step';
    });
    const travel = document.querySelector('.travel-story');
    if (travel) {
      const rect = travel.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (rect.height + innerHeight)));
      travel.querySelector('.travel-art').dataset.pose = progress < .5 ? 'first-step' : 'second-step';
    }
    const sant = document.querySelector('.sant-section');
    if (sant) {
      const rect = sant.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (rect.height + innerHeight)));
      const scene = sant.querySelector('.sant-present-scene');
      if (scene) scene.dataset.pose = progress < .63 ? 'walk' : 'present';
    }
    const research = document.querySelector('.research-figure');
    if (research) {
      const rect = research.closest('.research-section').getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (rect.height + innerHeight)));
      research.dataset.pose = progress < .38 ? 'walk' : 'research';
    }
    const shift = document.querySelector('.question-section');
    if (shift) {
      const rect = shift.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (rect.height + innerHeight)));
      const walker = shift.querySelector('.shift-walker');
      if (walker) walker.dataset.pose = progress < .55 ? 'walk' : 'talk';
    }
  };
  const onScroll = () => {
    if (opening && scrollY > 4) opening.classList.add('has-interacted');
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function observeReveal() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) { items.forEach(item => item.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  items.forEach(item => observer.observe(item));
}

function renderProject(slug) {
  const project = projects.find(item => item.slug === slug);
  if (!project) return renderNotFound();
  if (slug === 'matera') return renderProjectStory(project);
  if (slug === 'jazaa' || slug === 'cms') return renderProjectStory(project);
  renderComingSoon({
    title: `The ${project.title} story is coming together.`,
    message: `I’m gathering the work and decisions behind ${project.title}. I’ll bring you through it soon.`,
    backHref: '/',
    backLabel: 'Back to my journey'
  });
}

function renderProjectStory(project) {
  document.body.dataset.page = 'deep-page';
  const fromPortfolio = new URLSearchParams(location.search).get('from') === 'portfolio';
  const isCms = project.slug === 'cms';
  const isMatera = project.slug === 'matera';
  const backLink = fromPortfolio ? '<a class="back-link" href="/portfolio/">← Back to Portfolio</a>' : isCms || isMatera ? '<a class="back-link" href="/experience/janitri">← Back to Janitri</a>' : '<a class="back-link" href="/experience/sant-rams">← Back to Sant Ram’s</a>';
  const kicker = isMatera ? 'Selected work / 01 · Medtech · UX/UI' : isCms ? 'Selected work / 02 · Medtech · UX/UI' : 'Selected work / 03 · E-commerce · UX/UI';
  const lede = isMatera ? project.summary : isCms ? 'I designed alert and empty states for Janitri’s Assam public-health rollout, supporting centralized maternal and fetal monitoring.' : 'I explored JAZAA’s e-commerce website experience, shaping its information architecture, landing page and visual direction during my internship at Sant Ram’s Jewellers.';
  const diamond = '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 24 22 11h20l10 13-20 30L12 24Z M12 24h40M22 11l10 43 10-43M22 11l10 13 10-13M12 24l20 30 20-30" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  const title = isMatera ? 'Matera' : isCms ? 'CMS' : '<span class="project-story-jazaa-mark">' + diamond + 'JAZAA</span>';
  const subtitle = isMatera ? 'Nurse-facing ANC experience' : isCms ? 'Central monitoring system' : 'Lab-grown diamond website experience';
  const hook = isMatera ? 'The monitor had the readings. Nurses had to build the story.' : isCms ? 'One connected monitoring system. Every state needed to be clear.' : 'A new brand needed a digital home. One as considered as its jewellery.';
  const roleLine = isMatera ? '<span><b>My role</b>Solo UX/UI designer</span><span><b>Guidance</b>Team-lead guidance · AVP review</span>' : isCms ? '<span><b>My role</b>UX/UI designer</span><span><b>Design scope</b>Alerts · Empty states</span>' : '<span><b>My role</b>UI/UX · Visual communication</span><span><b>Brand</b>JAZAA · Lab-grown diamonds</span>';
  const contextLine = isMatera ? '<span><b>Research</b>Six nurses · Rangadore Memorial Hospital</span><span><b>Design scope</b>Patient context · Symptoms · Monitoring</span>' : isCms ? '<span><b>Rollout context</b>Assam · Public health</span><span><b>Monitoring network</b>41 government hospitals · 82 cCTG devices</span>' : '<span><b>Design scope</b>Landing page · IA · Task flows</span><span><b>Context</b>Sant Ram’s Jewellers · Summer 2025</span>';
  const materaCaseUrl = 'https://www.figma.com/proto/nXlj4AyVUoA4G7ztBGQvcG/MATERA-ANC-FINAL?node-id=2264-416&t=O89vURF3ahrI2s0G-1&scaling=scale-down-width&content-scaling=fixed&page-id=2244%3A2&starting-point-node-id=2264%3A416';
  const materaPrototypeUrl = 'https://www.figma.com/design/2fCrSdBPX90JpncH6V6W0L/ANC-for-chat-gpt?node-id=527-54637';
  const materaIaUrl = 'https://www.figma.com/board/JOMXpYiZgNP4io3lmXPFnt/ANC-SITE-MAP?node-id=0-1&t=R4ULu80I1WIoXhQ1-1';
  const caseStudyUrl = 'https://www.figma.com/proto/3iLIvKNIdSq6dEG9tfLB1f/Jazaa-%E2%80%94-Landing-Page-Prototype?node-id=144-5237&t=HVESpVY0m77S6b0l-1&scaling=scale-down-width&content-scaling=fixed&page-id=138%3A5032&starting-point-node-id=138%3A5033';
  const landingUrl = 'https://www.figma.com/proto/3iLIvKNIdSq6dEG9tfLB1f/Jazaa-%E2%80%94-Landing-Page-Prototype?node-id=64-5672&t=kUo2BnN7Jcvj0vmc-1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=64%3A5672';
  const resources = isMatera
    ? '<a class="button-link" href="' + materaCaseUrl + '" target="_blank" rel="noopener noreferrer">Matera case study <span aria-hidden="true">↗</span></a><a class="button-link" href="' + materaPrototypeUrl + '" target="_blank" rel="noopener noreferrer">Explore the prototype <span aria-hidden="true">↗</span></a><a class="text-link" href="' + materaIaUrl + '" target="_blank" rel="noopener noreferrer">View IA &amp; user flows <span aria-hidden="true">↗</span></a>'
    : isCms
      ? '<a class="button-link" href="' + project.prototypeUrl + '" target="_blank" rel="noopener noreferrer">View CMS prototype <span aria-hidden="true">↗</span></a><a class="text-link" href="/experience/janitri">Janitri résumé context <span aria-hidden="true">↗</span></a>'
      : '<a class="button-link" href="' + caseStudyUrl + '" target="_blank" rel="noopener noreferrer">JAZAA case study · IA &amp; flows <span aria-hidden="true">↗</span></a><a class="button-link" href="' + landingUrl + '" target="_blank" rel="noopener noreferrer">Landing page prototype <span aria-hidden="true">↗</span></a>';
  const contents = project.sections.map((section, index) => '<section class="project-story-beat reveal-on-scroll" id="' + project.slug + '-beat-' + (index + 1) + '" aria-labelledby="' + project.slug + '-beat-title-' + (index + 1) + '"><p class="eyebrow">0' + (index + 1) + ' / ' + project.title + '</p><h2 id="' + project.slug + '-beat-title-' + (index + 1) + '">' + section[0] + '</h2><p>' + section[1] + '</p></section>').join('');
  const tracks = Array.from({ length: 5 }, (_, index) => '<span data-story-beat="' + index + '"></span>').join('');
  main.innerHTML = '<article class="deep-page project-story-page project-story-page--' + project.slug + ' matera-case-page"><div class="wrap">' + backLink +
    '<section class="matera-case-section matera-moment-intro project-story-moment" aria-label="' + project.title + ' project introduction"><div class="wrap matera-moment-intro__layout">' +
    '<figure class="matera-moment-intro__avatar" aria-label="Shruti seated with her notebook as each part of the ' + project.title + ' story is revealed"><div class="matera-intro-avatar__art" data-avatar-frame="greet"><img class="matera-intro-avatar__state" src="' + ASSET + 'matera-intro-v3/greet-open.png" alt="" width="1301" height="1209" fetchpriority="high" decoding="async"><img class="matera-intro-avatar__blink" src="' + ASSET + 'matera-intro-v3/greet-blink.png" alt="" width="1301" height="1209" decoding="async" aria-hidden="true"></div></figure>' +
    '<div class="matera-moment-intro__content"><div class="matera-opening-story" aria-label="' + project.title + ' introduction and project links"><div class="matera-opening-story__pin matera-hero-story__pin" aria-live="polite">' +
    '<div class="matera-hero-copy-stage" data-project-copy><div class="matera-hero-copy-beat" data-copy-reveal="0"><p class="eyebrow matera-hero-kicker">' + kicker + '</p><div class="matera-hero-title-block"><h1 class="matera-moment-intro__title">' + title + '</h1><p class="matera-hero-subtitle">' + subtitle + '</p></div></div>' +
    '<div class="matera-hero-copy-beat" data-copy-reveal="1"><h2 id="' + project.slug + '-intro-title" aria-label="' + hook + '">' + hook + '</h2></div><div class="matera-hero-copy-beat" data-copy-reveal="2"><p class="deep-lede matera-moment-intro__lede">' + lede + '</p></div>' +
    '<div class="matera-hero-copy-beat" data-copy-reveal="3"><div class="matera-case-meta" aria-label="Project role and scope">' + roleLine + '</div><div class="matera-case-meta matera-case-meta--fieldwork" aria-label="Project context">' + contextLine + '</div></div></div>' +
    '<nav class="project-story-quicklinks" aria-label="' + project.title + ' project resources"><p class="eyebrow">Explore this work</p><div class="matera-resource-links">' + resources + '</div></nav>' +
    '<div class="matera-hero-resource-stage" data-project-resources aria-label="' + project.title + ' project links" aria-hidden="true" inert><p class="eyebrow">Take a closer look</p><div class="matera-resource-links">' + resources + '</div></div></div>' +
    '<div class="matera-opening-story__track" aria-hidden="true">' + tracks + '</div></div></div></div></section>' +
    '<div id="' + project.slug + '-story" class="project-story-beats">' + contents + '</div><footer class="project-story-footer"><a class="text-link" href="' + (isCms ? '/experience/janitri' : '/experience/sant-rams') + '">Related résumé context <span aria-hidden="true">↗</span></a><a class="button-link" href="/portfolio/">Back to selected work <span aria-hidden="true">↑</span></a></footer></div></article>';
  bindProjectStoryScrollReveal();
  observeReveal();
}
function bindProjectStoryScrollReveal() {
  const intro = document.querySelector('.project-story-moment');
  const introArt = intro && intro.querySelector('.matera-intro-avatar__art');
  if (!intro || !introArt || intro.dataset.storyBound) return;
  intro.dataset.storyBound = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const beats = [...intro.querySelectorAll('[data-story-beat]')];
  const copyStage = intro.querySelector('[data-project-copy]');
  const copySteps = [...intro.querySelectorAll('[data-copy-reveal]')];
  const resourceStage = intro.querySelector('[data-project-resources]');
  const heroHeadline = intro.querySelector('h2[id$="-intro-title"]');
  const headlineCopy = heroHeadline ? heroHeadline.textContent : '';
  const avatarStates = ['greet', 'title', 'thinking', 'screen-up', 'screen-down'];
  const stateImage = introArt.querySelector('.matera-intro-avatar__state');
  const blinkImage = introArt.querySelector('.matera-intro-avatar__blink');
  const frameCache = new Map(avatarStates.map(state => {
    const open = new Image(), blink = new Image();
    open.src = ASSET + 'matera-intro-v3/' + state + '-open.png';
    blink.src = ASSET + 'matera-intro-v3/' + state + '-blink.png';
    return [state, { open, blink }];
  }));
  const framesReady = Promise.all([...frameCache.values()].flatMap(({ open, blink }) => [open, blink].map(img => img.decode && img.decode().catch(() => {}) || Promise.resolve())));
  let typingTimers = [], currentBeat = -1;
  const clearTyping = () => { typingTimers.forEach(window.clearTimeout); typingTimers = []; };
  const finishHeadline = () => { clearTyping(); if (heroHeadline) { heroHeadline.textContent = headlineCopy; heroHeadline.classList.add('is-headline-visible'); heroHeadline.classList.remove('is-typing'); } };
  const typeHeadline = () => {
    clearTyping();
    if (!heroHeadline) return;
    if (reduced) { finishHeadline(); return; }
    heroHeadline.textContent = '';
    heroHeadline.classList.add('is-headline-visible', 'is-typing');
    let delay = 0;
    [...headlineCopy].forEach(character => { delay += character === ' ' ? 25 : 33; typingTimers.push(window.setTimeout(() => { heroHeadline.textContent += character; }, delay)); });
    typingTimers.push(window.setTimeout(() => heroHeadline.classList.remove('is-typing'), delay + 40));
  };
  const setBeat = index => {
    const next = Math.max(0, Math.min(beats.length - 1, index));
    if (next === currentBeat) return;
    const previous = currentBeat;
    currentBeat = next;
    if (previous >= 0 && typeof playMateraScrollCue === 'function') playMateraScrollCue();
    const resourceVisible = next >= copySteps.length;
    const state = avatarStates[next] || 'screen-down';
    introArt.classList.remove('is-blinking');
    introArt.dataset.avatarFrame = state;
    introArt.dataset.avatarMotion = 'rest';
    if (stateImage) stateImage.src = ASSET + 'matera-intro-v3/' + state + '-open.png';
    if (blinkImage) blinkImage.src = ASSET + 'matera-intro-v3/' + state + '-blink.png';
    if (next === 1) {
      if (heroHeadline) { heroHeadline.textContent = ''; heroHeadline.classList.add('is-headline-visible', 'is-typing'); }
      framesReady.then(() => { if (currentBeat !== 1) return; introArt.classList.add('is-blinking'); window.setTimeout(() => introArt.classList.remove('is-blinking'), 150); window.setTimeout(() => { if (currentBeat === 1) typeHeadline(); }, reduced ? 0 : 420); });
    } else if (next > 1) finishHeadline();
    copyStage.classList.toggle('is-swapped', resourceVisible);
    resourceStage.classList.toggle('is-active', resourceVisible);
    copyStage.setAttribute('aria-hidden', String(resourceVisible));
    resourceStage.setAttribute('aria-hidden', String(!resourceVisible));
    copyStage.inert = resourceVisible;
    resourceStage.inert = !resourceVisible;
    copySteps.forEach((step, stepIndex) => step.classList.toggle('is-revealed', !resourceVisible && stepIndex <= next));
  };
  setBeat(0);
  framesReady.then(() => intro.classList.add('is-avatar-ready'));
  if (!reduced && 'IntersectionObserver' in window) {
    let blinkTimer = 0;
    const blinkObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !blinkTimer) blinkTimer = window.setInterval(() => {
        const rect = intro.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= innerHeight) return;
        introArt.classList.add('is-blinking'); window.setTimeout(() => introArt.classList.remove('is-blinking'), 150);
      }, 4200);
      else if (!entry.isIntersecting && blinkTimer) { window.clearInterval(blinkTimer); blinkTimer = 0; introArt.classList.remove('is-blinking'); }
    }, { threshold: 0 });
    blinkObserver.observe(intro);
  }
  if (beats.length) {
    let frame = 0;
    const sync = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const center = innerHeight / 2;
        let nearest = 0, distance = Infinity;
        beats.forEach((beat, index) => {
          const rect = beat.getBoundingClientRect(), nextDistance = Math.abs(rect.top + rect.height / 2 - center);
          if (nextDistance < distance) { distance = nextDistance; nearest = index; }
        });
        setBeat(nearest);
      });
    };
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }
}
function renderContact() {
  document.body.dataset.page = 'deep-page';
  main.innerHTML = '<article class="deep-page contact-page contact-approved-page" id="main"><div class="wrap connect-wrap">' +
    '<header class="connect-intro"><p class="eyebrow">Connect</p><h1>Good things start<br><em>with a conversation.</em></h1><p>Have a project, an opportunity, or an idea? I’d love to hear about it.</p></header>' +
    '<section class="connect-scene" aria-label="Three ways to connect with Shruti"><div class="connect-birds" aria-hidden="true"></div><div class="connect-stage" data-connect-state="neutral">' +
    '<a class="connect-option connect-option--linkedin" data-connect="linkedin" href="https://www.linkedin.com/in/shruti-singh0218" target="_blank" rel="noopener noreferrer"><span class="connect-option__icon"><img src="' + ASSET + 'contact-icons/linkedin.svg" alt="" width="64" height="64"></span><span class="connect-option__copy"><strong class="button-link connect-option__label">LinkedIn <span aria-hidden="true">↗</span></strong><span>Let’s stay connected.</span></span></a>' +
    '<figure class="connect-avatar" aria-label="Shruti reacts with a small wave, an envelope or a glance at her phone as you explore the contact options"><div class="connect-avatar__frames">' +
    '<img class="connect-avatar__frame is-active" data-connect-frame="neutral-smile" src="' + ASSET + 'connect-v1/neutral-closed-smile.webp" alt="" width="1024" height="1536" fetchpriority="high" decoding="async">' +
    '<img class="connect-avatar__frame" data-connect-frame="neutral-blink" src="' + ASSET + 'connect-v1/neutral-closed-blink.webp" alt="" width="1024" height="1536" decoding="async">' +
    '<img class="connect-avatar__frame" data-connect-frame="linkedin-wave-1" src="' + ASSET + 'connect-v1/linkedin-wave-1.webp" alt="" width="1024" height="1536" decoding="async"><img class="connect-avatar__frame" data-connect-frame="linkedin-wave-2" src="' + ASSET + 'connect-v1/linkedin-wave-2.webp" alt="" width="1024" height="1536" decoding="async">' +
    '<img class="connect-avatar__frame" data-connect-frame="email-open" src="' + ASSET + 'connect-v1/email-open.webp" alt="" width="1024" height="1536" decoding="async"><img class="connect-avatar__frame" data-connect-frame="email-blink" src="' + ASSET + 'connect-v1/email-blink.webp" alt="" width="1024" height="1536" decoding="async">' +
    '<img class="connect-avatar__frame" data-connect-frame="whatsapp-open" src="' + ASSET + 'connect-v1/whatsapp-open.webp" alt="" width="1024" height="1536" decoding="async"><img class="connect-avatar__frame" data-connect-frame="whatsapp-blink" src="' + ASSET + 'connect-v1/whatsapp-blink.webp" alt="" width="1024" height="1536" decoding="async"></div></figure>' +
    '<a class="connect-option connect-option--email" data-connect="email" href="mailto:Shruti786aaa@gmail.com"><span class="connect-option__icon"><img src="' + ASSET + 'contact-icons/gmail.webp" alt="" width="64" height="64"></span><span class="connect-option__copy"><strong class="button-link connect-option__label">Email <span aria-hidden="true">↗</span></strong><span>Have something in mind? Let’s talk.</span></span></a>' +
    '<a class="connect-option connect-option--whatsapp" data-connect="whatsapp" href="https://wa.me/919572697539" target="_blank" rel="noopener noreferrer"><span class="connect-option__icon"><img src="' + ASSET + 'contact-icons/whatsapp.svg" alt="" width="64" height="64"></span><span class="connect-option__copy"><strong class="button-link connect-option__label">WhatsApp <span aria-hidden="true">↗</span></strong><span>Start a conversation.</span></span></a></div></section>' +
    '<div class="connect-closing"><h2>Maybe your team is my next chapter.</h2><a class="button-link" href="mailto:Shruti786aaa@gmail.com">Let’s make something together <span aria-hidden="true">↗</span></a></div></div></article>';
  const birds = main.querySelector('.connect-birds');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (birds && !reducedMotion) {
    const loadScript = (src, ready) => {
      if (ready()) return Promise.resolve();
      return new Promise((resolve, reject) => {
        let script = [...document.scripts].find(item => item.src === src);
        if (!script) { script = document.createElement('script'); script.src = src; script.async = true; document.head.appendChild(script); }
        script.addEventListener('load', resolve, { once: true }); script.addEventListener('error', reject, { once: true });
      });
    };
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', () => Boolean(window.THREE))
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.birds.min.js', () => Boolean(window.VANTA && window.VANTA.BIRDS)))
      .then(() => {
        if (!birds.isConnected || !window.VANTA || !window.VANTA.BIRDS) return;
        window.VANTA.BIRDS({ el: birds, THREE: window.THREE, mouseControls: false, touchControls: false, gyroControls: false, minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1, backgroundAlpha: 0, backgroundColor: 465199, color1: 15053479, color2: 15392425, colorMode: 'varianceGradient', birdSize: .88, quantity: 5, wingSpan: 24, speedLimit: 2.7, separation: 25, alignment: 18, cohesion: 16 });
        birds.classList.add('is-vanta-ready');
      })
      .catch(() => birds.classList.add('is-vanta-fallback'));
  }
  const stage = main.querySelector('.connect-stage');
  const frames = [...main.querySelectorAll('[data-connect-frame]')];
  let blinkTimer = 0, waveTimer = 0;
  const showFrame = name => frames.forEach(frame => frame.classList.toggle('is-active', frame.dataset.connectFrame === name));
  const setConnect = state => {
    stage.dataset.connectState = state;
    window.clearInterval(blinkTimer); blinkTimer = 0; window.clearInterval(waveTimer); waveTimer = 0;
    if (state === 'linkedin') { showFrame('linkedin-wave-1'); let wave = 1; waveTimer = window.setInterval(() => { wave = wave === 1 ? 2 : 1; showFrame('linkedin-wave-' + wave); }, 760); }
    else if (state === 'email' || state === 'whatsapp') {
      showFrame(state + '-open');
      blinkTimer = window.setInterval(() => { showFrame(state + '-blink'); window.setTimeout(() => { if (stage.dataset.connectState === state) showFrame(state + '-open'); }, 170); }, 3900);
    } else {
      showFrame('neutral-smile');
      blinkTimer = window.setInterval(() => { if (stage.dataset.connectState !== 'neutral') return; showFrame('neutral-blink'); window.setTimeout(() => { if (stage.dataset.connectState === 'neutral') showFrame('neutral-smile'); }, 170); }, 4300);
    }
  };
  main.querySelectorAll('[data-connect]').forEach(option => {
    option.addEventListener('pointerenter', () => setConnect(option.dataset.connect));
    option.addEventListener('pointerleave', () => { if (!option.matches(':focus')) setConnect('neutral'); });
    option.addEventListener('focus', () => setConnect(option.dataset.connect));
    option.addEventListener('blur', () => setConnect('neutral'));
  });
  setConnect('neutral');
}
function renderNotFound() {
  renderComingSoon({ title: 'This page is still taking shape.', message: 'I’m working on this part of the story. There’ll be more to see here soon.', backHref: '/', backLabel: 'Back to my journey' });
}

function bindReturnLinks(scene) {
  document.querySelectorAll('[data-return-to-journey]').forEach(link => link.addEventListener('click', () => {
    const savedHash = link.dataset.returnHash || sessionStorage.getItem('journeyHash') || `#${scene}`;
    sessionStorage.setItem('storybook-preview-seen', '1');
    sessionStorage.setItem('restoreJourneyHash', savedHash);
    sessionStorage.removeItem('journeyHash');
  }));
}

function restoreJourneyPosition() {
  const hash = sessionStorage.getItem('restoreJourneyHash');
  if (!hash) return;
  sessionStorage.removeItem('restoreJourneyHash');
  if (hash === '#janitri') document.querySelector('.janitri-id-chapter')?.setAttribute('data-returned-from-deep-dive', 'true');
  const story = document.getElementById('journey-content');
  story.hidden = false;
  story.classList.add('is-revealed');
  const gateway = document.querySelector('.hero-gateway');
  if (gateway) gateway.hidden = true;
  document.body.classList.add('story-open');
  bindHomeInteractions();
  bindScrollStory();
  observeReveal();
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' })));
}

// Back navigation can restore the home page from the browser's page cache,
// bypassing renderHome(). Reapply the saved branch position in that case too.
window.addEventListener('pageshow', () => {
  if (location.pathname === '/') restoreJourneyPosition();
});


function howThinkMarkup() {
  return `    <section class="how-think" id="about" aria-label="How Shruti thinks and where she hopes to go next">
      <span id="now" class="how-think-anchor" aria-hidden="true"></span>
      <div class="think-film is-intro" aria-label="Six ways of figuring things out" data-beat="look">
        <div class="think-film-media">
          <video class="think-film-video" preload="auto" playsinline aria-label="Shruti explores look, question, understand, make, test, and learn">
            <source src="${ASSET}how-i-think-web.mp4" type="video/mp4">
          </video>
        </div>
        <div class="think-film-sidecopy">
          <p class="think-film-kicker">A little of how I work</p>
          <p class="think-film-prelude ux-typewriter" aria-live="polite" aria-atomic="true"></p>
          <p class="think-film-caption ux-typewriter" aria-live="polite" aria-atomic="true">LOOK</p>
          <p class="think-film-line" aria-live="polite">Notice what’s there before deciding what it needs.</p>
          <p class="think-film-transcript">LOOK · QUESTION · UNDERSTAND · MAKE · TEST · LEARN</p>
          <button class="think-film-replay" type="button" hidden>Replay animation <span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <div class="think-ending" id="contact" data-stage="waiting">
        <div class="think-ending-inner">
          <p class="eyebrow think-ending-kicker">How I think</p>
          <h2 class="think-ending-lede">Somewhere along the way, I found my way of figuring things out.</h2>
          <div class="think-process" aria-label="Look, question, understand, make, test, learn">
            <span>LOOK</span><i aria-hidden="true">→</i><span>QUESTION</span><i aria-hidden="true">→</i><span>UNDERSTAND</span><i aria-hidden="true">→</i><span>MAKE</span><i aria-hidden="true">→</i><span>TEST</span><i aria-hidden="true">→</i><span>LEARN</span>
          </div>
          <p class="think-handnote">rarely this neat, btw.</p>
          <div class="think-career" aria-label="NIFT, Sant Ram’s, Janitri, now, and what comes next">
            <span>NIFT</span><i aria-hidden="true">→</i><span>SANT RAM’S</span><i aria-hidden="true">→</i><span>JANITRI</span><i aria-hidden="true">→</i><span>NOW</span><i aria-hidden="true">→</i><strong>?</strong>
          </div>
          <p class="think-room">room for one more…</p>
          <h3 class="think-team">Maybe your team goes here?</h3>
          <div class="think-actions">
            <a class="button-link think-work-cta" href="mailto:Shruti786aaa@gmail.com">Let’s make something together <span aria-hidden="true">↗</span></a>
            <a class="text-link think-deeper-cta" href="/portfolio">Step inside <span aria-hidden="true">↗</span></a>
          </div>
          <div class="think-contact-links"><a href="mailto:Shruti786aaa@gmail.com">Shruti786aaa@gmail.com</a><a href="https://www.linkedin.com/in/shruti-singh0218" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
        </div>
      </div>
    </section>`;
}

function renderDesignProcess() {
  document.body.dataset.page = 'process-page';
  main.innerHTML = `<div class="design-process-branch"><a class="process-return" href="/#next-ending">← Back to the next chapter</a>${howThinkMarkup()}</div>`;
  bindHowIThink();
}

function bindJanitriDeepDive() {
  const page = document.querySelector('.janitri-deep-page');
  if (!page || page.dataset.bound) return;
  page.dataset.bound = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arrival = page.querySelector('.jd-arrival');
  const questions = page.querySelector('.jd-questions');
  const screens = page.querySelector('.jd-screens');
  const ideaAvatar = screens?.querySelector('.jd-idea-avatar');
  let ideaMotionStarted = false;
  let ideaSequenceTimer = 0;
  let ideaPoseTimer = 0;
  let ideaSequenceFinished = false;
  let playIdeaSequence = () => {};
  const enterFinalIdeaPose = () => {
    if (!ideaAvatar || ideaSequenceFinished) return;
    ideaSequenceFinished = true;
    window.clearTimeout(ideaSequenceTimer);
    window.clearTimeout(ideaPoseTimer);
    ideaAvatar.classList.remove('is-snap-open', 'is-snap-wink', 'is-snap-blink', 'is-snap-final', 'is-finalizing', 'is-snapping', 'is-reversing');
    ideaAvatar.classList.add('is-snap-final');
    if (!reduced) {
      ideaAvatar.classList.add('is-snapping');
      ideaPoseTimer = window.setTimeout(() => ideaAvatar.classList.remove('is-snapping'), 520);
    }
  };
  const reverseFinalIdeaPose = () => {
    if (!ideaAvatar || (!ideaSequenceFinished && !ideaMotionStarted)) return;
    const wasFinished = ideaSequenceFinished;
    window.clearTimeout(ideaSequenceTimer);
    window.clearTimeout(ideaPoseTimer);
    ideaSequenceFinished = false;
    ideaMotionStarted = false;
    ideaAvatar.classList.remove('is-snap-final', 'is-snap-blink', 'is-snap-wink', 'is-snapping', 'is-finalizing');
    ideaAvatar.classList.add('is-snap-open');
    if (!reduced && wasFinished) {
      ideaAvatar.classList.add('is-snapping', 'is-reversing');
      ideaPoseTimer = window.setTimeout(() => {
        ideaAvatar.classList.remove('is-snapping', 'is-reversing');
        if (!ideaSequenceFinished) ideaAvatar.classList.add('is-snap-open');
      }, 520);
    }
  };
  const startIdeaMotion = () => {
    if (!ideaAvatar || ideaMotionStarted || ideaSequenceFinished) return;
    ideaMotionStarted = true;
    if (reduced) { enterFinalIdeaPose(); return; }
    const show = (pose, snapping = false) => {
      ideaAvatar.classList.remove('is-snap-open', 'is-snap-wink', 'is-snap-blink', 'is-snap-final', 'is-finalizing', 'is-snapping', 'is-reversing');
      ideaAvatar.classList.add(`is-${pose}`);
      if (snapping) ideaAvatar.classList.add('is-snapping');
    };
    playIdeaSequence = () => {
      if (ideaSequenceFinished) return;
      show('snap-open');
      ideaSequenceTimer = window.setTimeout(() => {
        show('snap-blink');
        ideaSequenceTimer = window.setTimeout(() => {
          show('snap-open');
          ideaSequenceTimer = window.setTimeout(() => {
            show('snap-wink');
            ideaSequenceTimer = window.setTimeout(() => {
              show('snap-open');
              ideaSequenceTimer = window.setTimeout(enterFinalIdeaPose, 180);
            }, 240);
          }, 260);
        }, 150);
      }, 260);
    };
    playIdeaSequence();
  };
  let whiteFrameEdgeCrossed = screens ? screens.getBoundingClientRect().top <= 0 : false;
  const syncIdeaToWhiteFrameEdge = () => {
    if (!screens) return;
    const crossed = screens.getBoundingClientRect().top <= 0;
    if (crossed === whiteFrameEdgeCrossed) return;
    whiteFrameEdgeCrossed = crossed;
    if (!crossed) reverseFinalIdeaPose();
  };
  window.addEventListener('scroll', syncIdeaToWhiteFrameEdge, { passive: true });
  window.addEventListener('resize', syncIdeaToWhiteFrameEdge, { passive: true });
  let storyAutoScrollCancelled = false;
  let storyAutoScrollFrame = 0;
  let storyAutoScrollTimer = 0;
  const cancelStoryAutoScroll = () => {
    storyAutoScrollCancelled = true;
    window.clearTimeout(storyAutoScrollTimer);
    if (storyAutoScrollFrame) window.cancelAnimationFrame(storyAutoScrollFrame);
  };
  const storyAutoScrollTo = (target, duration) => new Promise(resolve => {
    if (storyAutoScrollCancelled || reduced) { resolve(false); return; }
    const start = window.scrollY;
    const distance = Math.max(0, target - start);
    if (!distance) { resolve(true); return; }
    const began = performance.now();
    const tick = now => {
      if (storyAutoScrollCancelled) { storyAutoScrollFrame = 0; resolve(false); return; }
      const progress = Math.min(1, (now - began) / duration);
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) storyAutoScrollFrame = window.requestAnimationFrame(tick);
      else { storyAutoScrollFrame = 0; resolve(true); }
    };
    storyAutoScrollFrame = window.requestAnimationFrame(tick);
  });
  const watchForStoryInteraction = () => {
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(type => window.addEventListener(type, cancelStoryAutoScroll, { once: true, passive: true, capture: true }));
  };
  const avatarFramesReady = Promise.all([...questions.querySelectorAll('.jd-avatar-frame')].map(frame => frame.decode().catch(() => {})));
  let typingContext;
  const primeTypingSound = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    typingContext ||= interfaceAudioContext || new AudioContextClass();
    interfaceAudioContext ||= typingContext;
    if (typingContext.state !== 'running') typingContext.resume().catch(() => {});
  };
  ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(type => window.addEventListener(type, primeTypingSound, { passive: true, capture: true }));
  primeTypingSound();
  const typeJanitriCopy = (element, copy, duration, cue, owner = arrival, onDone) => {
    if (!element) return;
    element.textContent = '';
    owner.dataset.typing = cue;
    const interval = duration / Math.max(1, copy.length);
    let index = 0;
    const typeNext = () => {
      if (index >= copy.length) { onDone?.(); return; }
      const character = copy[index++];
      element.textContent += character;
      if (character !== ' ' && typingContext?.state === 'running') playTypewriterKey(typingContext);
      if (index < copy.length) window.setTimeout(typeNext, interval);
      else onDone?.();
    };
    typeNext();
  };
  const animateArrival = () => {
    if (arrival.dataset.started) return;
    arrival.dataset.started = 'true';
    const avatar = arrival.querySelector('.arrival-avatar');
    const pose = value => { if (avatar) avatar.dataset.pose = value; };
    const date = arrival.querySelector('.arrival-date');
    const caption = arrival.querySelector('.arrival-caption');
    const logoLink = arrival.querySelector('.jd-logo-link');
    const moveToQuestions = () => {
      if (reduced) return;
      watchForStoryInteraction();
      storyAutoScrollTimer = window.setTimeout(() => {
        const top = questions.getBoundingClientRect().top + window.scrollY;
        storyAutoScrollTo(top, 1450);
      }, 1500);
    };
    if (!avatar) return;
    if (reduced) {
      pose('recover');
      arrival.classList.add('is-landed', 'is-location-revealed');
      date.textContent = 'DECEMBER 2025 — APRIL 2026';
      caption.textContent = 'Janitri builds connected technology for maternal and newborn care.';
      arrival.dataset.typing = 'caption-done';
      arrival.classList.add('is-arrival-complete');
      if (logoLink) logoLink.style.opacity = '1';
      moveToQuestions();
      return;
    }
    avatar.querySelectorAll('img').forEach(image => image.decode?.().catch(() => {}));
    pose('drop');
    playStoryCue('jump', false, arrival);
    arrival.classList.add('is-arriving');
    window.setTimeout(() => pose('midair'), 250);
    window.setTimeout(() => { pose('impact'); playStoryCue('touchdown'); arrival.classList.add('is-touchdown'); }, 1220);
    window.setTimeout(() => pose('recover'), 1560);
    window.setTimeout(() => {
      pose('stride-cycle');
      arrival.classList.add('is-landed');
      arrival.classList.remove('is-arriving', 'is-touchdown');
      playStoryCue('location');
      arrival.classList.add('is-location-revealed');
      window.setTimeout(() => {
        typeJanitriCopy(date, 'DECEMBER 2025 — APRIL 2026', 1050, 'city-date');
        window.setTimeout(() => {
          const companyCopy = 'Janitri builds connected technology for maternal and newborn care.';
          typeJanitriCopy(caption, companyCopy, 2100, 'caption');
          window.setTimeout(() => {
            arrival.dataset.typing = 'caption-done';
            pose('stride-cycle');
            arrival.classList.add('is-arrival-complete');
            moveToQuestions();
          }, 2150);
        }, 1150);
      }, 420);
    }, 2050);
  };
  const startQuestions = () => {
    if (questions.dataset.started) return;
    questions.dataset.started = 'true';
    questions.classList.add('is-in-view');
    const avatar = questions.querySelector('.jd-seated-avatar');
    const cards = [...questions.querySelectorAll('.jd-question')];
    const marks = [...questions.querySelectorAll('.jd-question-icon')];
    const setAvatarState = state => { if (avatar) avatar.dataset.avatarState = state; };
    const blinkThenLook = (state, done) => {
      if (!avatar || reduced) { setAvatarState(state); done?.(); return; }
      avatar.classList.add('is-blinking');
      window.setTimeout(() => {
        avatar.classList.remove('is-blinking');
        setAvatarState('looks-good');
        window.setTimeout(() => { setAvatarState(state); done?.(); }, 360);
      }, 145);
    };
    const lookToQuestion = done => {
      if (!avatar || reduced) { setAvatarState('gaze'); done?.(); return; }
      setAvatarState('looks-good');
      window.setTimeout(() => { setAvatarState('gaze'); done?.(); }, 300);
    };
    const dropSound = () => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        typingContext ||= interfaceAudioContext || new AudioContextClass();
        interfaceAudioContext ||= typingContext;
        const ctx = typingContext;
        const play = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const now = ctx.currentTime;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(620, now);
          osc.frequency.exponentialRampToValueAtTime(290, now + .16);
          gain.gain.setValueAtTime(.0001, now);
          gain.gain.exponentialRampToValueAtTime(.075, now + .012);
          gain.gain.exponentialRampToValueAtTime(.0001, now + .22);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + .23);
        };
        if (ctx.state === 'suspended') ctx.resume().then(play).catch(() => {});
        else play();
      } catch {}
    };
    const dropQuestionMark = index => {
      const mark = marks[index];
      if (!mark) return;
      mark.classList.remove('is-dropped');
      void mark.offsetWidth;
      mark.classList.add('is-dropped');
      dropSound();
    };
    let blinkLoop = 0;
    const startBlinkLoop = () => {
      if (reduced || blinkLoop) return;
      blinkLoop = window.setInterval(() => {
        if (questions.dataset.sequenceDone === 'true') { window.clearInterval(blinkLoop); blinkLoop = 0; return; }
        if (!avatar?.classList.contains('is-blinking')) {
          avatar?.classList.add('is-blinking');
          window.setTimeout(() => avatar?.classList.remove('is-blinking'), 165);
        }
      }, 3600);
    };
    let index = 0;
    const startLine = questions.querySelector('.jd-start-line');
    const revealNext = () => {
      if (index < cards.length) {
        const current = index++;
        lookToQuestion(() => {
          dropQuestionMark(current);
          window.setTimeout(() => {
            cards[current].classList.add('is-gathered');
            window.setTimeout(revealNext, 900);
          }, reduced ? 0 : 760);
        });
      } else {
        questions.dataset.sequenceDone = 'true';
        blinkThenLook('bridge', () => window.setTimeout(() => blinkThenLook('realisation', () => {
          questions.classList.add('is-organized');
          if (!reduced) window.setTimeout(() => {
            if (!storyAutoScrollCancelled) storyAutoScrollTo(handoffEndY + 24, 5200);
          }, 1250);
        }), 1450));
      }
    };
    if (reduced) {
      cards.forEach(item => item.classList.add('is-gathered'));
      marks.forEach(mark => { mark.classList.add('is-dropped'); });
      startLine.textContent = 'Where do I even begin?';
      setAvatarState('realisation');
      questions.dataset.sequenceDone = 'true';
      screens.classList.add('is-ready');
    } else avatarFramesReady.then(() => {
      startBlinkLoop();
      blinkThenLook('looks-good', () => window.setTimeout(() => blinkThenLook('questioning', () => {
        typeJanitriCopy(startLine, 'Where do I even begin?', 1550, 'start-line', questions, () => {
          questions.dataset.typing = 'start-line-done';
          window.setTimeout(() => { questions.dataset.typing = ''; revealNext(); }, 380);
        });
      }), 650));
    });
  };
  let answerHandoffStarted = false;
  let answerHandoffCompleted = false;
  const answerFlights = [];
  let handoffStartY = 0;
  let handoffEndY = 1;
  let handoffFrame = 0;
  const measureAnswerHandoff = () => {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const questionRect = questions.getBoundingClientRect();
    const screensRect = screens.getBoundingClientRect();
    handoffStartY = questionRect.bottom + scrollY - window.innerHeight * .82;
    handoffEndY = screensRect.top + scrollY + Math.max(260, window.innerHeight * .58);
    if (handoffEndY <= handoffStartY) handoffEndY = handoffStartY + window.innerHeight;
    const wasRunning = screens.classList.contains('is-flight-running');
    screens.classList.add('is-flight-running');
    answerFlights.forEach(flight => {
      const from = flight.source.getBoundingClientRect();
      const to = flight.targetImage.getBoundingClientRect();
      flight.from = { x: from.left + scrollX, y: from.top + scrollY, w: from.width, h: from.height };
      flight.to = { x: to.left + scrollX, y: to.top + scrollY, w: to.width, h: to.height };
      const copyFrom = flight.sourceCopy.getBoundingClientRect();
      const copyTo = flight.targetCopy.getBoundingClientRect();
      flight.copyFrom = { x: copyFrom.left + scrollX, y: copyFrom.top + scrollY, w: copyFrom.width, h: copyFrom.height };
      flight.copyTo = { x: copyTo.left + scrollX, y: copyTo.top + scrollY, w: copyTo.width, h: copyTo.height };
    });
    if (!wasRunning) screens.classList.remove('is-flight-running');
  };
  const updateAnswerHandoff = () => {
    handoffFrame = 0;
    if (!answerHandoffStarted || !answerFlights.length) return;
    if (matchMedia('(max-width: 760px)').matches) answerHandoffCompleted = true;
    if (answerHandoffCompleted) {
      screens.classList.remove('is-flight-running');
      screens.classList.add('is-ready');
      questions.classList.add('is-departing');
      answerFlights.forEach(({ source, sourceCopy, target, targetCopy, clone, copyClone }) => {
        source.classList.add('is-flight-hidden');
        sourceCopy.classList.add('is-flight-hidden');
        target.classList.remove('is-flight-arrived');
        target.classList.add('is-answer-revealed');
        targetCopy.classList.add('is-answer-revealed');
        clone.style.opacity = '0';
        copyClone.style.opacity = '0';
      });
      return;
    }
    const progress = Math.max(0, Math.min(1, (window.scrollY - handoffStartY) / (handoffEndY - handoffStartY)));
    if (progress <= 0) {
      screens.classList.remove('is-flight-running', 'is-ready');
      questions.classList.remove('is-departing');
      answerFlights.forEach(({ source, sourceCopy, target, targetCopy, clone, copyClone }) => {
        source.classList.remove('is-flight-hidden');
        sourceCopy.classList.remove('is-flight-hidden');
        target.classList.remove('is-flight-arrived');
        target.classList.remove('is-answer-revealed');
        clone.style.opacity = '0';
        copyClone.style.opacity = '0';
      });
      return;
    }
    questions.classList.add('is-departing');
    screens.classList.add('is-flight-running');
    answerFlights.forEach(({ source, sourceCopy, target, targetCopy, clone, copyClone, from, to, copyFrom, copyTo, index }) => {
      const stagger = index * .075;
      const local = Math.max(0, Math.min(1, (progress - stagger) / (1 - stagger)));
      const eased = local * local * (3 - 2 * local);
      const centerX = from.x + from.w / 2 + (to.x + to.w / 2 - from.x - from.w / 2) * eased;
      // Let each illustration arc into its answer bubble, then settle gently.
      const dropArc = Math.sin(Math.PI * eased) * Math.min(150, window.innerHeight * .2);
      const centerY = from.y + from.h / 2 + (to.y + to.h / 2 - from.y - from.h / 2) * eased + dropArc;
      const x = centerX - from.w / 2 - window.scrollX;
      const y = centerY - from.h / 2 - window.scrollY;
      const roll = -8 + 8 * eased;
      const flip = 180 * eased;
      const pitch = Math.sin(local * Math.PI) * 5;
      const landingDip = local > .86 ? Math.sin(((local - .86) / .14) * Math.PI) * 8 : 0;
      const scale = from.w ? 1 + (to.w / from.w - 1) * eased : 1;
      Object.assign(clone.style, {
        left: `${x}px`, top: `${y + landingDip}px`, width: `${from.w}px`, height: `${from.h}px`,
        opacity: local > 0 && local < .985 ? '1' : '0',
        transform: `perspective(1100px) rotateY(${flip}deg) rotateX(${pitch}deg) rotateZ(${roll}deg) scale(${scale})`
      });
      const copyX = copyFrom.x + (copyTo.x - copyFrom.x) * eased - window.scrollX;
      const copyY = copyFrom.y + (copyTo.y - copyFrom.y) * eased - window.scrollY + dropArc * .72;
      const copyW = copyFrom.w + (copyTo.w - copyFrom.w) * eased;
      const copyH = copyFrom.h + (copyTo.h - copyFrom.h) * eased;
      Object.assign(copyClone.style, {
        left: `${copyX}px`, top: `${copyY}px`, width: `${copyW}px`, minHeight: `${copyH}px`,
        opacity: local > 0 && local < .82 ? `${1 - local / .82}` : '0',
        transform: `rotate(${(1 - eased) * -2}deg) scale(${.98 + eased * .02})`
      });
      source.classList.toggle('is-flight-hidden', local > 0);
      sourceCopy.classList.toggle('is-flight-hidden', local > 0);
      target.classList.toggle('is-flight-arrived', local >= .96);
      target.classList.toggle('is-answer-revealed', local >= .96);
      targetCopy.classList.toggle('is-answer-revealed', local >= .96);
    });
    // Close the last few percent of travel once every item is essentially at
    // its destination. This gives the visitor a stable selection moment even
    // if they stop or nudge the page back before the exact scroll endpoint.
    if (progress >= .96) {
      answerHandoffCompleted = true;
      screens.classList.remove('is-flight-running');
      screens.classList.add('is-ready');
      questions.classList.add('is-departing');
      answerFlights.forEach(({ source, sourceCopy, target, targetCopy, clone, copyClone }) => {
        source.classList.add('is-flight-hidden');
        sourceCopy.classList.add('is-flight-hidden');
        target.classList.remove('is-flight-arrived');
        target.classList.add('is-answer-revealed');
        targetCopy.classList.add('is-answer-revealed');
        clone.style.opacity = '0';
        copyClone.style.opacity = '0';
      });
    } else screens.classList.remove('is-ready');
  };
  const scheduleAnswerHandoff = () => {
    if (!handoffFrame) handoffFrame = window.requestAnimationFrame(updateAnswerHandoff);
  };
  const refreshAnswerHandoff = () => {
    if (!answerHandoffStarted || reduced) return;
    // A desktop flight must settle before its targets reflow into a mobile stack.
    if (matchMedia('(max-width: 760px)').matches) {
      answerHandoffCompleted = true;
      scheduleAnswerHandoff();
      return;
    }
    measureAnswerHandoff();
    scheduleAnswerHandoff();
  };
  const startDeviceHandoff = () => {
    if (answerHandoffStarted) return;
    answerHandoffStarted = true;
    if (reduced || !Element.prototype.animate) {
      screens.classList.add('is-ready');
      screens.querySelectorAll('.jd-answer-card').forEach(card => card.classList.add('is-answer-revealed'));
      return;
    }
    if (matchMedia('(max-width: 760px)').matches) {
      screens.classList.add('is-ready');
      questions.classList.add('is-departing');
      [...screens.querySelectorAll('.jd-answer-card')].forEach((card, index) => {
        window.setTimeout(() => {
          card.classList.add('is-answer-revealed');
        }, 220 + index * 240);
      });
      return;
    }
    const illustrations = [...questions.querySelectorAll('.jd-question-illustration[data-illustration-kind]')];
    const targets = [...screens.querySelectorAll('.jd-answer-card[data-answer-kind]')];
    illustrations.forEach((source, index) => {
      const kind = source.dataset.illustrationKind;
      const target = targets.find(item => item.dataset.answerKind === kind);
      const sourceImage = source.querySelector('.jd-question-art');
      const targetImage = target?.querySelector('.jd-answer-art');
      const sourceCard = source.closest('.jd-question');
      const sourceCopy = sourceCard?.querySelector('.jd-question-copy');
      const targetCopy = target?.querySelector('.jd-answer-copy');
      if (!sourceImage || !target || !targetImage || !sourceCopy || !targetCopy) return;
      const clone = sourceImage.cloneNode(true);
      clone.classList.add('jd-flight-render', 'jd-flight-illustration');
      clone.setAttribute('aria-hidden', 'true');
      clone.style.opacity = '0';
      document.body.appendChild(clone);
      const copyClone = sourceCopy.cloneNode(true);
      copyClone.classList.add('jd-flight-copy');
      copyClone.setAttribute('aria-hidden', 'true');
      copyClone.style.opacity = '0';
      document.body.appendChild(copyClone);
      answerFlights.push({ source, sourceCopy, target, targetImage, targetCopy, clone, copyClone, index, from: {}, to: {}, copyFrom: {}, copyTo: {} });
    });
    measureAnswerHandoff();
    scheduleAnswerHandoff();
    window.addEventListener('scroll', scheduleAnswerHandoff, { passive: true });
    window.addEventListener('resize', refreshAnswerHandoff, { passive: true });
    window.addEventListener('load', refreshAnswerHandoff, { once: true });
    document.fonts?.ready?.then(refreshAnswerHandoff);
    if ('ResizeObserver' in window) {
      const handoffResizeObserver = new ResizeObserver(refreshAnswerHandoff);
      [questions, screens, ...answerFlights.map(flight => flight.source), ...answerFlights.map(flight => flight.target)].forEach(element => handoffResizeObserver.observe(element));
    }
  };
  startDeviceHandoff();
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    screens.querySelectorAll('.jd-answer-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        card.style.setProperty('--idea-tilt-x', `${(x * 2.2).toFixed(2)}deg`);
        card.style.setProperty('--idea-tilt-y', `${(-y * 1.8).toFixed(2)}deg`);
      });
      const resetTilt = () => {
        card.style.setProperty('--idea-tilt-x', '0deg');
        card.style.setProperty('--idea-tilt-y', '0deg');
      };
      card.addEventListener('pointerleave', resetTilt);
      card.addEventListener('blur', resetTilt);
    });
  }
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target === arrival) animateArrival();
    if (entry.target === questions) startQuestions();
    if (entry.target === screens) startDeviceHandoff();
    if (entry.target === ideaAvatar) startIdeaMotion();
  }), { threshold: .22 });
  [arrival, questions, screens].filter(Boolean).forEach(section => io.observe(section));
  if (ideaAvatar) {
    // Start when Shruti's face itself enters the viewport. Observing the full
    // tall transparent PNG started too early on tall screens and too late on
    // short laptops, depending on the image's empty transparent margins.
    const checkIdeaFace = () => {
      if (ideaMotionStarted || ideaSequenceFinished || !ideaAvatar.isConnected) return;
      const rect = ideaAvatar.getBoundingClientRect();
      const faceTop = rect.top + rect.height * .04;
      const faceBottom = rect.top + rect.height * .43;
      if (faceTop < window.innerHeight * .72 && faceBottom > window.innerHeight * .1) startIdeaMotion();
    };
    window.addEventListener('scroll', checkIdeaFace, { passive: true });
    window.addEventListener('resize', checkIdeaFace, { passive: true });
    Promise.all([...ideaAvatar.querySelectorAll('img')].map(frame => frame.decode().catch(() => {}))).then(() => requestAnimationFrame(checkIdeaFace));
    checkIdeaFace();
  }
  syncIdeaToWhiteFrameEdge();
  if (arrival.getBoundingClientRect().top < innerHeight * .8) animateArrival();
}

function renderRoute() {
  const publicPath = location.pathname.replace(/\/$/, '') || '/';
  const pathname = BASE_PATH && (publicPath === BASE_PATH || publicPath.startsWith(`${BASE_PATH}/`))
    ? publicPath.slice(BASE_PATH.length) || '/'
    : publicPath;
  if (location.protocol === 'file:' && pathname.endsWith('/experience/janitri/index.html')) return renderJanitriDeepDive();
  if (pathname === '/') renderHome();
  else if (pathname === '/resume') renderResume();
  else if (pathname === '/portfolio') renderPortfolio();
  else if (pathname === '/contact') renderContact();
  else if (pathname === '/design-process') renderDesignProcess();
  else if (pathname.startsWith('/work/')) renderProject(pathname.split('/')[2]);
  else if (pathname === '/experience/janitri') renderJanitriDeepDive();
  else if (pathname.startsWith('/experience/')) renderExperience(pathname.split('/')[2]);
  else renderNotFound();
}

document.addEventListener('click', event => {
  const projectLink = event.target.closest('[data-project-link]');
  if (projectLink) {
    const exactProject = projectLink.closest('.selected-project');
    const storySection = projectLink.closest('section[id]');
    const fallback = projectLink.dataset.project === 'jazaa' ? 'sant-rams' : projectLink.dataset.project === 'matera' ? 'janitri' : 'selected-work';
    sessionStorage.setItem('journeyHash', `#${exactProject?.id || storySection?.id || fallback}`);
  }
  const anchor = event.target.closest('a[href^="/"]');
  if (BASE_PATH && anchor && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    const target = new URL(anchor.href, location.href);
    if (target.origin === location.origin && !target.pathname.startsWith(`${BASE_PATH}/`) && target.pathname !== BASE_PATH) {
      event.preventDefault();
      const route = encodeURIComponent(target.pathname);
      const query = target.search ? `&destinationSearch=${encodeURIComponent(target.search)}` : '';
      location.assign(`${BASE_PATH}/?route=${route}${query}${target.hash}`);
    }
  }
});

menuToggle?.addEventListener('click', () => {
  const opened = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!opened));
  mobileMenu.hidden = opened;
});
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileMenu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); }));

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (window.location.hash && location.pathname === '/') sessionStorage.setItem('restoreJourneyHash', window.location.hash);
renderRoute();
