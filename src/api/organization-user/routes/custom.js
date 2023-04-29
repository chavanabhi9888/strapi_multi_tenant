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
            method:"POST",
            path :"/setrole",
            handler:"custom.find",
            config: {
                policies: [],
                middleware: [],
            }
        },
        {
            method:"GET",
            path :"/:slug/orguser",
            handler:"custom.find_organization_user",
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
            path :"/test/:slug",
            handler:"custom.function",
            config: {
                policies: [],
                middleware: [],
            }
        }
    ]
}