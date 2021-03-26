Object.defineProperty(window, 'debugVerticalRythm', {
  get: function() { 
    const el = document.querySelector('.debug-vertical-rythm')
    el.classList.toggle('display');
    return el.classList.contains('display') ? 'Debug mode is activated' : 'Debug mode is deactivated'
  }
});