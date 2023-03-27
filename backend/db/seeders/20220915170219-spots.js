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

    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '123 yellow brick road',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 38.5678555,
        lng: 120.7658333,
        name: 'house of the beatles',
        description: 'most visitied house in all of Miami!',
        price: 1000.00,
        // avgRating: 1.5,
        // previewImage: 'imageback.com'
      },
      {
        ownerId: 2,
        address: '3955 sw 127 ave',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 39.5558111,
        lng: 50.7459222,
        name: 'The big house',
        description: 'largest house in all of LA!',
        price: 20000.00,
        // avgRating: 5,
        // previewImage: 'thisismyimage.com'
      },
      {
        ownerId: 3,
        address: '555 programmer way',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 20.7778888,
        lng: 160.8898777,
        name: 'Alains House',
        description: 'Where people come to recieve a programmer life sentence!',
        price: 500.00,
        // avgRating: 4.5,
        // previewImage: 'preview.com'
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
    return queryInterface.bulkDelete('Spots', {
      address: { [Op.in]: ['123 yellow brick road', '3955 sw 127 ave', '555 programmer way'] }
    }, {});
  }
};
