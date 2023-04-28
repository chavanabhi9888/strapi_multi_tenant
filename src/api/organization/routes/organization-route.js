module.exports = {
    routes: [
      {
        method: "POST",
        path: "/create",
        handler: "organization-controller.create",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/:slug",
        handler: "organization-controller.find_organization",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "DELETE",
        path: "/delete",
        handler: "organization-controller.delete",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
}