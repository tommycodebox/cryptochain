import express, { Request, Response } from 'express'
import request from 'request'
import { Blockchain } from '@/blockchain'
import { PubSub } from '@/utils'

const app = express()
const blockchain = new Blockchain()
const pubsub = new PubSub({ blockchain })

const DEFAULT_PORT = 4000
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.use(express.json())

app.get('/api/blocks', (req: Request, res: Response) => {
  res.send(blockchain.chain)
})

app.post('/api/mine', (req: Request, res: Response) => {
  const { data } = req.body
  blockchain.addBlock({ data })

  pubsub.broadcastChain()

  res.redirect('/api/blocks')
})

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body)

      console.log('Replacing chain on sync')
      blockchain.replace(rootChain)
    }
  })
}

let PEER_PORT

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)

  if (PORT !== DEFAULT_PORT) {
    syncChains()
  }
})
