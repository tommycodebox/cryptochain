export * from './transaction'

import { Transaction } from '@/wallet'
import { STARTING_BALANCE } from '@/config'
import { ec, cryptoHash } from '@/utils'

interface CreateTransactionProps {
  recipient: string
  amount: number
}

export class Wallet {
  balance: number
  publicKey: string
  keyPair = ec.genKeyPair()

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
  }: CreateTransactionProps): Transaction {
    if (amount > this.balance) {
      throw new Error('Amount exceeds balance')
    }

    return new Transaction({ amount, recipient, senderWallet: this })
  }
}
