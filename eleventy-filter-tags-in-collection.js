const getHead = array => array[0]
const replace = (search, replaceWith) => item => item.replace(new RegExp(search, 'g'), replaceWith)
const toTitle = ([firstChar, ...rest]) => `${firstChar.toUpperCase()}${rest.join('')}`
const not = condition => value => value !== condition

module.exports = function filterTagsInCollection(collection, collectionName) {
  const result = collection
    .map(item => item.data.tags)
    .join(',')
    .split(',')
    .reduce((list, item) => {
      const slug = item
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/\./g, '-')

      if (!list[slug]) {
        list[slug] = []
      }
      list[slug].push(item)
      return list
    }, {})
  return Object
    .values(result)
    .map(getHead)
    .map(replace('-', ' '))
    .map(toTitle)
    .filter(not(collectionName))
    .sort()
}
