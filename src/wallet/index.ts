export * from './transaction'

import { STARTING_BALANCE } from '@/config'
import { ec, cryptoHash } from '@/utils'

export class Wallet {
  balance: number
  publicKey: string
  keyPair = ec.genKeyPair()

  constructor() {
    this.balance = STARTING_BALANCE

    this.keyPair = ec.genKeyPair()

    this.publicKey = this.keyPair.getPublic().encode('hex', false)
  }

  sign(data: any) {
    return this.keyPair.sign(cryptoHash(data))
  }
}
