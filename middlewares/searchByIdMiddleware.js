import joi from 'joi';

export default async function searchByIdMid(req, res, next) {
    const userSchema = joi.object({
        placeId: joi.string().required()
    });
    const validation = userSchema.validate(req.params, { abortEarly: true });
    if (validation.error) {
        return res.status(422).send('Digite os seus dados corretamente!');
    }
    next();
}