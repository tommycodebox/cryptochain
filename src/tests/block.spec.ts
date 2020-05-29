import hexToBinary from 'hex-to-binary'
import { Block } from '@/block'
import { GENESIS_DATA, MINE_RATE } from '@/config'
import { cryptoHash } from '@/crypto-hash'

describe('Block', () => {
  const timestamp = 2000
  const lastHash = 'last-hash'
  const hash = 'hash'
  const data = ['1', '2']
  const nonce = 1
  const difficulty = 1

  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  })

  it('has a timestamp, lastHash, hash and data property', () => {
    expect(block.timestamp).toEqual(timestamp)
    expect(block.lastHash).toEqual(lastHash)
    expect(block.hash).toEqual(hash)
    expect(block.data).toEqual(data)
    expect(block.nonce).toEqual(nonce)
    expect(block.difficulty).toEqual(difficulty)
  })

  describe('genesis()', () => {
    const genesisBlock = Block.genesis()

    it('return a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true)
    })

    it('return the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA)
    })
  })

  describe('mine()', () => {
    const lastBlock = Block.genesis()
    const data = 'mined data'
    const minedBlock = Block.mine({
      lastBlock,
      data,
    })

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true)
    })

    it('sets the `lastHash` to be the `hash` of the last block', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash)
    })

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data)
    })

    it('sets the `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined)
    })

    it('creates a SHA-256 hash based on the proper inputs', () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data,
        ),
      )
    })

    it('sets a `hash` that matches the difficulty criteria ', () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty),
      ).toEqual('0'.repeat(minedBlock.difficulty))
    })

    it('adjusts the difficulty', () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ]
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true)
    })
  })

  describe('adjust()', () => {
    it('raises the difficulty for a quickly mined block', () => {
      expect(
        Block.adjust({
          original: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        }),
      ).toEqual(block.difficulty + 1)
    })

    it('lowers the difficulty for a slowly mined block', () => {
      expect(
        Block.adjust({
          original: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        }),
      ).toEqual(block.difficulty - 1)
    })

    it('has a lower limit of 1', () => {
      block.difficulty = -1
      expect(Block.adjust({ original: block })).toEqual(1)
    })
  })
})
