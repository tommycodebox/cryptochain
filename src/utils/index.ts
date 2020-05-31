export * from './crypto-hash'
export * from './pubsub'

import { ec as EC } from 'elliptic'

export const ec = new EC('secp256k1')
