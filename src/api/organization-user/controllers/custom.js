'use strict';

/**
 * organization-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::organization-user.organization-user',({strapi})=>({
  // v
// }));


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { connect } = require("../../../../config/pg");






module.exports = createCoreController('api::organization-user.organization-user',({strapi})=>({
  async login(ctx) {
    const { email, password } = ctx.request.body;
    const body = ctx.request.body
    // Check if email and password are provided
    if (!email || !password) {
      return ctx.badRequest('Please provide email and password');
    }
    
    // // Find the user with the provided email
    const user = await strapi.db.query('api::organization-user.organization-user').findOne({
      where: { email: email }
    });

    

    if (!user) {
      return ctx.badRequest('User not found');
    }
    
    bcrypt.compare(ctx.request.body.password, function(err, result) {
      if (result) {
        return ctx.badRequest("password is incorrect");
      }
      });
      
      // // Generate JWT token
      const token = jwt.sign({ body }, process.env.JWT_SECRET);
      // Send response
      ctx.send({"login successful....":token , user });
  },



  async register(ctx) {
    const { name, email, Organization, password } = ctx.request.body.data;
    
    const user = await strapi.db.query('api::organization-user.organization-user').findOne({
        where: { email: email }
      });
      // // console.log(user);
      if(user) {
          return ctx.badRequest('already registered...', { user : "user"})
        } else {
            const response = await super.create(ctx);
        }
        ctx.send(user)
  },



  async find(ctx) {
    try {
      const client = await connect();
      const query = 
    //   INSERT INTO admin_users (firstname, lastname, username, email, password, is_active, blocked)
    //   VALUES ('Dhanashree', 'mule', 'Dhanoooo', 'Dhanashree@geexu.in', 'Pass@1', true, false);
      `
      INSERT INTO admin_users_roles_links (user_id, role_id)
      VALUES (4,2);
    `;

      const data = await client.query(query);
      ctx.send({
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }
  }));