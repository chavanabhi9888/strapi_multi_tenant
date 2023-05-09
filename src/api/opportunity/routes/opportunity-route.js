module.exports = {
    routes: [
      //dashboard fetch
      //find all the opportunities
      {
        method: "GET",
        path: "/find",
        handler: "opportunity-controller.find",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find by id
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
        path: "/viewOngoing/:id",
        handler: "opportunity-controller.viewOngoing",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //view Completed
      {
        method: "GET",
        path: "/viewCompleted/:id",
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
        path: "/findTopFive/:id",
        handler: "opportunity-controller.findTopFive",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find top 5 ongoing and waiting opportunities
      {
        method: "GET",
        path: "/findTopFiveOngoing/:id",
        handler: "opportunity-controller.findTopFiveOngoing",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find top 5 completed opportunities
      {
        method: "GET",
        path: "/findTopFiveCompleted/:id",
        handler: "opportunity-controller.findTopFiveCompleted",
        config: {
          policies: [],
          middleware: [],
        },
      },
//---------------------------------------------------------------------------------------
      //delete An Opportunity
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
        path: "/:slug",
        handler: "opportunity-controller.get_opportunity",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/opportunities/:slug",
        handler: "opportunity-controller.find_organization_opportunity",
        config: {
          policies: [],
          middleware: [],
        },
      },

      {
        method: "GET",
        path: "/organizations/:id",
        handler: "opportunity-controller.get_organization_opportunity_for_organization_user",
        config: {
          policies: [],
          middleware: [],
        },
      },

      {
        method: "GET",
        path: "/opportunities/find/all",
        handler: "opportunity-controller.find_all_opportunities",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/opportunities/orguser/all",
        handler: "opportunity-controller.find_organizations_of_opportunity",
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
    ],
  };