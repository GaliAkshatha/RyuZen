import Activity from "../models/Activity.js";

import {

    NotFoundError,

} from "../../../src/shared/errors.js";

import applySession from "../../../shared/database/applySession.js";

export default async function findActivity(

    activityId,

    organizationId,

    session = null

) {

    const activity = await applySession(

        Activity.findOne({

            _id: activityId,

            organization: organizationId,

            isDeleted: false,

        }),

        session

    );

    if (!activity) {

        throw new NotFoundError(

            "Activity not found."

        );

    }

    return activity;

}