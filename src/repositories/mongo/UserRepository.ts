import { randomUUID } from "crypto";
import { IUserRepository } from "..";
import { User } from "../../models/User";
import { mongo } from "../../data/mongoDB/conn"
import { ObjectId } from "mongodb";

export class UserRepository implements IUserRepository {
  async save(data: Omit<User, "id">): Promise<void> {
    const users = mongo.db.collection("user");
    await users.insertOne({
      _id: randomUUID() as unknown as ObjectId,
      ...data
    });
  }
  async delete(id: string): Promise<void> {
    const users = mongo.db.collection("user");
    await users.deleteOne({ _id: id as unknown as ObjectId });
  }
  async findByEmail(email: string): Promise<User | null> {
    const users = mongo.db.collection("user");
    const result = await users.findOne<User & { _id: ObjectId }>({ email });
    if (!result) return null;
    return result;
  }

  async findById(id: string): Promise<User | null> {
    const users = mongo.db.collection("user");
    const result = await users.findOne<User & { _id: ObjectId }>({ _id: id as unknown as ObjectId});
    if (!result) return null;
    return result;
  }

  async updateById(id: string, update: Partial<Omit<User, "id">>): Promise<void> {
    const users = mongo.db.collection("user");
    await users.updateOne({ _id: new ObjectId(id)}, { $set: update });
  }
}