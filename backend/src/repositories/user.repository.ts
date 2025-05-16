import { User } from '../models/user.model.js'

export const findByEmail = async (email: string) => {
  return User.findOne({ where: { email } })
}

export const createUser = async (data: { name: string, email: string, password: string, role: string }) => {
  return User.create(data)
}