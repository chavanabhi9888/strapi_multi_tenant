
// module.exports = async (ctx, next) => {
//     const { user } = ctx.state;
    
//     if (!user) {
//       return ctx.unauthorized('User not authenticated');
//     }
  
//     const { roles } = user;
  
//     // Check user's role and required permissions based on the route or model being accessed
//     if (roles.some(role => role.name === 'Viewer')) {
//       // Check if the user has read permission
//       if (ctx.request.method === 'GET') {
//         return await next();
//       }
//     } else if (roles.some(role => role.name === 'Editor')) {
//       // Check if the user has read, create, and update permissions
//       if (ctx.request.method === 'GET' || ctx.request.method === 'POST' || ctx.request.method === 'PUT') {
//         return await next();
//       }
//     } else if (roles.some(role => role.name === 'Opportunity Admin')) {
//       // Check if the user has read, create, update, and delete permissions
//       if (ctx.request.method === 'GET' || ctx.request.method === 'POST' || ctx.request.method === 'PUT' || ctx.request.method === 'DELETE') {
//         return await next();
//       }
//     }
  
//     // User is not authorized to access the route or perform the action
//     return ctx.forbidden('Unauthorized');
//   };