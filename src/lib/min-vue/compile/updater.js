export default {
  text(el, value) {
    el.textContent = typeof value === 'undefined' ? '' : value
  },

  html(el, value) {
    el.innerHTML = typeof value === 'undefined' ? '' : value
  }
}
