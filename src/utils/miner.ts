import { Blockchain } from '@/blockchain'
import { Pool, Wallet } from '@/wallet'
import { PubSub } from './pubsub'

interface MinerProps {
  blockchain: Blockchain
  pool: Pool
  wallet: Wallet
  pubsub: PubSub
}

export class Miner {
  blockchain: MinerProps['blockchain']
  pool: MinerProps['pool']
  wallet: MinerProps['wallet']
  pubsub: MinerProps['pubsub']

  constructor({ blockchain, pool, wallet, pubsub }: MinerProps) {
    this.blockchain = blockchain
    this.pool = pool
    this.wallet = wallet
    this.pubsub = pubsub
  }

  mine() {
    // get the transaction pool's valid transactions
    // generate the miners reward
    // add a block consisting of these transactions to the blockchain
    // broadcast the updated blockchain
    // clear the pool
  }
}
