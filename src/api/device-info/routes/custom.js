module.exports = {
    routes: [
      {
        method: "POST",
        path: "/devices",
        handler: "custom.modify",
        config: {
          policies: [],
          middleware: []
        },
      },
    ],
  };
  