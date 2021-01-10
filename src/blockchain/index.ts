export * from './block'

import { Block } from '@/blockchain'
import { cryptoHash } from '@/utils/crypto-hash'

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

  replace(chain: Blockchain['chain'], onSuccess?: () => void): void {
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer')
      return
    }

    if (!Blockchain.isValid(chain)) {
      console.error('The incoming chain must be valid')
      return
    }

    onSuccess?.()
    console.log('Replacing chain with', chain)
    this.chain = chain
  }

  static isValid(chain: Blockchain['chain']): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i]
      const actualLastHash = chain[i - 1].hash
      const lastDifficulty = chain[i - 1].difficulty

      if (lastHash !== actualLastHash) return false

      const validatedHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty,
      )

      if (hash !== validatedHash) return false

      if (Math.abs(lastDifficulty - difficulty) > 1) return false
    }

    return true
  }
}
