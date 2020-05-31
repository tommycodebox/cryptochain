import { Wallet } from '@/wallet'
import { v1 as uuid } from 'uuid'

interface TransactionProps {
  senderWallet: Wallet
  recipient: string
  amount: number
}

export class Transaction {
  id: string
  outputMap: any

  senderWallet: Wallet
  recipient: string
  amount: number
  input: {
    timestamp: number
    amount: number
    address: string
    signature: any
  }

  constructor({ senderWallet, recipient, amount }: TransactionProps) {
    this.id = uuid()
    this.outputMap = this.createOutputMap({ senderWallet, recipient, amount })
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  createOutputMap({ senderWallet, recipient, amount }: TransactionProps) {
    const outputMap: { [key: string]: any } = {}

    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount

    return outputMap
  }

  createInput({
    senderWallet,
    outputMap,
  }: {
    senderWallet: Wallet
    outputMap: any
  }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
    }
  }
}
