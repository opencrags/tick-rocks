import React, { useState } from 'react'
import { Box, Heading, Text, Progress, Checkbox } from '@chakra-ui/react'

import { countVotes } from '../utils/backend.js'

export default function Votes({ votes, countedVoteItem, value, onChange }) {
  const countedVotes = countVotes(votes)
  const maxVoteCount = Math.max(Object.values(countedVotes))
  const [checkboxes, setCheckboxes] = useState(
    countedVotes.map((countedVote) => countedVote.value === value)
  )

  return (
    <Box marginBottom="10px">
      <Heading size="sm">Votes</Heading>
      {countedVotes.length === 0 ? (
        <Text>There are no votes.</Text>
      ) : (
        countedVotes.map((countedVote, index) => (
          <Box key={countedVote.value}>
            <Checkbox
              isChecked={checkboxes[index]}
              onChange={(event) => {
                const newCheckboxes = checkboxes.map(() => false)
                newCheckboxes[index] = !checkboxes[index]
                setCheckboxes(newCheckboxes)
                if (newCheckboxes[index]) {
                  onChange(countedVote)
                } else {
                  onChange(null)
                }
              }}
            >
              {countedVoteItem(countedVote, maxVoteCount)}
            </Checkbox>
            <Progress value={countedVote.count / maxVoteCount} />
          </Box>
        ))
      )}
    </Box>
  )
}
