'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    options.tableName = 'Reviews'

    return queryInterface.bulkInsert(options, [
      {
        userId: 2,
        spotId: 1,
        review: 'The best house I have ever stayed in!! amazing experience!!',
        stars: 1
      },
      {
        userId: 3,
        spotId: 2,
        review: 'Would recommend this house to my closest friends! Amazing house with a surplus of amenities! Amazing experieince! Cant wait to come again!',
        stars: 4
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Exciting and interesting spot. Area is average but the house is kept well and very clean. Amazing views and friendly owners!',
        stars: 5
      }
    ], {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */


    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options);

    // return queryInterface.bulkDelete('Reviews', {}, {});
  }
};
