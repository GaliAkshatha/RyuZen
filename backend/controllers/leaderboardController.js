import User from "../models/User.js";

export const getAcademicLeaderboard =
async (req, res) => {

    try {

        const leaderboard =
            await User.find({
                role:"user",
            })

            .select(
                "name academicPoints"
            )

            .sort({
                academicPoints: -1,
            });

        res.json({
            leaderboard,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};