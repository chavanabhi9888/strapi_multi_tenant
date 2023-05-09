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
    method:"GET",
    path :"/users_of_org_user/all",
    handler:"custom.find_all_user_of_org_user",
    config: {
        policies: [],
        middleware: [],
    }
}
]}