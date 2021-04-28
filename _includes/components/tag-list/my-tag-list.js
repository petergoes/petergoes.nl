class MyTagList extends HTMLElement {
  connectedCallback() {
    this.classList.toggle('tag-list--show', true)
  }
}

customElements.define('my-tag-list', MyTagList)
