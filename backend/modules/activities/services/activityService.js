import createActivity from "../workflows/createActivity.js";
import updateActivity from "../workflows/updateActivity.js";
import publishActivity from "../workflows/publishActivity.js";
import closeActivity from "../workflows/closeActivity.js";
import deleteActivity from "../workflows/deleteActivity.js";
class ActivityService {

    async createActivity(

        activityData,

        user

    ) {

        return await createActivity(

            activityData,

            user

        );

    }

    async updateActivity(

        activityId,

        activityData,

        user

    ) {

        return await updateActivity(

            activityId,

            activityData,

            user

        );

    }

    async publishActivity(

        activityId,

        user

    ){

        return await publishActivity(

            activityId,

            user

        );

    }

    async closeActivity(

        activityId,

        user

    ){

        return await closeActivity(

            activityId,

            user

        );

    }

    async deleteActivity(

        activityId,

        user

    ){

        return await deleteActivity(

            activityId,

            user

        );

    }

}

export default new ActivityService();