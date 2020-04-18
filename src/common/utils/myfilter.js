export function listToTree(data, id = 'id', pid = 'parent_id', isSort = true, sortBy = 'order') {
  let tree = []
  let list = []
  const fn = (obj, item) => {
    let children = []
    item.forEach(d => {
      if (d[pid] === obj[id]) {
        fn(d, item)
        children.push(d)
      }
    })
    obj.children = children
    return obj
  }
  const treeSort = (leaf) => {
    leaf.sort((a, b) => a[sortBy] - b[sortBy])

    leaf.forEach(d => {
      if (d.children && d.children.length) treeSort(d.children)
    })
  }
  if (Array.isArray(data) && data.length) {
    let set = new Set()
    data.forEach(d => {
      if (!set.has(d[id])) {
        set.add(d[id])
        list.push(d)
      }
    })

    list.forEach(d => {
      if (d[pid] === 0) tree.push(fn(d, list))
    })
    if (isSort) treeSort(tree)
  }
  return tree
}
