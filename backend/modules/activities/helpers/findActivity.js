import Activity from "../models/Activity.js";

import {

    NotFoundError,

} from "../../../shared/errors";

export default async function findActivity(

    activityId,

    organizationId

) {

    const activity = await Activity.findOne({

        _id: activityId,

        organization: organizationId,

        isDeleted: false,

    });

    if (!activity) {

        throw new NotFoundError(

            "Activity not found."

        );

    }

    return activity;

}