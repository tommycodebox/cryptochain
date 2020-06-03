import { Transaction } from '@/wallet'

export class Pool {
  transactionMap: {
    [id: string]: Transaction
  }

  constructor() {
    this.transactionMap = {}
  }

  set(transaction: Transaction) {
    this.transactionMap[transaction.id] = transaction
  }

  existing({ inputAddress }: { inputAddress: string }): Transaction {
    const transactions = Object.values(this.transactionMap)

    return transactions.find((t) => t.input.address === inputAddress)
  }
}
