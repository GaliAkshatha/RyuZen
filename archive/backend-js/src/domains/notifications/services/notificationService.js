import Notification from "../models/Notification.js";

class NotificationService {

    /**
     * Get notifications of logged in user
     */
    async getNotifications(

        userId

    ) {

        const notifications =

            await Notification.find({

                user: userId,

            })

            .sort({

                createdAt: -1,

            })

            .lean();

        return {

            success: true,

            message:

                "Notifications fetched successfully.",

            notifications,

        };

    }

}

export default new NotificationService();