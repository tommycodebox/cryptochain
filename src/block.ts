interface BlockConstructor {
  timestamp: Date
  lastHash: string
  hash: string
  data: any[]
}

export class Block {
  timestamp: BlockConstructor['timestamp']
  lastHash: BlockConstructor['lastHash']
  hash: BlockConstructor['hash']
  data: BlockConstructor['data']

  constructor({ timestamp, lastHash, hash, data }: BlockConstructor) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
  }
}

const block = new Block({
  timestamp: new Date(),
  lastHash: '---',
  hash: '...',
  data: ['1', '2'],
})

export const run = () => console.log(block)
