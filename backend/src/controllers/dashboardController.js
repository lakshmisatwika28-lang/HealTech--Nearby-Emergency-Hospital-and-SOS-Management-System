import { getDatabase } from "../config/database.js";

const dashboardController = {
  async summary(req,res) {
    try {
      const db = getDatabase();
      const result = {};
      for (const [key, table] of [
        ["emergencies","emergency_requests"],
        ["ambulances","ambulance_bookings"],
        ["contacts","emergency_contacts"]
      ]) {
        try {
          const [rows] = await db.query(`SELECT COUNT(*) AS count FROM ${table}`);
          result[key] = Number(rows[0].count);
        } catch { result[key] = 0; }
      }
      res.json({success:true,data:result});
    } catch(error) {
      res.status(500).json({success:false,message:error.message});
    }
  }
};
export default dashboardController;
