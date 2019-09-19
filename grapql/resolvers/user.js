// TODO: async all


const bcrypt = require('bcryptjs')

const User = require('../../models/user')

module.exports = {
    createUser: async (args) => {
        try {
            const userFinder = await User.findOne({
                email: args.userInput.email
            })
            if (userFinder) {
                throw new Error('User exits already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save()
            return {
                ...result._doc,
                password: null,
                _id: result.id
            }
        } catch (err) {
            throw err
        }


    }
}