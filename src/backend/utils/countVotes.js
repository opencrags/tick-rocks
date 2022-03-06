export const countVotes = (votes) => {
  const countedVotes = Object.entries(
    votes.reduce((count, vote) => {
      const stringified = JSON.stringify(vote.value)
      if (stringified in count) {
        count[stringified] += 1
      } else {
        count[stringified] = 1
      }
      return count
    }, {})
  ).map(([value, votes]) => ({ value: JSON.parse(value), count: votes }))
  countedVotes.sort((countA, countB) => (countA.count > countB.count ? 1 : -1))
  return countedVotes
}
