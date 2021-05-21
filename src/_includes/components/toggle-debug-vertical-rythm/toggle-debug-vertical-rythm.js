Object.defineProperty(window, 'debugVerticalRythm', {
  get: function() { 
    const el = document.querySelector('.debug-vertical-rythm')
    try {
      el.classList.toggle('display');
      return el.classList.contains('display') ? 'Debug mode is activated' : 'Debug mode is deactivated'
    } catch (error) {
      return '.debug-vertical-rythm could not be found!'
    }
  }
});

class ToggleDebugVerticalRythm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "<button>Toggle Vertical Rythm Debugger</button>"
    this.querySelector('button').addEventListener('click', this.handleClick)
  }

  disconnectedCallback() {
    this.querySelector('button').removeEventListener('click', this.handleClick)
  }

  handleClick() {
    console.log(window.debugVerticalRythm)
  }
}

if (customElements) {
  customElements.define('debug-vertical-rythm', ToggleDebugVerticalRythm)
}
