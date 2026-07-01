import Activity from "../models/Activity.js";

import {

    NotFoundError,

} from "../../../shared/errors/index.js";

/**
 * Update an existing activity.
 *
 * @param {String} activityId
 * @param {Object} activityData
 * @param {Object} user
 *
 * @returns {Promise<Object>}
 */
export default async function updateActivity(

    activityId,

    activityData,

    user

) {

    const activity = await Activity.findOne({

        _id: activityId,

        organization: user.organization,

        isDeleted: false,

    });

    if (!activity) {

        throw new NotFoundError(

            "Activity not found."

        );

    }

    activity.title =

        activityData.title ??

        activity.title;

    activity.description =

        activityData.description ??

        activity.description;

    activity.config ={

        ...activity.config.toObject(),
        ...(activityData.config || {})

    }

    activity.rules =

        activityData.rules ??

        activity.rules;

    activity.updatedBy =

        user.id;

    await activity.save();

    return {

        success: true,

        message: "Activity updated successfully.",

        activity,

    };

}