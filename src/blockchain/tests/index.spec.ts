import { Blockchain, Block } from '@/blockchain'
import { cryptoHash } from '@/utils/crypto-hash'

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

      describe('and the chain contains a block with a jumped difficulty', () => {
        it('return false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1]
          const lastHash = lastBlock.hash
          const timestamp = Date.now()
          const nonce = 0
          const data: any[] = []
          const difficulty = lastBlock.difficulty - 3

          const hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)

          const badBlock = new Block({
            timestamp,
            lastHash,
            hash,
            data,
            nonce,
            difficulty,
          })

          blockchain.chain.push(badBlock)

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
    let errorMock: jest.Mock
    let logMock: jest.Mock

    beforeEach(() => {
      errorMock = jest.fn()
      logMock = jest.fn()

      global.console.error = errorMock
      global.console.log = logMock
    })

    describe('when the new chain is not longer', () => {
      beforeEach(() => {
        newChain.chain[0] = { new: 'chain' } as any

        blockchain.replace(newChain.chain)
      })

      it('does not replace the chain', () => {
        expect(blockchain.chain).toEqual(originalChain)
      })

      it('logs an error', () => {
        expect(errorMock).toHaveBeenCalled()
      })
    })

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'foo' })
        newChain.addBlock({ data: 'bar' })
        newChain.addBlock({ data: 'top' })
      })

      describe('and the chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[2].hash = 'fake-hash'

          blockchain.replace(newChain.chain)
        })
        it('does not replace the chain', () => {
          expect(blockchain.chain).toEqual(originalChain)
        })

        it('logs an error', () => {
          expect(errorMock).toHaveBeenCalled()
        })
      })
      describe('and the chain is valid', () => {
        beforeEach(() => {
          blockchain.replace(newChain.chain)
        })

        it('replaces the chain', () => {
          expect(blockchain.chain).toEqual(newChain.chain)
        })

        it('logs about chaon replacement', () => {
          expect(logMock).toHaveBeenCalled()
        })
      })
    })
  })
})
