import { Block } from '@src/block'
import { cryptoHash } from '@src/crypto-hash'

interface AddBlockProps {
  data: any[] | string
}

export class Blockchain {
  chain: Block[]

  constructor() {
    this.chain = [Block.genesis()]
  }

  addBlock({ data }: AddBlockProps) {
    const newBlock = Block.mine({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    })

    this.chain.push(newBlock)
  }

  static isValid(chain: Blockchain['chain']): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]

      const actualLastHash = chain[i - 1].hash

      const { timestamp, lastHash, hash, data } = block

      if (lastHash !== actualLastHash) return false

      const validatedHash = cryptoHash(timestamp, lastHash, data)

      if (hash !== validatedHash) return false
    }

    return true
  }
}
