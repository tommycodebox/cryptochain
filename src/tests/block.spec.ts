import { Block } from '@src/block'
import { GENESIS_DATA } from '@src/config'

describe('Block', () => {
  const timestamp = new Date('2020-04-20')
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
})
