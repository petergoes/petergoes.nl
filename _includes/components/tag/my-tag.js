class MyTag extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('clickable')) {
      const link = document.createElement('a')
      link.href = `?tag=${this.innerText}`
      link.innerText = this.innerText
      this.innerHTML = ''
      this.appendChild(link)
    }
  }
}

customElements.define('my-tag', MyTag)
