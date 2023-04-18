module.exports = {
    routes: [
      {
        method: "GET",
        path: "/find",
        handler: "opportunity-controller.find",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/findPost/:id",
        handler: "opportunity-controller.findPost",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/findDetails/:id",
        handler: "opportunity-controller.findDetails",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "DELETE",
        path: "/delete/:id",
        handler: "opportunity-controller.delete",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/findOngoing",
        handler: "opportunity-controller.findOngoing",
        config: {
          policies: [],
          middleware: [],
        },
      }
    ],
  };