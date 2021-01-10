import redis from 'redis'
import { Blockchain } from '@/blockchain'
import { Pool, Transaction } from '@/wallet'

interface PubSubProps {
  blockchain: Blockchain
  pool: Pool
}
interface PublishProps {
  channel: string
  message: any
}

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
}

export class PubSub {
  blockchain: Blockchain
  pool: Pool

  publisher: redis.RedisClient
  subscriber: redis.RedisClient

  constructor({ blockchain, pool }: PubSubProps) {
    this.blockchain = blockchain
    this.pool = pool
    this.publisher = redis.createClient()
    this.subscriber = redis.createClient()

    this.subscribeToChannels()

    this.subscriber.on('message', (channel, message) =>
      this.handleMessage(channel, message),
    )
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel)
    })
  }

  publish({ channel, message }: PublishProps) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel)
      })
    })
  }

  handleMessage(channel: string, message: string) {
    const parsedMessage = JSON.parse(message)

    console.log(`[ ${channel} ] Received new message`)

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replace(parsedMessage, () => {
          this.pool.clearBlockchainTransactions({ chain: parsedMessage })
        })
        break
      case CHANNELS.TRANSACTION:
        this.pool.set(parsedMessage)
        break
      default:
        return
    }
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    })
  }

  broadcastTransaction(transaction: Transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    })
  }
}
