module.exports = {
    routes: [
      {
        method: "GET",
        path: "/find",
        handler: "my-controller.find",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/findPost/:id",
        handler: "my-controller.findPost",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/applyPost/:id",
        handler: "my-controller.applyPost",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "DELETE",
        path: "/delete/:id",
        handler: "my-controller.delete",
        config: {
          policies: [],
          middleware: [],
        },
      },
      // {
      //   method: "GET",
      //   path: "/findOngoing/:id",
      //   handler: "my-controller.findOngoing",
      //   config: {
      //     policies: [],
      //     middleware: [],
      //   },
      // }
    ],
  };