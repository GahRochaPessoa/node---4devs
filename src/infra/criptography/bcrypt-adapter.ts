import bcrypt from 'bcrypt'
import { type Encrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number
  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(value, 12)
    return hashedPassword
  }
}
