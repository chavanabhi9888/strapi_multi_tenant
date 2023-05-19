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
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const util = require('util');
const bcryptCompare = util.promisify(bcrypt.compare);


module.exports = createCoreController('api::user-of-org-user.user-of-org-user',({strapi})=>({
  async login(ctx) {
    const { email, password } = ctx.request.body;
    const body = ctx.request.body
    // Check if email and password are provided
    if (!email || !password) {
      return ctx.badRequest('Please provide email and password');
    }
    
    // // Find the user with the provided email
    
    const user = await strapi.db.query('api::user-of-org-user.user-of-org-user').findOne({
      where: {
        email
      },
     populate: true,
    })

    const role = await strapi.db.query('admin::user').findOne({
      where: {
        email
      },
     populate: ["roles"],
    })
    console.log("user",user);
    if (!user) {
      return ctx.badRequest('User not found');
    }
    
    const isMatch = await bcryptCompare(password, user.password);
  
      if (!isMatch) {
        return ctx.badRequest('Incorrect password');
      }
      
      // // Generate JWT token
      const token = jwt.sign({ id:role.id, role_id:role.roles[0].id, user_id:user.id }, process.env.JWT_SECRET);
      const client = await connect();
      const query = 
        `UPDATE user_of_org_users SET token = $1 where email = $2`;
      const data = await client.query(query,[token,email]);
      const query1 = 
          `SELECT * from user_of_org_users where email = $1`;
      const data1 = await client.query(query1,[email]);
      // Send response
      ctx.send({ "data":data1.rows });
  },

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
               "user":response
              },200);
    }
    } catch (error) {
      console.log(error);
    }
  },
  async find_opportunity_of_user(ctx) {
      // Get the token from the request headers
      await verifyToken(ctx, async () => {
      try {
        const user = await strapi.db.query('api::user-of-org-user.user-of-org-user').findOne({
          where: {
            id:ctx.state.user.user.id
          },
         populate: ["organization_user"],
        })
        const user2 = await strapi.db.query('api::organization-user.organization-user').findOne({
          where: {
            id:user.organization_user.id
          },
         populate: true,
        })
        ctx.send(
          {"Opportunity of user":user2.opportunities},
          200
        )
        
      } catch (err) {
        ctx.send(
          {"Error":err},
          401
        )
      }
    });
    },
  async find_all_user_of_org_user(ctx) {
    try {
      await verifyToken(ctx, async () => {
      const users = await strapi.query('api::user-of-org-user.user-of-org-user').findMany({
        where:{
          id: ctx.state.user.user.id
        },
          populate: ["organization_user"]
            });
      const users1 = await strapi.query('api::organization-user.organization-user').findMany({
        where:{
          id: users[0].organization_user.id
        },
          populate: ["user_of_org_users"]
            });


            const allUsers = [];
            for (const user of users1) {
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
    },
    async Get_all_permission(ctx) {
      try {
        await verifyToken(ctx, async () => {
          console.log(ctx.state.user.admin_user.roles[0].id);
          const users = await strapi.db.query('admin::role').findMany({
            where: {
              id:ctx.state.user.admin_user.roles[0].id
            },
           populate: ["permissions"],
          })
  
              const allUsers = [];
              for (const user of users) {
                if (user.hasOwnProperty('permissions')) {
                  allUsers.push(...user.permissions);
                }
              }
        // console.log(ctx.state.user.roles[0].id);
          
          ctx.send({  
            "data": allUsers
          });
        });
  
        } catch (error) {
          console.log(error);
        }
      },
      async logout_user(ctx) {
        try {
          // Clear the session and cookies on the server side
          ctx.cookies.set('jwt', null, { httpOnly: true, maxAge: 0 });
          ctx.session = null;
      
          ctx.send({
            message: 'Logged out successfully.'
          });
        } catch (error) {
          ctx.throw(500, 'Unable to logout.');
        }
      },
}));
