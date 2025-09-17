module.exports = function (schemas) {
    return (req, res, next) => {
        if(schemas.params){
            const {error} = schemas.params.validate(req.params);
            if(error){
                const err = new Error(error.details[0].message);
                err.status = 400;
                throw err;
            }
        }

        if(schemas.body){
            const {error} = schemas.body.validate(req.body);
            if(error){
                const err = new Error(error.details[0].message);
                err.status = 400;
                throw err;
            }
        }

        next();
    }
}