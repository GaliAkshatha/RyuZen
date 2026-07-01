import User from "../../users/models/User.js";

import {

    USER_ROLE,

} from "../../users/constants/userConstants.js";

class LeaderboardService {

    async getAcademicLeaderboard(

        organizationId

    ) {

        const leaderboard =

            await User.find({

                organization: organizationId,

                role: USER_ROLE.STUDENT,

                isDeleted: false,

            })

            .select(

                "name academicPoints profile.avatar"

            )

            .sort({

                academicPoints: -1,

            })

            .lean();

        return {

            success: true,

            message:

                "Academic leaderboard fetched successfully.",

            leaderboard,

        };

    }

}

export default new LeaderboardService();