import { Model } from 'sequelize'
const loadModel = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate (models) {
      Staff.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' })
    }
  }
  Staff.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    position: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING
    },
    restaurantId: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'Staff'
  })
  return Staff
}
export default loadModel
