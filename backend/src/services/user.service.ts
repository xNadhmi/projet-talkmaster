import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'

export const findById = async (id: number) => {
  const user = await User.findByPk(id)
  if (!user) throw new ApiError(404, 'User not found')
  return user
}