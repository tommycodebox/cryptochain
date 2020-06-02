import { Wallet } from '@/wallet'
import { v1 as uuid } from 'uuid'
import { verifySignature } from '@/utils'

interface TransactionProps {
  senderWallet: Wallet
  recipient: string
  amount: number
}

export class Transaction {
  id: string
  outputMap: {
    [publicKey: string]: number
  }

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

  static isValid(transaction: Transaction) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction

    const outputTotal = Object.values(outputMap).reduce(
      (total, outputAmount) => total + outputAmount,
    )

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`)
      return false
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`)
      return false
    }
    return true
  }
}
