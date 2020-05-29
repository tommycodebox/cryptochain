import { GENESIS_DATA } from './config'
import { cryptoHash } from './crypto-hash'

export interface BlockProps {
  timestamp: number
  lastHash: string
  hash: string
  data: any[]
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

  constructor({ timestamp, lastHash, hash, data }: BlockProps) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
  }

  static genesis() {
    return new this(GENESIS_DATA)
  }

  static mine({ lastBlock, data }: MineProps) {
    const timestamp = Date.now()
    const lastHash = lastBlock.hash

    return new this({
      timestamp,
      lastHash,
      hash: cryptoHash(timestamp, lastHash, data),
      data,
    })
  }
}
