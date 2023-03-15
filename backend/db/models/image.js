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
    userId: {
      type: DataTypes.INTEGER,
    },
    spotImageId: {
      type: DataTypes.INTEGER,
    },
    reviewImageId: {
      type: DataTypes.INTEGER,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preview: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
