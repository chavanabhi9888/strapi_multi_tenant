const client = require("../../../../config/pg");

module.exports = {
  //fetching all the posts
  async find(ctx) {
    try {
      const query = `
      SELECT 
      org_logo.url AS "Organization logo",
      org.name AS "Organization name",
      opp.profile AS "Opportunity profile",
      opp.city AS "City",
      opp_image.url AS "Opportunity image",
      opp.months AS "Duration",
      org.website_link AS "Website",
      ROUND(AVG(r.value), 1) AS "Rating"
    FROM 
      oppurtunities opp
      JOIN oppurtunities_organization_links ool ON opp.id = ool.oppurtunity_id
      JOIN organizations org ON ool.organization_id = org.id
      JOIN oppurtunities_organization_user_links ooul ON opp.id = ooul.oppurtunity_id
      JOIN ratings_oppurtunity_links rol ON rol.oppurtunity_id = opp.id
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
      org.website_link,
      opp_image.url;
    `;

      const data = await client.query(query);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //fetching responsibilities and skills
  async findPost(ctx) {
    try {
      const query = `
      SELECT 
        org_logo.url AS "Organization logo",
        org.name AS "Organization name",
        opp.profile AS "Oppurtunity name",
        opp_image.url AS "Opportunity image",
        opp.responsibilities AS "Responsibilities",
        opp.skills AS "Skills"
      FROM 
        oppurtunities opp
      JOIN oppurtunities_organization_links ool ON opp.id = ool.oppurtunity_id
      JOIN organizations org ON ool.organization_id = org.id
      JOIN oppurtunities_organization_user_links ooul ON opp.id = ooul.oppurtunity_id
      JOIN files_related_morphs frm_logo ON frm_logo.related_id = opp.id AND frm_logo.field = 'logo'
      JOIN files org_logo ON frm_logo.file_id = org_logo.id
      JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      JOIN files opp_image ON frm_image.file_id = opp_image.id
      WHERE
        opp.id = $1 AND is_deleted = false
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
  async applyPost(ctx) {
    try {
      const query = `
      SELECT
	      opp_image.url AS "Opportunity image",
	      org.name AS "Organization name",
        opp.profile AS "Opportunity profile",
        opp.facilities AS "Facilities provided",
        opp.support AS "Support provided",
        opp.terms AS "Terms and Conditions"
      FROM 
        oppurtunities opp
      JOIN oppurtunities_organization_links ool ON opp.id = ool.oppurtunity_id
      JOIN organizations org ON ool.organization_id = org.id
      JOIN oppurtunities_organization_user_links ooul ON opp.id = ooul.oppurtunity_id
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
      const query = `
      UPDATE
        oppurtunities
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
  async delete(ctx) {
    try {
      const query = `SELECT 
      org_logo.url AS "Organization logo",
      org.name AS "Organization name",
      opp.profile AS "Opportunity profile",
      opp.city AS "City",
      opp_image.url AS "Opportunity image",
      opp.months AS "Duration",
      org.website_link AS "Website",
      ROUND(AVG(r.value), 1) AS "Rating"
    FROM 
      oppurtunities opp
      JOIN oppurtunities_organization_links ool ON opp.id = ool.oppurtunity_id
      JOIN organizations org ON ool.organization_id = org.id
      JOIN oppurtunities_organization_user_links ooul ON opp.id = ooul.oppurtunity_id
      JOIN ratings_oppurtunity_links rol ON rol.oppurtunity_id = opp.id
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
      org.website_link,
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
