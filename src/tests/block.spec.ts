import { Block } from '@src/block'
import { GENESIS_DATA } from '@src/config'
import { cryptoHash } from '@src/crypto-hash'

describe('Block', () => {
  const timestamp = new Date('2020-04-20').getTime()
  const lastHash = 'last-hash'
  const hash = 'hash'
  const data = ['1', '2']

  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
  })

  it('has a timestamp, lastHash, hash and data property', () => {
    expect(block.timestamp).toEqual(timestamp)
    expect(block.lastHash).toEqual(lastHash)
    expect(block.hash).toEqual(hash)
    expect(block.data).toEqual(data)
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
        cryptoHash(minedBlock.timestamp, lastBlock.hash, data),
      )
    })
  })
})
