module.exports = function addLazy(md, options) {
  const defaultRenderer = md.renderer.rules.image;

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    tokens[idx].attrPush(['loading', 'lazy'])
    return defaultRenderer(tokens, idx, options, env, self)
  }
}
