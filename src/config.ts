import { BlockProps } from '@src/block'

export const GENESIS_DATA: BlockProps = {
  timestamp: new Date('2020-04-20').getTime(),
  lastHash: '---',
  hash: 'initialHash',
  data: [],
}
