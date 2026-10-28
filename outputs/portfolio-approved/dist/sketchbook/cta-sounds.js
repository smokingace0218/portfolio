/* Hover cues for the two main world actions. Nothing plays on load. */
(() => {
  const cues = {
    wizard: 'assets/audio/dobby_hello.mp3?v=164-cta-cues',
    owl: 'assets/audio/parseltongue.mp3?v=164-cta-cues'
  };
  const hosts = {
    wizard: '#designer-spider .wizard-cta',
    owl: '#connect-venom .venom-cta__btn'
  };
  const players = {};
  let active = null;

  function player(kind) {
    if (players[kind]) return players[kind];
    const audio = new Audio(cues[kind]);
    audio.preload = 'auto';
    audio.dataset.cue = kind;
    players[kind] = audio;
    return audio;
  }

  function play(kind) {
    if (active) return;
    const audio = player(kind);
    active = kind;
    audio.volume = 1;
    try { audio.currentTime = 0; } catch {}
    audio.onended = () => { if (active === kind) active = null; };
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => { if (active === kind) active = null; });
    }
  }

  function kindFrom(target) {
    if (!(target instanceof Element)) return null;
    if (target.closest(hosts.wizard)) return 'wizard';
    if (target.closest(hosts.owl)) return 'owl';
    return null;
  }

  document.addEventListener('pointerover', event => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const kind = kindFrom(event.target);
    if (!kind) return;
    const host = event.target.closest(hosts[kind]);
    if (host && event.relatedTarget instanceof Node && host.contains(event.relatedTarget)) return;
    play(kind);
  });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') return;
    const kind = kindFrom(event.target);
    if (kind) play(kind);
  }, true);

  player('wizard');
  player('owl');
})();
