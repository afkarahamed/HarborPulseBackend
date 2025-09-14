const {pool} = require("../database/db");

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