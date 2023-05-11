
const jwt = require('jsonwebtoken');


module.exports = async (ctx, next) => {
    try {
        // add a guard clause to check if ctx is defined
        if (!ctx) {
            return next(new Error('Context is not defined'));
        }

        // get the authorization header from the request
        const authHeader = ctx.request.header.authorization;

        console.log("token",authHeader);

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
        console.log("token1", token);
            
            // verify the token and decode its payload
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("token5",payload.id);
           

            // look up the user associated with the token's payload
            const users = await strapi.db.query('api::organization-user.organization-user').findOne({
                where: {
                    id:payload.id
                },
               populate: true,
              })

            // console.log(users);

            // if no user is found, return an error
            if (!users) {
            ctx.response.status = 401;
            ctx.response.body = {
                error: 'Invalid token',
            };
            return;
            }

            // set the authenticated user in the context state
            ctx.state.user = users;

    } catch (err) {
            // if the token is invalid or has expired, return an error
            ctx.status = 401;
            ctx.body = {
            error: 'Invalid token'
            };
            return;
        }

  // call the next middleware function in the chain
  await next();
};