import { Wallet, Transaction, Pool } from '@/wallet'

describe('TransactionPool', () => {
  let pool: Pool
  let transaction: Transaction
  let senderWallet: Wallet

  beforeEach(() => {
    pool = new Pool()
    senderWallet = new Wallet()
    transaction = new Transaction({
      senderWallet,
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

  describe('existing()', () => {
    it('returns and existing transaction given an input address', () => {
      pool.set(transaction)

      expect(pool.existing({ inputAddress: senderWallet.publicKey })).toBe(
        transaction,
      )
    })
  })
})
