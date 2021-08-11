export const groupBy = (array, key) => {
  return array.reduce((grouped, item) => {
    grouped[item[key]] = grouped[item[key]] || []
    grouped[item[key]].push(item)
    return grouped
  }, {})
}
