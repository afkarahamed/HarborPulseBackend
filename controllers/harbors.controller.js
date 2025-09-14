const {pool} = require("../database/db");

exports.getHarbors = async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM harbors");

    if (!rows.length) {
        const err = new Error("No harbors found");
        err.status = 404;
        throw err;
    }

    res.json({
        success: true, 
        data: rows
    });
}

exports.getHarborStatus = async( req, res) => {
    const harborId = req.params.id;
    const [rows] = await pool.query(`
        SELECT
            h.harbor_id,
            h.name AS harbor_name,
            s.name AS status,
            hs.updated_at
        FROM harborStatusHistory hs
        JOIN harbors h ON hs.harbor_id = h.harbor_id
        JOIN statusType s ON hs.status_id = s.status_id
        WHERE h.harbor_id = ?
        ORDER BY hs.updated_at DESC
        LIMIT 1;`
        , [harborId]);
    if(!rows.length){
        const err = new Error("Harbor not found)");
        err.status = 404;
        throw err;
    }

    res.json({
        success: true,
        data: rows
    });
}

exports.postHarborStatus = async(req, res) =>{
    const harborId = req.params.id;
    const harborStatusId = req.body.status;

    const [result] = await pool.query(`
        INSERT INTO harborStatusHistorY
            (harbor_id, status_id)
        VALUES
            (?,?);
        `, [harborId, harborStatusId]);


    const insertedId = result.insertId;

    if(!insertedId){
        const err = new Error("status_id is required");
        err.status = 400;
        throw err;
    }

    const [rows] = await pool.query(
        `SELECT 
            hs.id,
            h.name AS harbor_name,
            s.name AS status,
            hs.updated_at
        FROM harborStatusHistory hs
        JOIN harbors h ON hs.harbor_id = h.harbor_id
        JOIN statusType s ON hs.status_id = s.status_id
        WHERE hs.id = ?`,
        [insertedId]
    );
    if(!rows.length){
        const err = new Error("Insert Success Retrieval Failed");
        err.status = 500;
        throw err;
    }

    res.status(201).json({
        success: true,
        data: rows[0] 
    });
}