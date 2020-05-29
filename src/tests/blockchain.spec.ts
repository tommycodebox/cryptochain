import { Blockchain } from '@src/blockchain'
import { Block } from '@src/block'

describe('Blockchain', () => {
  let blockchain: Blockchain
  let newChain: Blockchain
  let originalChain: Blockchain['chain']

  beforeEach(() => {
    blockchain = new Blockchain()
    newChain = new Blockchain()

    originalChain = blockchain.chain
  })

  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true)
  })

  it('start with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis())
  })

  it('adds a new block to the chain', () => {
    const newData = 'foo bar'
    blockchain.addBlock({ data: newData })

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData)
  })

  describe('isValid()', () => {
    describe('when the chain does not start with the genesis block', () => {
      it('return false', () => {
        blockchain.chain[0].data = 'fake-data'

        expect(Blockchain.isValid(blockchain.chain)).toBe(false)
      })
    })

    describe('when the chain starts with the genesis block and has multiple blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'foo' })
        blockchain.addBlock({ data: 'bar' })
        blockchain.addBlock({ data: 'top' })
      })

      describe('and a lastHash reference has changed', () => {
        it('return false', () => {
          blockchain.chain[2].lastHash = 'fake-lastHash'

          expect(Blockchain.isValid(blockchain.chain)).toBe(false)
        })
      })

      describe('and the chain contains a block with an invalid field', () => {
        it('return false', () => {
          blockchain.chain[2].data = 'fake-data'

          expect(Blockchain.isValid(blockchain.chain)).toBe(false)
        })
      })

      describe('and the chain does not contain any invalid blocks', () => {
        it('return true', () => {
          expect(Blockchain.isValid(blockchain.chain)).toBe(true)
        })
      })
    })
  })

  describe('replace()', () => {
    describe('when the new chain is not longer', () => {
      it('does not replace the chain', () => {
        newChain.chain[0] = { new: 'chain' } as any

        blockchain.replace(newChain.chain)

        expect(blockchain.chain).toEqual(originalChain)
      })
    })

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'foo' })
        newChain.addBlock({ data: 'bar' })
        newChain.addBlock({ data: 'top' })
      })

      describe('and the chain is invalid', () => {
        it('does not replace the chain', () => {
          newChain.chain[2].hash = 'fake-hash'

          blockchain.replace(newChain.chain)

          expect(blockchain.chain).toEqual(originalChain)
        })
      })
      describe('and the chain is valid', () => {
        it('replaces the chain', () => {
          blockchain.replace(newChain.chain)

          expect(blockchain.chain).toEqual(newChain.chain)
        })
      })
    })
  })
})
