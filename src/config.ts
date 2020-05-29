import { BlockProps } from '@src/block'

const INITIAL_DIFFICULTY = 3

export const GENESIS_DATA: BlockProps = {
  timestamp: new Date('2020-04-20').getTime(),
  lastHash: '---',
  hash: 'initialHash',
  data: [],
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY,
}
