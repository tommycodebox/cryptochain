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

      expect(pool.transactions[transaction.id]).toBe(transaction)
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

  describe('validTransactions()', () => {
    let validTransactions: Transaction[], errorMock: jest.Mock

    beforeEach(() => {
      validTransactions = []
      errorMock = jest.fn()
      global.console.error = errorMock

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet,
          recipient: 'any-one',
          amount: 30,
        })

        if (i % 3 === 0) {
          transaction.input.amount = 9999999
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign('foo')
        } else {
          validTransactions.push(transaction)
        }

        pool.set(transaction)
      }
    })

    it('should return valid transaction', () => {
      expect(pool.validTransactions()).toEqual(validTransactions)
    })

    it('should log errors for the invalid transactions', () => {
      pool.validTransactions()
      expect(errorMock).toHaveBeenCalled()
    })
  })
})
