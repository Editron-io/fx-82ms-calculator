/* Gentle click feedback for every calculator key. Haptics depend on browser/device support. */
(() => {
  'use strict';
  let audioContext = null;
  let lastFeedbackAt = 0;

  function playClick() {
    // Very quiet, short numeric-key style tick: audible confirmation without a loud beep.
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.012);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.018, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch (_) { /* Audio may be blocked by browser/device settings. */ }
  }

  function vibrate() {
    // 35 ms gives a short tactile tick. Browsers decide the actual motor strength.
    try {
      if (typeof navigator.vibrate === 'function') navigator.vibrate(35);
    } catch (_) { /* Unsupported or disabled. */ }
  }

  // pointerdown gives immediate feedback on touch and mouse; delegation covers every calculator key.
  document.addEventListener('pointerdown', (event) => {
    const button = event.target.closest('.calculator button');
    if (!button || button.disabled) return;
    const now = performance.now();
    if (now - lastFeedbackAt < 25) return;
    lastFeedbackAt = now;
    playClick();
    vibrate();
  }, { passive: true });
})();
