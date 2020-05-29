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

  replace(chain: Blockchain['chain']): void {
    if (chain.length <= this.chain.length) return

    if (!Blockchain.isValid(chain)) return

    this.chain = chain
  }

  static isValid(chain: Blockchain['chain']): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data } = chain[i]

      const actualLastHash = chain[i - 1].hash

      if (lastHash !== actualLastHash) return false

      const validatedHash = cryptoHash(timestamp, lastHash, data)

      if (hash !== validatedHash) return false
    }

    return true
  }
}
