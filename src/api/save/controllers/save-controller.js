const { connect } = require("../../../../config/pg");

module.exports = {
  //dashboard
  //This will unsave an opportunities
  async unsave(ctx) {
    try {
      const client = await connect();
      const query = `
      DELETE FROM saves s
      USING saves_opportunity_links sol, saves_user_links sul
      WHERE s.id = sol.save_id AND sul.save_id = s.id AND
      s.is_deleted = false AND s.id = $1;
    `;

      const data = await client.query(query,[ctx.params.id]);
      ctx.send("post unsaved");
    } catch (error) {
      console.log(error);
    }
  },

  //This will fetch all the saved opportunities of a user
  async saved(ctx) {
    try {
      const client = await connect();
      const query = `
      SELECT
      COALESCE(sul.user_id) AS "User",
      COALESCE(s.save) AS "Saved",
      COALESCE(sol.opportunity_id) AS Opportunity
      FROM 
      saves s
      LEFT JOIN saves_opportunity_links sol ON s.id = sol.save_id
      LEFT JOIN saves_user_links sul ON sul.save_id = s.id
      WHERE
      s.is_deleted = false AND sul.user_id = $1
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
