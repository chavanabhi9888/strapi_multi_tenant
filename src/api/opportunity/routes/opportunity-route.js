module.exports = {
    routes: [
      //dashboard fetch
      //find
      {
        method: "GET",
        path: "/find",
        handler: "opportunity-controller.find",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find Opportunity
      {
        method: "GET",
        path: "/findOpportunity/:id",
        handler: "opportunity-controller.findOpportunity",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find Opportunity Details
      {
        method: "GET",
        path: "/findOpportunityDetails/:id",
        handler: "opportunity-controller.findOpportunityDetails",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //view Ongoing
      {
        method: "GET",
        path: "/viewOngoing",
        handler: "opportunity-controller.viewOngoing",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //view Completed
      {
        method: "GET",
        path: "/viewCompleted",
        handler: "opportunity-controller.viewCompleted",
        config: {
          policies: [],
          middleware: [],
        },
      },
//--------------------------------------------------------------------------------------
      //splash screen per fetch data
      //find top 5 new opportunities
      {
        method: "GET",
        path: "/findTopFive",
        handler: "opportunity-controller.findTopFive",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find top 5 ongoing and waiting opportunities
      {
        method: "GET",
        path: "/findTopFiveOngoing",
        handler: "opportunity-controller.findTopFiveOngoing",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find top 5 completed opportunities
      {
        method: "GET",
        path: "/findTopFiveCompleted",
        handler: "opportunity-controller.findTopFiveCompleted",
        config: {
          policies: [],
          middleware: [],
        },
      },
//--------------------------------------------------------------------------------------
      //apply Opportunity
      // {
      //   method: "GET",
      //   path: "/applyOpportunity",
      //   handler: "opportunity-controller.applyOpportunity",
      //   config: {
      //     policies: [],
      //     middleware: [],
      //   },
      // },
      //delete An Opportunity
      // {
      //   method: "DELETE",
      //   path: "/delete/:id",
      //   handler: "opportunity-controller.delete",
      //   config: {
      //     policies: [],
      //     middleware: [],
      //   },
      // },
    ],
  };