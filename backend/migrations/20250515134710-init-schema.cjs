'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:         { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name:       { type: Sequelize.STRING(100), allowNull: false },
      email:      { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password:   { type: Sequelize.STRING(255), allowNull: false },
      role:       { type: Sequelize.ENUM('conférencier','organisateur'), allowNull: false },
      createdAt:  { type: Sequelize.DATE, allowNull: false },
      updatedAt:  { type: Sequelize.DATE, allowNull: false },
    })
    await queryInterface.createTable('statuses', {
      id:    { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name:  { type: Sequelize.ENUM('en_attente','accepté','refusé','planifié'), allowNull: false, unique: true },
    })
    // … créez ici les tables rooms, slots, talks, favorites, etc.
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('favorites')
    await queryInterface.dropTable('talks')
    await queryInterface.dropTable('slots')
    await queryInterface.dropTable('rooms')
    await queryInterface.dropTable('statuses')
    await queryInterface.dropTable('users')
  }
}