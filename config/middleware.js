
const jwt = require('jsonwebtoken-promisified');


module.exports = async (ctx, next) => {
    try {
        // add a guard clause to check if ctx is defined
        if (!ctx) {
            return next(new Error('Context is not defined'));
        }

        // get the authorization header from the request
        const authHeader = ctx.request.header.authorization;

        // console.log("token",authHeader);

        // if no authorization header is provid   ed, return an error
        if (!authHeader) {
            ctx.data.response.status = 401;
            ctx.response.body = {
            error: 'Authorization header missing'
            };
            return;
        }

        // extract the token from the authorization header
        const token = authHeader.split(' ')[2];
        // console.log("token1", token);
            
            // verify the token and decode its payload
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("payload",payload);
           

            // look up the user associated with the token's payload
            const admin_user = await strapi.db.query('admin::user').findOne({
                where: {
                    id:payload.id
                },
               populate: true,
              })
            //   console.log(admin_user);
            if(payload.org_user_id){
              const org_user = await strapi.db.query('api::organization-user.organization-user').findOne({
                where: {
                    id:payload.org_user_id
                },
               populate: true,
              })
              ctx.state.user = await { admin_user , org_user };
            }
            else{
            const user = await strapi.db.query('api::user-of-org-user.user-of-org-user').findOne({
                where: {
                    id:payload.user_id
                },
               populate: true,
              })
              ctx.state.user = await { admin_user , user};
            }

            // const permissions = await strapi.db.query('admin::role').findOne({
            //     where: {
            //         id:payload.role_id
            //     },
            //    populate: ["permissions"],
            //   })
            //   console.log(permissions);

            // if no user is found, return an error
            if (!admin_user) {
            ctx.response.status = 401;
            ctx.response.body = {
                error: 'Invalid token111',
            };
            return;
            }

            // set the authenticated user in the context state
            //  ctx.state.user = await { admin_user };
            // console.log(ctx.state.user);

    } catch (err) {
            // if the token is invalid or has expired, return an error
            ctx.status = 401;
            ctx.body = {
            error: err
            };
            // console.log(err);
            return;
        }

  // call the next middleware function in the chain
  await next();
}; 