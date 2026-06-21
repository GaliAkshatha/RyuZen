import Activity from "../models/Activity.js";
import ActivitySubmission from "../models/ActivitySubmission.js";

export const createActivity = async(
    req,
    res
) => {
    try{

        const{
            title,
            description,
            type,

            points,
            penaltyPoints,

            startDate,
            endDate,

            formFields,

            venue,
            startTime,
            endTime,

            registrationDeadline,

            attendanceMethod,

            requirements,

            maxParticipants,

            instructions,

            submissionType,

            createdBy,
        } = req.body;

        if (
            !title ||
            !description
        ){
            return res.status(400).json({
                message:
                    "Please fill all required fields",
            });
        }

        if(
            type === "form" && 
            (!formFields || 
                formFields.length === 0)
            ){
                return res.status(400).json({
                    message:
                    "add at least one form field",
                });
            }
        
        const activity = await Activity.create({
            title,
            description,

            type,

            points,
            penaltyPoints,

            startDate,
            endDate,

            formFields,

            venue,
            startTime,
            endTime,

            registrationDeadline,

            attendanceMethod,

            requirements,

            maxParticipants,

            instructions,

            submissionType,

            createdBy,
        });


        res.status(201).json({
            message: "Activity created",
            activity,
        });

    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getActivities = async(
    req,
    res
) => {
    try{
        const activities = await Activity.find()
        .sort({ createdAt : -1});

        res.json(activities);
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getActivityById =
async (req, res) => {

  try {

    const activity =
      await Activity.findById(
        req.params.id
      ).populate(
        "createdBy",
        "name email role"
      );

    if (!activity) {

      return res.status(404).json({
        message:
          "Activity not found",
      });
    }
    const totalRegistrations =
      await ActivitySubmission
      .countDocuments({
        activity:
          req.params.id,
      });

    res.json({
      activity,
      totalRegistrations,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const submitActivity =
async (req, res) => {

  try {

    const {
      userId,
      answers,
    } = req.body;

    const existingSubmission =
      await ActivitySubmission.findOne({

        activity:
          req.params.id,

        user:
          userId,

      });

    if (existingSubmission) {

      return res.status(400).json({

        message:
          "You have already submitted this activity",

      });

    }

    const submission =
      await ActivitySubmission.create({

        activity:
          req.params.id,

        user:
          userId,

        answers,
      });

    res.status(201).json({
      message:
        "Submission Successful",

      submission,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

export const getActivityResponses =
async (req, res) => {

  try {

    const responses =
      await ActivitySubmission
        .find({
          activity:
            req.params.id,
        })
        .populate(
          "user",
          "name email role"
        );

    res.json({
      responses,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};