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
}
