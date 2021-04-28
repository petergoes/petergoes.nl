class MyBookmarkFilteredList extends HTMLElement {
  getBookmarkListItem({ title, url }) {
    return `<li class="bookmark-filtered-list__item">
      <span><a href="${url}">${title}</a></span>
      <small>${new URL(url).host}</small>
    </li>`
  }

  connectedCallback() {
    const root = this.getAttribute('root')
    const currentTag = location.pathname
      .replace(`/${root}/tags/`, '')
      .replace('/', '')
    const bookmarks = window.bookmarks || []
    const bookmarksMarkup = bookmarks
      .filter(({ tags }) => tags.includes(currentTag))
      .map(item => { console.log(item); return item })
      .map(this.getBookmarkListItem)
      .filter(x => x)
      .join('')

    this.innerHTML = `<ul>${bookmarksMarkup}</ul>`
  }
}

customElements.define('my-bookmark-filtered-list', MyBookmarkFilteredList)
