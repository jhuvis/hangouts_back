import joi from 'joi';

export default async function signUpMiddleware(req, res, next) {
    const userSchema = joi.object({
        name: joi.string().required(),
        password: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    });
    const validation = userSchema.validate(req.body, { abortEarly: true });
    if (validation.error) {
        return res.status(422).send('Digite os seus dados corretamente!');
    };
    next();
}
