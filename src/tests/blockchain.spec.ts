import { Blockchain } from '@src/blockchain'
import { Block } from '@src/block'

describe('Blockchain', () => {
  let blockchain: Blockchain

  beforeEach(() => {
    blockchain = new Blockchain()
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
})
