import { GENESIS_DATA } from './config'
import { cryptoHash } from './crypto-hash'

export interface BlockProps {
  timestamp: number
  lastHash: string
  hash: string
  data: any[] | string
  nonce: number
  difficulty: number
}

interface MineProps {
  lastBlock: Block
  data: any
}
export class Block {
  timestamp: BlockProps['timestamp']
  lastHash: BlockProps['lastHash']
  hash: BlockProps['hash']
  data: BlockProps['data']
  nonce: BlockProps['nonce']
  difficulty: BlockProps['difficulty']

  constructor({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  }: BlockProps) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.nonce = nonce
    this.data = data
    this.difficulty = difficulty
  }

  static genesis() {
    return new this(GENESIS_DATA)
  }

  static mine({ lastBlock, data }: MineProps) {
    let timestamp: number

    let hash: string
    const lastHash = lastBlock.hash

    const { difficulty } = lastBlock
    let nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({
      timestamp,
      lastHash,
      hash,
      data,
      nonce,
      difficulty,
    })
  }
}
