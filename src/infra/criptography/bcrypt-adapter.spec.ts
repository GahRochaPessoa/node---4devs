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

  test('Should throw if bcrypt throws', async () => {
    const stu = makeStu()
    jest.spyOn<any, string>(bcrypt, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )
    const promise = stu.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
