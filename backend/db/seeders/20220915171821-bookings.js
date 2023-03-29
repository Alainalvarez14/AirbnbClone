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

    options.tableName = 'Bookings'

    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        startDate: new Date(),
        endDate: new Date(),
      },
      {
        userId: 2,
        spotId: 2,
        startDate: new Date(),
        endDate: new Date(),
      },
      {
        userId: 3,
        spotId: 3,
        startDate: new Date(),
        endDate: new Date(),
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

    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options);

    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete('Users', {}, {});
  }
};
