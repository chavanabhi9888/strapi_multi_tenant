const { connect } = require("../../../../config/pg");
const  verifyToken  = require("../../../../config/middleware");


module.exports = {
  //dashboard
  //This will fetch all the new opportunities on dashboard
  async find(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT 
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.months) AS "Duration",
      COALESCE(opp.start_on) AS "Start Date",
      COALESCE(opp.end_on) AS "End Date",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      LEFT JOIN ratings r ON r.id = rol.rating_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      WHERE
      opp.is_deleted = false
      GROUP BY 
      org_logo.url,
      opp.months,
      opp.start_on,
      opp.end_on,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
      opp.published_at
      ORDER BY
      opp.published_at DESC
    `;

      const data = await client.query(query);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //fetching responsibilities and skills of an individual opportunity
  async findOpportunity(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT 
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.responsibilities, '') AS "Responsibilities",
      COALESCE(opp.skills, '') AS "Skills",
      ARRAY_AGG(t.tag) AS Tags
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      LEFT JOIN opportunities_tags_links otl ON otl.opportunity_id = opp.id
      LEFT JOIN tags t ON otl.tag_id = t.id
      WHERE
      opp.id = $1 AND opp.is_deleted = false
      GROUP BY 
      org_logo.url,
      org.name,
      opp.profile,
      opp_image.url,
      opp.responsibilities,
      opp.skills,
      opp.published_at
      ORDER BY
      opp.published_at DESC;
    `;

      const data = await client.query(query, [ctx.params.id]);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //displaying facilities, terms and support of an individual opportunity
  async findOpportunityDetails(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT
      opp_image.url AS "Opportunity image",
      org.name AS "Organization name",
      opp.profile AS "Opportunity profile",
      opp.facilities AS "Facilities provided",
      opp.support AS "Support provided",
      opp.terms AS "Terms and Conditions"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      WHERE
      opp.id = $1 AND opp.is_deleted = false
      GROUP BY 
      opp_image.url,
      org.name,
      opp.profile,
      opp.facilities,
      opp.support,
      opp.terms,
      opp.published_at
      ORDER BY
      opp.published_at DESC;
        `;

      const data = await client.query(query, [ctx.params.id]);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //View all ongoing and waiting opportunities
  async viewOngoing(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      os.status AS "Opportunity Status",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.months) AS "Duration",
      COALESCE(opp.start_on) AS "Start Date",
      COALESCE(opp.end_on) AS "End Date",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      LEFT JOIN ratings r ON r.id = rol.rating_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      LEFT JOIN opportunity_statuses_opportunity_links osol ON opp.id = osol.opportunity_id
      LEFT JOIN opportunity_statuses os ON os.id = osol.opportunity_status_id
      LEFT JOIN opportunity_statuses_user_links osul ON os.id = osul.opportunity_status_id
      LEFT JOIN up_users uu ON uu.id = osul.user_id
      WHERE
      uu.id = $1 AND os.status = 'ongoing' OR os.status = 'waiting' AND opp.is_deleted = false 
      GROUP BY
      org_logo.url,
      opp.months,
      os.status,
      opp.start_on,
      opp.end_on,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
      opp.published_at
      ORDER BY
      opp.published_at DESC;
      `;

      const data = await client.query(query, [ctx.params.id]);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //View all completed opportunities
  async viewCompleted(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      os.status AS "Opportunity Status",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.months) AS "Duration",
      COALESCE(opp.start_on) AS "Start Date",
      COALESCE(opp.end_on) AS "End Date",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      LEFT JOIN ratings r ON r.id = rol.rating_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      LEFT JOIN opportunity_statuses_opportunity_links osol ON opp.id = osol.opportunity_id
      LEFT JOIN opportunity_statuses os ON os.id = osol.opportunity_status_id
      LEFT JOIN opportunity_statuses_user_links osul ON os.id = osul.opportunity_status_id
      LEFT JOIN up_users uu ON uu.id = osul.user_id
      WHERE
      uu.id = $1 AND os.status = 'completed' AND opp.is_deleted = false
      GROUP BY
      org_logo.url,
      opp.months,
      os.status,
      opp.start_on,
      opp.end_on,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
      opp.published_at
      ORDER BY
      opp.published_at DESC;
      `;

      const data = await client.query(query, [ctx.params.id]);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //splashscreen
  //This will fetch all the new opportunities on splash screen (top 5)
  async findTopFive(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT 
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.months) AS "Duration",
      COALESCE(opp.start_on) AS "Start Date",
      COALESCE(opp.end_on) AS "End Date",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      LEFT JOIN ratings r ON r.id = rol.rating_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      WHERE
      opp.is_deleted = false
      GROUP BY 
      org_logo.url,
      opp.months,
      opp.start_on,
      opp.end_on,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
      opp.published_at
      ORDER BY
      opp.published_at DESC
      LIMIT
      5
    `;

      const data = await client.query(query);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //This will fetch all the ongoing and waiting opportunities on splash screen (top 5)
  async findTopFiveOngoing(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      os.status AS "Opportunity Status",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.months) AS "Duration",
      COALESCE(opp.start_on) AS "Start Date",
      COALESCE(opp.end_on) AS "End Date",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      LEFT JOIN ratings r ON r.id = rol.rating_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      LEFT JOIN opportunity_statuses_opportunity_links osol ON opp.id = osol.opportunity_id
      LEFT JOIN opportunity_statuses os ON os.id = osol.opportunity_status_id
      LEFT JOIN opportunity_statuses_user_links osul ON os.id = osul.opportunity_status_id
      LEFT JOIN up_users uu ON uu.id = osul.user_id
      WHERE
      uu.id = 1 AND os.status = 'ongoing' OR os.status = 'waiting' AND opp.is_deleted = false
      GROUP BY
      org_logo.url,
      opp.months,
      os.status,
      opp.start_on,
      opp.end_on,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
      opp.published_at
      ORDER BY
      opp.published_at DESC
      LIMIT
      5
    `;

      const data = await client.query(query);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //This will fetch all the completed opportunities on splash screen (top 5)
  async findTopFiveCompleted(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      os.status AS "Opportunity Status",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.months) AS "Duration",
      COALESCE(opp.start_on) AS "Start Date",
      COALESCE(opp.end_on) AS "End Date",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      LEFT JOIN ratings r ON r.id = rol.rating_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      LEFT JOIN opportunity_statuses_opportunity_links osol ON opp.id = osol.opportunity_id
      LEFT JOIN opportunity_statuses os ON os.id = osol.opportunity_status_id
      LEFT JOIN opportunity_statuses_user_links osul ON os.id = osul.opportunity_status_id
      LEFT JOIN up_users uu ON uu.id = osul.user_id
      WHERE
      uu.id = 1 AND os.status = 'completed' AND opp.is_deleted = false
      GROUP BY
      org_logo.url,
      opp.months,
      os.status,
      opp.start_on,
      opp.end_on,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
      opp.published_at
      ORDER BY
      opp.published_at DESC
      LIMIT
      5
    `;

      const data = await client.query(query);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },
  
  //deleting an opportunity
  async delete(ctx) {
    try {
      const client = await connect();
      const query = `
      DELETE from
        opportunities
      Where
        id = $1`;

      const data = await client.query(query, [ctx.params.id]);
      ctx.send({data:"Record deleted sucessfully"},200);
    } catch (error) {
      ctx.send(
        {
          message: "Error: opportunity not found",
        },
        404
      );
    }
  },
  async create_opportunitty(ctx) {
    try {
      await verifyToken(ctx, async () => {
      const { profile,openings, stipend_value, opportunity_type ,city, state, perks, skills, part_time, start, start_on, end_on, duration, months, responsibilities, currency, payment_type, assessment_questions, facilities, support, terms } = ctx.request.body.data;
        const organization_user_id = ctx.state.user.org_user.id
        console.log(typeof organization_user_id);
        ctx.request.body.data.organization_user = parseInt(organization_user_id);
        console.log(ctx.request.body.data);
        
          const response = await strapi.db.query('api::opportunity.opportunity').create({data:ctx.request.body.data});
          ctx.send({
            "opportunity":response
            },200);
          });
     } catch (error) {
      ctx.send({
        "error":"Internal server error"
        },500);
     }
    },

    async editopportunity(ctx) {
      try {
        const { data } = ctx.request.body;
        const id = ctx.params.id;
  
        const exists = await strapi
          .query("api::opportunity.opportunity")
          .findOne({
            where: {
              id: id,
            },
          });
  
        if (exists) {
          const update = await strapi
            .query("api::opportunity.opportunity")
            .update({
              where: {
                id: id,
              },
              data: {
                profile: data.hasOwnProperty("profile")
                  ? data.profile
                  : exists.profile,
                  skills: data.hasOwnProperty("skills")
                  ? data.skills
                  : exists.skills,
                opportunity_type: data.hasOwnProperty("opportunity_type") ? data.opportunity_type : exists.opportunity_type,
                city: data.hasOwnProperty("city")
                  ? data.city
                  : exists.city,
                  part_time: data.hasOwnProperty("part_time")
                  ? data.part_time
                  : exists.part_time,
                  openings: data.hasOwnProperty("openings")
                  ? data.openings
                  : exists.openings,
                  start: data.hasOwnProperty("start")
                  ? data.start
                  : exists.start,
                  start_on: data.hasOwnProperty("start_on")
                  ? data.start_on
                  : exists.start_on,
                  end_on: data.hasOwnProperty("end_on")
                  ? data.end_on
                  : exists.end_on,
                  responsibilities: data.hasOwnProperty("responsibilities")
                  ? data.responsibilities
                  : exists.responsibilities,
                  stipend_type: data.hasOwnProperty("stipend_type")
                  ? data.stipend_type
                  : exists.stipend_type,
                  payment_type: data.hasOwnProperty("payment_type")
                  ? data.payment_type
                  : exists.payment_type,
                  perks: data.hasOwnProperty("perks")
                  ? data.perks
                  : exists.perks,
                  ppo: data.hasOwnProperty("ppo")
                  ? data.ppo
                  : exists.ppo,
                  asssessment_questions: data.hasOwnProperty("asssessment_questions")
                  ? data.asssessment_questions
                  : exists.asssessment_questions,
                  facilities: data.hasOwnProperty("facilities")
                  ? data.facilities
                  : exists.facilities,
                  support: data.hasOwnProperty("support")
                  ? data.support
                  : exists.support,
                  terms: data.hasOwnProperty("terms")
                  ? data.terms
                  : exists.terms,
              },
            });
          ctx.send(
            {
              message: "opportunity updated sucessfully",
            },
            200
          );
        }
        if (!exists) {
          ctx.send(
            {
              message: "Error: opportunity not found",
            },
            404
          );
        }
      } catch (error) {
        console.log(error);
      }
  },
  
  async get_opportunity(ctx) {
    try {
      await verifyToken(ctx, async () => {
      const user = await strapi.db.query('api::organization-user.organization-user').findOne({
        where: { firstname: ctx.params.slug }
      });
      if (user){
      const client = await connect();
      if(ctx.params.slug === ctx.state.user.org_user.firstname){
        const query = 
            `SELECT
            ou.id AS "OrganizationUserID",
            ou.firstname AS "OrganizationUserName",
            ooul.opportunity_id AS "OpportunityID",
            o.profile AS "OpportunityProfile"
            FROM opportunities o
            LEFT JOIN opportunities_organization_user_links ooul ON o.id = ooul.opportunity_id
            LEFT JOIN organization_users ou ON ou.id = ooul.organization_user_id
            WHERE ou.firstname LIKE $1 `;
                                              
        const data1 = await client.query(query, [ctx.params.slug]);
        ctx.send({
          "data": data1.rows  
        });
      }else{
        return ctx.badRequest("opportunity is not registerd with organization-user", {"data":[]} )
      }
      }else{
        ctx.send({"error":"User not found"})
      }
   });
  
    } catch (error) {
      console.log(error);
    }
  },
  async find_organization_opportunity(ctx) {
    try {
      await verifyToken(ctx, async () => {
      const client = await connect();
      console.log(ctx.state.user.org_user.multi_tenant_organization.name);
      if(ctx.params.slug === ctx.state.user.org_user.multi_tenant_organization.name){
            const query = 
                `SELECT
                o.id,
                o.name,
                ou.id AS "organization user id",
                opp.id AS "opportunity_id",
                opp.profile,
                opp.skills,
                opp.openings,
                opp.stipend_value
                FROM
                organizations o
                LEFT JOIN organization_users_multi_tenant_organization_links mto ON o.id = mto.organization_id
                LEFT JOIN organization_users ou ON ou.id = mto.organization_user_id
                LEFT JOIN opportunities_organization_user_links ooul ON ou.id = ooul.organization_user_id
                LEFT JOIN opportunities opp ON opp.id = ooul.opportunity_id
                WHERE
                o.name LIKE $1 AND opp.id IS NOT NULL
                GROUP BY
                o.id,
                ou.id,
                opp.id,
                o.name,
                opp.profile,
                opp.skills,
                opp.openings,
                opp.stipend_value`;
          const data = await client.query(query, [ctx.params.slug]);
            ctx.send({  
              "data": data.rows
            });
          
    }else{
      return ctx.badRequest("opportunity is not created with user", {"data":data.rows} )
    }
    });
    
    } catch (error) {
      console.log(error);
    }
  },

  async get_organization_opportunity_for_organization_user(ctx) {
    try {
      await verifyToken(ctx, async () => {
        console.log(ctx.state.user.org_user.id,ctx.params.id);
      if(ctx.params.id==ctx.state.user.org_user.id){
              const client = await connect();
              const query = 
                    `SELECT
                    *
                  FROM opportunities opp
                  LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
                  LEFT JOIN organization_users_multi_tenant_organization_links mto ON ooul.organization_user_id = mto.organization_user_id
                  WHERE mto.organization_id = (
                    SELECT org.id
                    FROM organizations org
                    LEFT JOIN organization_users_multi_tenant_organization_links mto ON mto.organization_id = org.id
                    WHERE mto.organization_user_id = $1
                );`;
              const data = await client.query(query, [ctx.state.user.org_user.id]);
              console.log(data.rows);
              ctx.send({  
                  "data": data.rows
                  });
        }else{
          ctx.send(
            {data:"organization_user_id is not correct"},
            400)
        }
      
    });
    } catch (error) {
      console.log(error);
    }
  },
  async find_organizations_of_opportunity(ctx) {
    try {
      await verifyToken(ctx, async () => {
          const client = await connect();
          const query = 
              `SELECT
              o.id,
              o.name,
              ou.id AS "organization user id",
              opp.id AS "opportunity_id",
              opp.profile,
              opp.skills,
              opp.openings,
              opp.stipend_value
              FROM
              organizations o
              LEFT JOIN organization_users_multi_tenant_organization_links mto ON o.id = mto.organization_id
              LEFT JOIN organization_users ou ON ou.id = mto.organization_user_id
              LEFT JOIN opportunities_organization_user_links ooul ON ou.id = ooul.organization_user_id
              LEFT JOIN opportunities opp ON opp.id = ooul.opportunity_id
              WHERE
              o.name LIKE $1 AND opp.id IS NOT NULL
              GROUP BY
              o.id,
              ou.id,
              opp.id,
              o.name,
              opp.profile,
              opp.skills,
              opp.openings,
              opp.stipend_value`;
      const data = await client.query(query, [ctx.state.user.org_user.multi_tenant_organization.name]);
      if(data.rows.length>0){
        ctx.send({  
          "data": data.rows
        });
      } else {
        return ctx.badRequest('Data not found', { "Data" : []})
      }
    });
    
    } catch (error) {
      console.log(error);
    }
  },

  async find_all_opportunities(ctx) {
    try {
      const client = await connect();
      const query = 
          `SELECT * FROM opportunities
          ORDER BY id ASC 
          `;
      const data = await client.query(query);
      if(data.rows.length>0){
        ctx.send({  
          "data": data.rows
        });
      } else {
        return ctx.badRequest('Data not found', { "Data" : data.rows})
      }
    
    } catch (error) {
      console.log(error);
    }
  },
  //Here the user will be able to apply to opportunities
  // async applyOpportunity(ctx) {
  //   try {
  //     const client = await connect();
  //     const query = `
      
  //   `;

  //     const data = await client.query(query, [ctx.params.id]);

  //     ctx.send({
  //       data: data.rows,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};
