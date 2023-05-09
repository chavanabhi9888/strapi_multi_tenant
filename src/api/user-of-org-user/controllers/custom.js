'use strict';

/**
 * organization-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::organization-user.organization-user',({strapi})=>({
  // v
// }));

const { connect } = require("../../../../config/pg");
const  verifyToken  = require("../../../../config/middleware");




module.exports = createCoreController('api::user-of-org-user.user-of-org-user',({strapi})=>({
async set_role_user(ctx) {
    try {
      const { firstname,lastname, email, password ,username, is_active, blocked, role } = ctx.request.body.data;

      const user = await strapi.db.query('api::user-of-org-user.user-of-org-user').findOne({
        where: { email: email }
      });
      // // console.log(user);
      if(user) {
          return ctx.badRequest('already registered...', { "user" :user })
        } else {
              const response = await super.create(ctx);
              const client = await connect();
              const query =`
              INSERT INTO admin_users (firstname, lastname, username, email, password, is_active, blocked )
                    VALUES ($1, $2, $3, $4, $5, $6, $7);`

              const data = await client.query(query, [firstname, lastname, username, email, password, is_active, blocked]);


              const query1 = `
              INSERT INTO admin_users_roles_links (user_id, role_id)
              VALUES ((SELECT MAX(id) FROM admin_users), $1 );`
            

              const data1 = await client.query(query1, [role]);
              ctx.send({
                "data":data.rows , "data1":data1.rows, "user":response
              });
    }
    } catch (error) {
      console.log(error);
    }
  },
  async find_all_user_of_org_user(ctx) {
    try {
      await verifyToken(ctx, async () => {
      const users = await strapi.query('api::organization-user.organization-user').findMany({
        where:{
          multi_tenant_organization: ctx.state.user.multi_tenant_organization.id
        },
          populate: ["user_of_org_users"]
            });

            const allUsers = [];
            for (const user of users) {
              if (user.hasOwnProperty('user_of_org_users')) {
                allUsers.push(...user.user_of_org_users);
              }
            }

        ctx.send({  
          "data": allUsers
        });
      });

      } catch (error) {
        console.log(error);
      }
    }
}));
