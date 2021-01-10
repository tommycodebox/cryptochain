import { Blockchain } from '@/blockchain'
import { Pool, Transaction, Wallet } from '@/wallet'
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
    const validTransactions = this.pool.validTransactions()

    // generate the miners reward
    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet }),
    )

    // add a block consisting of these transactions to the blockchain
    this.blockchain.addBlock({ data: validTransactions })

    // broadcast the updated blockchain
    this.pubsub.broadcastChain()

    // clear the pool
    this.pool.clear()
  }
}
