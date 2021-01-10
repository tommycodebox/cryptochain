import { Wallet, Transaction } from '@/wallet'
import { verifySignature } from '@/utils'
import { Blockchain } from '@/blockchain'
import { STARTING_BALANCE } from '@/config'

describe('Wallet', () => {
  let wallet: Wallet

  beforeEach(() => {
    wallet = new Wallet()
  })

  it('has a `balance`', () => {
    expect(wallet).toHaveProperty('balance')
  })

  it('has a `publicKey`', () => {
    expect(wallet).toHaveProperty('publicKey')
  })

  describe('signing data', () => {
    const data = 'fake-data'

    it('verifies a signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        }),
      ).toBe(true)
    })

    it('does not verify an invalid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        }),
      ).toBe(false)
    })
  })

  describe('createTransaction()', () => {
    describe('and the amount exceeds the balance', () => {
      it('throws an error', () => {
        expect(() =>
          wallet.createTransaction({
            amount: 999999,
            recipient: 'fake-recipient',
          }),
        ).toThrow('Amount exceeds balance')
      })
    })

    describe('and the amount is valid', () => {
      let transaction: Transaction
      let amount: number
      let recipient: string

      beforeEach(() => {
        amount = 50
        recipient = 'fake-recipient'
        transaction = wallet.createTransaction({ amount, recipient })
      })

      it('create an instance of `Transaction`', () => {
        expect(transaction instanceof Transaction).toBe(true)
      })

      it('matches the transaction input with the wallet', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey)
      })

      it('outputs the amount to the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount)
      })
    })
  })

  describe('balance()', () => {
    let blockchain: Blockchain

    beforeEach(() => {
      blockchain = new Blockchain()
    })

    describe('and there are no outputs for the wallet', () => {
      it('should return the `STARTING_BALANCE`', () => {
        expect(
          Wallet.balance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          }),
        ).toEqual(STARTING_BALANCE)
      })
    })

    describe('and there are outputs for the wallet', () => {
      let trx1: Transaction, trx2: Transaction

      beforeEach(() => {
        trx1 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50,
        })

        trx2 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 60,
        })

        blockchain.addBlock({ data: [trx1, trx2] })
      })

      it('should add the sum of all outputs to the wallet balance', () => {
        expect(
          Wallet.balance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          }),
        ).toEqual(
          STARTING_BALANCE +
            trx1.outputMap[wallet.publicKey] +
            trx2.outputMap[wallet.publicKey],
        )
      })
    })
  })
})
