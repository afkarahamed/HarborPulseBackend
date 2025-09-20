const {pool} = require("../database/db");
const xlsx = require("xlsx");


exports.getSpecies = async( req, res) =>{
    const [rows] = await pool.query(`
        SELECT * FROM fishSpecies;
    `);

    if(!rows.length){
        const err = new Error("No species found");
        err.status = 404;
        throw err;
    }

    res.json({
        success: true,
        data: rows
    });
}


exports.getPrices = async (req, res) => {
    const [rows] = await pool.query(`
        SELECT fs.name AS species_name, pl.price, pl.date AS updated_at
        FROM priceList pl
        JOIN fishSpecies fs
        ON pl.species_id = fs.species_id;
        `);

    if(!rows.length){
        const err = new Error("No prices found");
        err.status = 404;
        throw err;
    }

    const updated_at = rows[0].updated_at;
    const prices = rows.map(row => {
        return { species: row.species_name,
                 price: row.price
        }
    });

    res.json({
        success: true,
        date: updated_at,
        prices
    });
}


exports.getPriceBySpeciesId = async (req, res) => {
    const speciesId = req.params.speciesId;

    const [rows] = await pool.query(`
        SELECT fs.name AS species_name, pl.price, pl.date
        FROM priceList pl
        JOIN fishSpecies fs
        ON pl.species_id = fs.species_id
        WHERE pl.species_id = ?
        ORDER BY date DESC
        LIMIT 1;
        `, [speciesId]);

    if(!rows.length){
        const err = new Error("Species not found");
        err.status = 404;
        throw err;
    }

    res.json({
        success: true, 
        data: rows
    })
}


exports.uploadFishPrices = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

    const now = new Date();
    const inserted = [];

    for (const r of rows) {
      const commonName = r["Common Name"];
      const price = r["Price"];

      if (!commonName) continue;

      const [species] = await pool.query(
        `SELECT species_id FROM fishSpecies WHERE name = ?`,
        [commonName.trim()]
      );

      let speciesId;
      if (species.length === 0) {
        const [insert] = await pool.query(
          `INSERT INTO fishSpecies (name) VALUES (?)`,
          [commonName.trim()]
        );
        speciesId = insert.insertId;
      } else {
        speciesId = species[0].species_id;
      }

      await pool.query(
        `INSERT INTO priceList (species_id, date, price) VALUES (?, ?, ?)`,
        [speciesId, now, price]
      );

      inserted.push({ commonName, price });
    }

    res.json({
      success: true,
      message: "Fish prices uploaded successfully",
    });

  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ success: false, error: "Failed to upload fish prices" });
  }
};

exports.testExcelRead = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

    const data = rows.map(r => ({
      commonName: r["Common Name"] || null, 
      price: r["Price"] !== null ? r["Price"] : null 
    }));

    res.json({ success: true, data });

  } catch (err) {
    console.error("Excel parse error:", err);
    res.status(500).json({ success: false, error: "Failed to parse Excel" });
  }
};