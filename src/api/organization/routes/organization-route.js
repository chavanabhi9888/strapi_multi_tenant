module.exports = {
    routes: [
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