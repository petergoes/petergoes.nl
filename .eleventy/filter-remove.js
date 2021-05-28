function remove(array, value) {
  return array.filter(item => item !== value)
}

function removePostsInCollection(posts, collectionName) {
  return posts.filter(post => {
    if (typeof collectionName === 'string') {
      return (post.data.tags || []).includes(collectionName) === false
    }

    const tag = (post.data.tags || []).find(tag => collectionName.includes(tag))
    return !tag
  })
}

module.exports = {
  remove,
  removePostsInCollection
}

