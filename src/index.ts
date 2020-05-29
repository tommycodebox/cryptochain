import express, { Request, Response } from 'express'
import { Blockchain } from '@/blockchain'
import { PubSub } from '@/pubsub'

const app = express()
const blockchain = new Blockchain()
const pubsub = new PubSub({ blockchain })

setTimeout(() => {
  pubsub.broadcastChain()
}, 1000)

app.use(express.json())

app.get('/api/blocks', (req: Request, res: Response) => {
  res.send(blockchain.chain)
})

app.post('/api/mine', (req: Request, res: Response) => {
  const { data } = req.body
  blockchain.addBlock({ data })

  res.redirect('/api/blocks')
})

const PORT = 4000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
