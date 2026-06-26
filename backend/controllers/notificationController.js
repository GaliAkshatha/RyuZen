import Notification from "../models/Notification.js";

export const getNotifications =
async (req, res) => {

  try {

    const notifications =
      await Notification.find({

        user: req.params.userId,

      })
      .sort({
        createdAt: -1,
      });

      console.log(req.params.userId);
      console.log(notifications);

    res.json({
      notifications,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};