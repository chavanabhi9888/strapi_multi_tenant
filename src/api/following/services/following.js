'use strict';

/**
 * following service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::following.following');
