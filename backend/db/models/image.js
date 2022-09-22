'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.User, { foreignKey: 'userId' });
      Image.belongsTo(models.Review, { foreignKey: 'reviewImageId' });
      Image.belongsTo(models.Spot, { foreignKey: 'spotImageId' });
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewImageId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    spotImageId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    preview: {
      type: DataTypes.BOOLEAN,
      // allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
