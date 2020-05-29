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
    this.publisher.publish(channel, message)
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    })
  }

  handleMessage(channel: string, message: any) {
    console.log(`[ ${channel} ] Message received ->> ${message}`)

    const parsedMessage = JSON.parse(message)

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replace(parsedMessage)
    }
  }
}
