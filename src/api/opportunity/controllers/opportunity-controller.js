const { connect } = require("../../../../config/pg");

module.exports = {
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
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating",
	  opp.published_at
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
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
	  opp.published_at
	ORDER BY
	  opp.published_at DESC;
    `;

      const data = await client.query(query);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //fetching responsibilities and skills of an individual opportunities
  async findPost(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT 
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.responsibilities, '') AS "Responsibilities",
      COALESCE(opp.skills, '') AS "Skills"
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
      opp.id = 1 AND is_deleted = false
    GROUP BY 
        org_logo.url,
        org.name,
        opp.profile,
        opp_image.url,
        opp.responsibilities,
        opp.skills;
    `;

      const data = await client.query(query, [ctx.params.id]);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //displaying facilities, terms and support
  async findDetails(ctx) {
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
      JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      JOIN organizations org ON ool.organization_id = org.id
      JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      JOIN files_related_morphs frm_logo ON frm_logo.related_id = opp.id AND frm_logo.field = 'logo'
      JOIN files org_logo ON frm_logo.file_id = org_logo.id
      JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      JOIN files opp_image ON frm_image.file_id = opp_image.id
      WHERE
        opp.id = $1 AND is_deleted = false
      GROUP BY 
        opp_image.url,
        org.name,
        opp.profile,
        opp.facilities,
        opp.support,
	      opp.terms`;

      const data = await client.query(query, [ctx.params.id]);

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
      UPDATE
        opportunities
      SET
        is_deleted = true
      Where
        id = $1`;

      const data = await client.query(query, [ctx.params.id]);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //Find Ongoing tasks
  async findOngoing(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT 
      org_logo.url AS "Organization logo",
      org.name AS "Organization name",
      opp.profile AS "Opportunity profile",
      opp.city AS "City",
      opp_image.url AS "Opportunity image",
      opp.months AS "Duration",
      ROUND(AVG(r.value), 1) AS "Rating"
    FROM 
      opportunities opp
      JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      JOIN organizations org ON ool.organization_id = org.id
      JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      JOIN ratings r ON r.id = rol.rating_id
      JOIN files_related_morphs frm_logo ON frm_logo.related_id = opp.id AND frm_logo.field = 'logo'
      JOIN files org_logo ON frm_logo.file_id = org_logo.id
      JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      JOIN files opp_image ON frm_image.file_id = opp_image.id
    WHERE
      opp.is_deleted = false
    GROUP BY 
      org_logo.url,
      opp.months,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url;
    `;

      const data = await client.query(query, [ctx.params.id]);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
