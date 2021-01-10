import { BlockProps } from '@/blockchain/block'

export const MINE_RATE = 1000
const INITIAL_DIFFICULTY = 3
export const STARTING_BALANCE = 1000

export const GENESIS_DATA: BlockProps = {
  timestamp: new Date('2020-04-20').getTime(),
  lastHash: '---',
  hash: 'initialHash',
  data: [],
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY,
}

export const REWARD_INPUT = {
  address: '***authorized_reward***',
}
export const MINING_REWARD = 50
