import { Sequelize } from 'sequelize'
import { DATABASE_URL } from './index.js'

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'mysql',
  logging: msg => console.debug(msg),
})

export default sequelize