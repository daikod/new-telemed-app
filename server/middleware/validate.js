const validate = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ 
                    message: 'Validation error', 
                    details: error.details.map(d => d.message) 
                });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'Validation middleware error' });
        }
    };
};

module.exports = validate; 