export * from './crypto-hash'
export * from './pubsub'

import { ec as EC } from 'elliptic'
import { cryptoHash } from '@/utils'

export const ec = new EC('secp256k1')

type VerifySignature = (props: {
  publicKey: string
  data: any
  signature: EC.Signature
}) => boolean

export const verifySignature: VerifySignature = ({
  publicKey,
  data,
  signature,
}) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')

  return keyFromPublic.verify(cryptoHash(data), signature)
}
