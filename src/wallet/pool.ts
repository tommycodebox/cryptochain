import { Blockchain } from '@/blockchain'
import { Transaction } from '@/wallet'

export class Pool {
  transactions: {
    [id: string]: Transaction
  }

  constructor() {
    this.transactions = {}
  }

  clear() {
    this.transactions = {}
  }

  set(transaction: Transaction) {
    this.transactions[transaction.id] = transaction
  }

  setMap(transactions: Pool['transactions']) {
    this.transactions = transactions
  }

  existing({ inputAddress }: { inputAddress: string }): Transaction {
    const transactions = Object.values(this.transactions)

    return transactions.find((t) => t.input.address === inputAddress)
  }

  validTransactions() {
    return Object.values(this.transactions).filter((transaction) =>
      Transaction.isValid(transaction),
    )
  }

  clearBlockchainTransactions({ chain }: { chain: Blockchain['chain'] }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]

      for (let transaction of block.data) {
        if (this.transactions[transaction.id]) {
          delete this.transactions[transaction.id]
        }
      }
    }
  }
}
