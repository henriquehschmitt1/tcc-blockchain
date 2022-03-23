const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class Auth {
    static async register(req, res) {
        try {
            if (req.body.length < 2) {
                res.status(400).send('All input is required')
            }
            const { email, password } = req.body

            await Auth.exists(email)
            const encryptedPassword = await bcrypt.hash(password, 10)

            const user = await User.create({
                email: email.toLowerCase(),
                password: encryptedPassword,
            })

            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '12h',
                }
            )

            user.token = token
            res.status(201).json(user)
        } catch (err) {
            res.status(err.statusCode).send(err.message)
        }
    }

    static async login(req, res) {
        try {
            if (req.body.length < 2) {
                res.status(400).send('All input is required')
            }
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user) {
                res.status(400).send('Invalid Credentials')
            }

            const decryptedPassword = await bcrypt.compare(
                password,
                user.password
            )

            if (decryptedPassword) {
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: '12h',
                    }
                )

                user.token = token
                res.status(200).json(user)
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async exists(email) {
        const user = await User.findOne({ email })

        if (user) {
            throw {
                statusCode: 400,
                message: 'User already exists in DB',
            }
        }
    }
}

module.exports = Auth