module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Staffs',
      [
        { name: 'Staff1', position: 'Chef', email: 'staff1@customer.com', phone: '+3466677888', restaurantId: 1 },
        { name: 'Staff2', position: 'Chef', email: 'staff2@customer.com', phone: '+34616430372', restaurantId: 1 }
      ], {})
  },

  down: async (queryInterface, Sequelize) => {
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE Staffs', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
