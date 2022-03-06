export const voteConflict = (votes) => {
  if (!votes || votes.length === 0) {
    return null
  } else {
    const countedVotes = countVotes(votes)
    const totalVotes = countedVotes.reduce((sum, vote) => sum + vote.count, 0)
    return countedVotes[0].count / totalVotes <= 0.75
  }
}
