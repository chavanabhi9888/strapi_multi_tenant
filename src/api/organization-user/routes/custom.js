module.exports = {
    routes:[
        {
            method:"POST",
            path :"/register",
            handler:"custom.register",
            config: {
                policies: [],
                middleware: [],
            }
        },
        {
            method:"POST",
            path :"/login",
            handler:"custom.login",
            config: {
                policies: [],
                middleware: [],
            }
        },
        {
            method:"GET",
            path :"/:slug/orguser",
            handler:"custom.find_organizations_user",
            config: {
                policies: [],
                middleware: [],
            }
        },
        {
            method:"GET",
            path :"/users/:id",
            handler:"custom.get_user",
            config: {
                policies: [],
                middleware: [],
            }
        },
        {
            method:"GET",
            path :"/user/:slug",
            handler:"custom.get_user_created_by_org_user",
            config: {
                policies: [],
                middleware: [],
            }
        },
        {
            method:"GET",
            path :"/organization_users/all",
            handler:"custom.find_all_organization_user",
            config: {
                policies: [],
                middleware: [],
            }
        },
        {
            "method": "POST",
            "path": "/auth/logout",
            "handler": "custom.logout",
            "config": {
              "policies": []
            }
          }
    ]
}