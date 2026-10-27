/* Scale the existing desktop calculator uniformly to fit mobile viewport. */
(function () {
  const calculator = document.querySelector('.calculator');
  const workspace = document.querySelector('.workspace');
  if (!calculator || !workspace) return;
  const mobile = window.matchMedia('(max-width: 600px)');

  function fitCalculator() {
    if (!mobile.matches) {
      calculator.style.removeProperty('transform');
      calculator.style.removeProperty('left');
      calculator.style.removeProperty('top');
      workspace.style.removeProperty('height');
      return;
    }
    // Read the untransformed dimensions of the original calculator.
    calculator.style.transform = 'none';
    const width = calculator.offsetWidth;
    const height = calculator.offsetHeight;
    const availableWidth = Math.max(1, window.innerWidth - 12);
    const availableHeight = Math.max(1, workspace.clientHeight - 8);
    const scale = Math.min(availableWidth / width, availableHeight / height);
    calculator.style.left = '50%';
    calculator.style.top = '0';
    calculator.style.transformOrigin = 'top center';
    calculator.style.transform = `translateX(-50%) scale(${scale})`;
  }
  window.addEventListener('resize', fitCalculator, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(fitCalculator, 100), { passive: true });
  if (mobile.addEventListener) mobile.addEventListener('change', fitCalculator);
  else mobile.addListener(fitCalculator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitCalculator);
  window.addEventListener('load', fitCalculator);
  fitCalculator();
})();
