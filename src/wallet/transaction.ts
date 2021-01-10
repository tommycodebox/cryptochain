import { Wallet } from '@/wallet'
import { v1 as uuid } from 'uuid'
import { verifySignature } from '@/utils'
import { MINING_REWARD, REWARD_INPUT } from '@/config'

interface Input {
  timestamp: number
  amount: number
  address: string
  signature: any
}

interface OutputMap {
  [publicKey: string]: number
}

interface TransactionProps {
  senderWallet?: Wallet
  recipient?: string
  amount?: number
  outputMap?: OutputMap
  input?: Input
}

interface CreateInputProps {
  senderWallet: Wallet
  outputMap: OutputMap
}

export class Transaction {
  id: string
  outputMap: OutputMap
  senderWallet: Wallet
  recipient: string
  amount: number
  input: Input

  constructor({
    senderWallet,
    recipient,
    amount,
    outputMap,
    input,
  }: TransactionProps) {
    this.id = uuid()
    this.outputMap =
      outputMap || this.createOutputMap({ senderWallet, recipient, amount })
    this.input =
      input || this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  createOutputMap({ senderWallet, recipient, amount }: TransactionProps) {
    const outputMap: { [key: string]: any } = {}

    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount

    return outputMap
  }

  createInput({ senderWallet, outputMap }: CreateInputProps) {
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

  static rewardTransaction({ minerWallet }: { minerWallet: Wallet }) {
    return new this({
      input: REWARD_INPUT,
      outputMap: { [minerWallet.publicKey]: MINING_REWARD },
    } as TransactionProps)
  }

  update({ senderWallet, recipient, amount }: TransactionProps) {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error('Amount exceeds balance')
    }

    if (!this.outputMap[recipient]) this.outputMap[recipient] = amount
    else this.outputMap[recipient] = this.outputMap[recipient] + amount

    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
  }
}
