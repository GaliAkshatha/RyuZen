import Activity from "../models/Activity.js";

import {

    ACTIVITY_STATUS,

} from "../constants/activityConstants.js";

/**
 * Create a new activity.
 *
 * @param {Object} activityData
 * @param {Object} user
 * @returns {Promise<Object>}
 */
export default async function createActivity(

    activityData,

    user

) {

    const activity = await Activity.create({

        organization: user.organization,

        title: activityData.title,

        description: activityData.description,

        type: activityData.type,

        status: ACTIVITY_STATUS.DRAFT,

        config: activityData.config || {},

        rules: activityData.rules || {},

        statistics: {

            registrations: 0,

            submissions: 0,

            completed: 0,

        },

        createdBy: user.id,

    });

    return {

        success: true,

        message: "Activity created successfully.",

        activity,

    };

}