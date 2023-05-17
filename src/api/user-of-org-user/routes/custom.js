module.exports = {
    routes:[
{
    method:"POST",
    path :"/create_user",
    handler:"custom.set_role_user",
    config: {
        policies: [],
        middleware: [],
    }
},
{
    method:"POST",
    path :"/auth/login",
    handler:"custom.login",
    config: {
        policies: [],
        middleware: [],
    }
},
// {
//     method:"GET",
//     path :"/user/permissions/data",
//     handler:"custom.Get_all_permission",
//     config: {
//         policies: [],
//         middleware: [],
//     }
// },
{
    method:"GET",
    path :"/users_of_org_user/all",
    handler:"custom.find_all_user_of_org_user",
    config: {
        policies: [],
        middleware: [],
    }
},
{
    method:"GET",
    path :"/custom/opportunity_of_user",
    handler:"custom.find_opportunity_of_user",
    config: {
        policies: [],
        middleware: [],
    }
},
// {
//     method:"POST",
//     path :"/auth/logout",
//     handler:"custom.logout",
//     config: {
//         policies: [],
//         middleware: [],
//     }
// }
]}