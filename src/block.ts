interface BlockProps {
  timestamp: Date
  lastHash: string
  hash: string
  data: any[]
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
}
