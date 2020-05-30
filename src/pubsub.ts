import redis from 'redis'
import { Blockchain } from '@/blockchain'

interface PubSubProps {
  blockchain: Blockchain
}
interface PublishProps {
  channel: string
  message: any
}

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
}

export class PubSub {
  blockchain: Blockchain

  publisher: redis.RedisClient
  subscriber: redis.RedisClient

  constructor({ blockchain }: PubSubProps) {
    this.blockchain = blockchain
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

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    })
  }

  handleMessage(channel: string, message: string) {
    const parsedMessage = JSON.parse(message)
    console.log(
      `[ ${channel} ] Received chain with length ->> `,
      parsedMessage.length,
    )

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replace(parsedMessage)
    }
  }
}
