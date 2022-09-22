'use strict';

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

    return queryInterface.bulkInsert('Images', [
      {
        url: 'myurl.com',
        reviewImageId: 1,
        spotImageId: 1,
        preview: true,
        userId: 1,
      },
      {
        url: 'thisismyhouse.com',
        reviewImageId: 2,
        spotImageId: 2,
        preview: true,
        userId: 2,
      },
      {
        url: 'becomeaprogrammer.org',
        reviewImageId: 3,
        spotImageId: 3,
        preview: false,
        userId: 3,
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

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Images', {}, {});
  }
};
