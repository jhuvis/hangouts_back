import joi from 'joi';

export default async function putCategoriesMid(req, res, next) {
    const userSchema = joi.object({
        value: joi.string().required(),
        label: joi.string().required(),
        placeId: joi.string().required(),
    });
    const validation = userSchema.validate(req.body, { abortEarly: true });
    if (validation.error) {
        return res.status(422).send('Digite os seus dados corretamente!');
    }
    next();
}