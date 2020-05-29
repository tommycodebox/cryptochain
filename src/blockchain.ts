import { Block } from '@src/block'

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
}
