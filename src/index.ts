import express, { Request, Response } from 'express'
import request from 'request'
import { Blockchain } from '@/blockchain'
import { PubSub, Miner } from '@/utils'
import { Wallet, Pool, Transaction } from '@/wallet'

const app = express()
const blockchain = new Blockchain()
const pool = new Pool()
const wallet = new Wallet()
const pubsub = new PubSub({ blockchain, pool })
const miner = new Miner({ blockchain, pool, wallet, pubsub })

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

app.post('/api/transactions', (req: Request, res: Response) => {
  const { amount, recipient } = req.body

  let transaction: Transaction = pool.existing({
    inputAddress: wallet.publicKey,
  })

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount })
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      })
    }
  } catch (err) {
    return res.status(400).json({ type: 'error', message: err.message })
  }

  pool.set(transaction)

  pubsub.broadcastTransaction(transaction)

  res.json({ transaction })
})

app.get('/api/pool', (req: Request, res: Response) => {
  res.json(pool.transactions)
})

app.get('/api/mine/transactions', (req: Request, res: Response) => {
  miner.mine()

  res.redirect('/api/blocks')
})

app.get('/api/wallet', (req, res) => {
  const address = wallet.publicKey
  return res.json({
    address,
    balance: Wallet.balance({ chain: blockchain.chain, address }),
  })
})

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body)

      console.log('[ STARTUP SYNC ] Replacing chain on sync')
      blockchain.replace(rootChain)
    }
  })

  request({ url: `${ROOT_NODE_ADDRESS}/api/pool` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootPool = JSON.parse(body)

      console.log('[ STARTUP SYNC ] Replacing pool on sync')
      pool.setMap(rootPool)
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
    syncWithRootState()
  }
})
