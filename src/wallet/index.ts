import { STARTING_BALANCE } from '@/config'
import { ec } from '@/utils'
import { curve } from 'elliptic'

export class Wallet {
  balance: number
  publicKey: string

  constructor() {
    this.balance = STARTING_BALANCE

    const keyPair = ec.genKeyPair()

    this.publicKey = keyPair.getPublic().encode('hex', false)
  }
}
