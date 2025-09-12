const pool = require("../database/db");

(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("DB connected, test result:", rows[0].result); // should print 2
    process.exit(0);
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
})();