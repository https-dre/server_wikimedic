import { User } from "../models/User";

export function toUser(obj: any): User {
    return {
      id: obj._id,
      name: obj.name,
      email : obj.email,
      email_reserva : obj.email_reserva,
      password : obj.password
    };
  }