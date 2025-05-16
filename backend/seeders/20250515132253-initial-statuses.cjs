'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('statuses', [
      { name: 'en_attente' },
      { name: 'accepté'    },
      { name: 'refusé'      },
      { name: 'planifié'    },
    ], {})
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('statuses', {
      name: ['en_attente','accepté','refusé','planifié']
    }, {})
  }
}