import crypto from 'crypto'

export const cryptoHash = (...inputs: any[]) => {
  const hash = crypto.createHash('sha256')

  hash.update(
    inputs
      .map((input) => JSON.stringify(input))
      .sort()
      .join(' '),
  )

  return hash.digest('hex')
}
