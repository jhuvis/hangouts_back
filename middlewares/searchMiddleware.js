import joi from 'joi';

export default async function searchMid(req, res, next) {
    const userSchema = joi.object({
        lat: joi.number().required(),
        lng: joi.number().required(),
        radius: joi.number().required(),
        types: joi.string(),
    });
    const validation = userSchema.validate(req.query, { abortEarly: true });
    if (validation.error) {
        return res.status(422).send('Digite os seus dados corretamente!');
    }
    next();
}