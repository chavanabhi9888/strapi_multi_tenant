'use strict';

/**
 * user-of-org-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-of-org-user.user-of-org-user');
