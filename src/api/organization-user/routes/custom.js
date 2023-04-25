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
            path :"/findCustom",
            handler:"custom.findCustom",
            config: {
                policies: [],
                middleware: [],
            }
        }
    ]
}