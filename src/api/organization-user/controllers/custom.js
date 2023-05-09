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
const  verifyToken  = require("../../../../config/middleware");






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
      where: {
        email
      },
     populate: true,
    })

  
    if (!user) {
      return ctx.badRequest('User not found');
    }
    
    bcrypt.compare(ctx.request.body.password, function(err, result) {
      if (result) {
        return ctx.badRequest("password is incorrect");
      }
      });
      
      // // Generate JWT token
      const token = jwt.sign({ id:user.id, organization_id:user.multi_tenant_organization.id, organization:user.multi_tenant_organization.name }, process.env.JWT_SECRET);
      const client = await connect();
      const query = 
        `UPDATE organization_users SET token = $1 where email = $2`;
      const data = await client.query(query,[token,email]);
      const query1 = 
          `SELECT * from organization_users where email = $1`;
      const data1 = await client.query(query1,[email]);
      // Send response
      ctx.send({ "data":data1.rows });
  },



  async register(ctx) {
    const { firstname,lastname, email, password ,username, is_active, blocked, multi_tenant_organization} = ctx.request.body.data;
    
    const user = await strapi.db.query('api::organization-user.organization-user').findOne({
        where: { email: email }
      });
      // // console.log(user);
      if(user) {
          return ctx.badRequest('already registered...', { "user" :user })
        } else {
            const response = await super.create(ctx);

            const client = await connect();
            const query2 = `
            INSERT INTO organization_users_multi_tenant_organization_links (organization_user_id, organization_id)
            VALUES ( (SELECT MAX(Id) FROM organization_users), $1 );`
            const data2 = await client.query(query2, [ multi_tenant_organization ]);


            const query = `
            INSERT INTO admin_users (firstname, lastname, username, email, password, is_active, blocked)
            VALUES ($1, $2, $3, $4, $5, $6, $7);`
            const data = await client.query(query, [firstname, lastname, username, email, password, is_active, blocked]);
            const query1 = `
                INSERT INTO admin_users_roles_links (user_id, role_id)
                VALUES ((SELECT MAX(Id) FROM admin_users), 7);`

                const data1 = await client.query(query1);
                // ctx.send({
                //   data:data.rows,
                // });
            ctx.send({ "user":data.rows, "orguser":response, "role":data1.rows})
        }
  },



  async find_organizations_user(ctx) {
    try {
    await verifyToken(ctx, async () => {

      const client = await connect();
      const query = 
    `SELECT * from organizations where name = $1`;
    const data = await client.query(query, [ctx.params.slug]);
      if(data.rows.length>0){
        if(ctx.params.slug===ctx.state.user.multi_tenant_organization.name){
          const query1 = 
            `SELECT
            ou.id,
            ou.firstname,
            o.name
            FROM
            organization_users ou
            LEFT JOIN organization_users_multi_tenant_organization_links oumt ON ou.id = oumt.organization_user_id
            LEFT JOIN organizations o ON o.id = oumt.organization_id
            WHERE o.name LIKE $1;`
            const data1 = await client.query(query1, [ctx.params.slug]);
            ctx.send({
              "data": data1.rows
            });
          } else {
            ctx.send({
              "Organization": "organization is not registered with user"
            });
          }

      } else {
        return ctx.badRequest('Organization not found', { "Organization" : ctx.params.slug})
      }
    });
    
    } catch (error) {
      console.log(error);
    }
  },

  async get_user(ctx) {
    await verifyToken(ctx, async () => {
      const client = await connect();
      const query = 
              `SELECT
              ufougul.user_of_org_user_id AS "user_id",
              ufou.firstname,
              ufou.email
              FROM user_of_org_users_organization_user_links ufougul
              LEFT JOIN user_of_org_users ufou ON ufou.id = ufougul.user_of_org_user_id
              WHERE ufougul.organization_user_id = $1;
              `;
    const data = await client.query(query, [ctx.params.id]);
      ctx.send({
        "data": data.rows
      });
    });
  }, 
  
  

  async get_user_created_by_org_user(ctx, next) {
    try {
      await verifyToken(ctx, async () => {
      const client = await connect();
        const query = 
            `SELECT
            oul.organization_user_id AS "organizationUserID",
            ou.firstname AS "organizationUserFirstName",
            uoou.id AS "userOfOrganizationUserID",
            uoou.firstname AS "userOfOrganizationUserName",
            uoou.email AS "userOfOrganizationUserEmail"
            
            FROM user_of_org_users uoou
            LEFT JOIN user_of_org_users_organization_user_links oul ON uoou.id = oul.user_of_org_user_id
            LEFT JOIN organization_users ou ON ou.id = oul.organization_user_id
            WHERE ou.firstname LIKE $1 `;
    
        const data1 = await client.query(query, [ctx.params.slug]);
        ctx.send({
          "data": data1.rows  
        });
      });
    
    } catch (error) {
      console.log(error);
    }
  },
  async find_all_organization_user(ctx ) {
    try {
      const client = await connect();
      const query = 
          `SELECT * FROM organization_users
          ORDER BY id ASC 
          `;
      const data = await client.query(query);
      if(data.rows.length>0){
        ctx.send({  
          "data": data.rows
        });
      } else {
        return ctx.badRequest('Data not found', { "Data" : data.rows})
      }
    } catch (error) {
      console.log(error);
    }
  },
  async logout(ctx) {
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