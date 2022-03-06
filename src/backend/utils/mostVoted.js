export const mostVoted = (votes) =>
  !votes || votes.length === 0 ? null : countVotes(votes)[0].value
