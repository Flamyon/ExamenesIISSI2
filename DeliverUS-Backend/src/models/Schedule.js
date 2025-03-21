import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Schedule.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' })
      Schedule.hasMany(models.Product, { foreignKey: 'productId', as: 'products' })
    }
  }

  Schedule.init({
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    restaurantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Schedule'
  })

  return Schedule
}

export default loadModel
