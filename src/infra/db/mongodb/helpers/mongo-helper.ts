/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Collection, MongoClient, type ObjectId } from 'mongodb'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL!)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },

  map(collection: AddAccountModel, id: ObjectId): AccountModel {
    const accountObjModel = {
      id: String(id),
      email: collection.email,
      name: collection.name,
      password: collection.password
    }
    return accountObjModel
  }
}
