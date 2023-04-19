module.exports = {
    routes: [
      //dashboard fetch
      //unsave an opportunities
      {
        method: "DELETE",
        path: "/unsave/:id",
        handler: "save-controller.unsave",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/saved/:id",
        handler: "save-controller.saved",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
}