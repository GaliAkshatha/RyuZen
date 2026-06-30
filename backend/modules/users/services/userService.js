import User from "../models/User.js";

class UserService {

    /**
     * Create a new user.
     */
    async createUser(userData) {

        const user = await User.create(userData);

        return await User.findById(user._id)
            .populate(
                "organization",
                "name code"
            );

    }

    /**
     * Find user by email.
     */
    async getUserByEmail(email) {

        return await User.findOne({
            email,
        });

    }

    /**
     * Find user by ID.
     */
    async getUserById(userId) {

        return await User.findById(userId)
            .populate(
                "organization",
                "name code"
            );

    }

}

export default new UserService();