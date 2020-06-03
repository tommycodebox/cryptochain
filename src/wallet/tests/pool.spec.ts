import { Wallet, Transaction, Pool } from '@/wallet'

describe('TransactionPool', () => {
  let pool: Pool
  let transaction: Transaction

  beforeEach(() => {
    pool = new Pool()
    transaction = new Transaction({
      senderWallet: new Wallet(),
      recipient: 'fake-recipient',
      amount: 50,
    })
  })

  describe('setTransaction()', () => {
    it('adds a transaction', () => {
      pool.set(transaction)

      expect(pool.transactionMap[transaction.id]).toBe(transaction)
    })
  })
})
