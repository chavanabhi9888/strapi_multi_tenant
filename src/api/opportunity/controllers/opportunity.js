'use strict';

/**
 * opportunity controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::opportunity.opportunity');

// const roles = ['Viewer', 'editor', 'admin' ] // API roles res

// createOpportunity ({userID, USerRole, OppDetails, orgID})) => {
//      if(USerRole === 'Viewer') return 'Unauthorised! Not right permissions to create an opportunity';
//      // API for create opp 
// }