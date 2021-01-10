export * from './transaction'
export * from './pool'

import { Transaction } from '@/wallet'
import { STARTING_BALANCE } from '@/config'
import { ec, cryptoHash } from '@/utils'
import { ec as EC } from 'elliptic'
import { Blockchain } from '@/blockchain'

interface CreateTransactionProps {
  recipient: string
  amount: number
  chain?: Blockchain['chain']
}

export class Wallet {
  balance: number
  publicKey: string
  keyPair: EC.KeyPair

  constructor() {
    this.balance = STARTING_BALANCE

    this.keyPair = ec.genKeyPair()

    this.publicKey = this.keyPair.getPublic().encode('hex', false)
  }

  sign(data: any) {
    return this.keyPair.sign(cryptoHash(data))
  }

  createTransaction({
    recipient,
    amount,
    chain,
  }: CreateTransactionProps): Transaction {
    if (chain) {
      this.balance = Wallet.balance({
        address: this.publicKey,
        chain,
      })
    }

    if (amount > this.balance) {
      throw new Error('Amount exceeds balance')
    }

    return new Transaction({ amount, recipient, senderWallet: this })
  }

  static balance({
    chain,
    address,
  }: {
    chain: Blockchain['chain']
    address: string
  }) {
    let hasConductedTransaction = false
    let total = 0

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i]

      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true
        }

        const addressOutput = transaction.outputMap[address]

        if (addressOutput) {
          total += addressOutput
        }
      }

      if (hasConductedTransaction) break
    }

    return hasConductedTransaction ? total : STARTING_BALANCE + total
  }
}
