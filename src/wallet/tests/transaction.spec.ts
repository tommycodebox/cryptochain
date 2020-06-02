import { Wallet } from '@/wallet'
import { Transaction } from '@/wallet'
import { verifySignature } from '@/utils'

describe('Transaction', () => {
  let transaction: Transaction
  let senderWallet: Wallet
  let recipient: string
  let amount: number

  beforeEach(() => {
    senderWallet = new Wallet()
    recipient = 'fake-public-key'
    amount = 50
    transaction = new Transaction({ senderWallet, recipient, amount })
  })

  it('has an `id`', () => {
    expect(transaction).toHaveProperty('id')
  })

  describe('outputMap', () => {
    it('has an `outputMap`', () => {
      expect(transaction).toHaveProperty('outputMap')
    })

    it('outputs the amount to recipient', () => {
      expect(transaction.outputMap[recipient]).toEqual(amount)
    })

    it('outputs the remaining balance for the `senderWallet`', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount,
      )
    })
  })

  describe('input', () => {
    it('has an `input`', () => {
      expect(transaction).toHaveProperty('input')
    })
    it('has an `timestamp` in the input', () => {
      expect(transaction.input).toHaveProperty('timestamp')
    })

    it('sets the `amount` to the `senderWallet` balance', () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance)
    })

    it('sets the `address` to the `senderWallet` publicKey', () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey)
    })

    it('signs the input', () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        }),
      ).toBe(true)
    })
  })

  describe('isValid()', () => {
    let errorMock: jest.Mock

    beforeEach(() => {
      errorMock = jest.fn()

      global.console.error = errorMock
    })

    describe('when the transaction is valid', () => {
      it('returns true', () => {
        expect(Transaction.isValid(transaction)).toBe(true)
      })
    })

    describe('when the transaction is invalid', () => {
      describe('and a transaction outputMap value is invalid', () => {
        it('returns false and logs an error', () => {
          transaction.outputMap[senderWallet.publicKey] = 99999

          expect(Transaction.isValid(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })

      describe('and a transaction input signature is invalid', () => {
        it('returns false and logs an error', () => {
          transaction.input.signature = new Wallet().sign('data')

          expect(Transaction.isValid(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })
    })
  })

  describe('update()', () => {
    let originalSignature: string
    let originalSenderOutput: number
    let nextRecipient: string
    let nextAmount: number

    beforeEach(() => {
      originalSignature = transaction.input.signature
      originalSenderOutput = transaction.outputMap[senderWallet.publicKey]
      nextRecipient = 'next-recipient'
      nextAmount = 50

      transaction.update({
        senderWallet,
        recipient: nextRecipient,
        amount: nextAmount,
      })
    })

    it('outputs the amount to the next recipient', () => {
      expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount)
    })

    it('subtracts the amount from the original sender output amount', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        originalSenderOutput - nextAmount,
      )
    })

    it('maintains the total output value that matches the input amount', () => {
      expect(
        Object.values(transaction.outputMap).reduce(
          (total, outputAmount) => total + outputAmount,
        ),
      ).toEqual(transaction.input.amount)
    })

    it('re-signs the transaction', () => {
      expect(transaction.input.signature).not.toEqual(originalSignature)
    })
  })
})
