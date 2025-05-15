import sequelize from '../config/sequelize.js'
import { User } from './user.model.js'
import { Status } from './status.model.js'
import { Room } from './room.model.js'
import { Slot } from './slot.model.js'
import { Talk } from './talk.model.js'
import { Favorite } from './favorite.model.js'

const initModels = async () => {
  await sequelize.sync({ alter: true })

  // Associations
  User.hasMany(Talk,    { foreignKey: 'speakerId',   as: 'talks' })
  Talk.belongsTo(User,  { foreignKey: 'speakerId',   as: 'speaker' })

  Status.hasMany(Talk,  { foreignKey: 'statusId',    as: 'talks' })
  Talk.belongsTo(Status,{ foreignKey: 'statusId',    as: 'status' })

  Room.hasMany(Slot,    { foreignKey: 'roomId',      as: 'slots' })
  Slot.belongsTo(Room,  { foreignKey: 'roomId',      as: 'room' })

  Slot.hasOne(Talk,     { foreignKey: 'slotId',      as: 'talk' })
  Talk.belongsTo(Slot,  { foreignKey: 'slotId',      as: 'slot' })

  User.belongsToMany(Talk, { through: Favorite, foreignKey: 'userId',  otherKey: 'talkId', as: 'favTalks' })
  Talk.belongsToMany(User, { through: Favorite, foreignKey: 'talkId', otherKey: 'userId', as: 'fans' })
}

export { initModels }