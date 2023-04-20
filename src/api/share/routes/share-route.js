module.exports = {
    routes: [
      //dashboard fetch
      //share an opportunities
      {
        method: "POST",
        path: "/share/:id",
        handler: "share-controller.share",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
}