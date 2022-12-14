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
    return queryInterface.bulkInsert('Reviews', [
      {
        userId: 1,
        spotId: 1,
        review: 'efkjbdskjlvbdskvbdsvb kwjerbvekrbverov ebvoaerovervreovreo',
        stars: 1
      },
      {
        userId: 2,
        spotId: 2,
        review: 'berkherkviue eijrhvbeiruiuv dfveaon efouvhreiohvoeirhahvioehaiopeopiaeopvaievpeaivpearpvipjevpo',
        stars: 4
      },
      {
        userId: 3,
        spotId: 3,
        review: 'reghjrebkjrebuirebiouveroqvnoiernoveqriuvbor eofuvhoueqrnvioneroivneorinve  o3qihvnoirvnrniovnqprenqpvrqnvoqmnpoqo',
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
    return queryInterface.bulkDelete('Reviews', {}, {});
  }
};
