import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise(resolve => {
      resolve('hash')
    })
  }
}))

const salt = 12
const makeStu = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const stu = makeStu()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await stu.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('Should return a hash on success', async () => {
    const stu = makeStu()
    const hash = await stu.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
