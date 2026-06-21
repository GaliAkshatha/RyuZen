import Activity from "../models/Activity.js";
import ActivitySubmission from "../models/ActivitySubmission.js";
import { Parser } from "json2csv";

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

    const activity =
        await Activity.findById(
            req.params.id
        );

    if (
        activity.status ===
        "closed"
    ) {

    return res.status(400).json({

        message:
        "Activity is closed",

    });

    }

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

export const downloadResponsesCSV =
async (req, res) => {

  try {

    const activity = await Activity.findById(
        req.params.id
    );

    const responses =
      await ActivitySubmission
        .find({
          activity:
            req.params.id,
        })
        .populate(
          "user",
          "name email"
        );

    const csvData =
      responses.map(
        (submission) => ({

          Name:
            submission.user?.name,

          Email:
            submission.user?.email,

          SubmittedAt:
            submission.createdAt,

          ...submission.answers,

        })
      );

    const parser =
      new Parser();

    const csv =
      parser.parse(csvData);

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment(
      `${activity.title}-responses.csv`
    );

    return res.send(csv);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

export const closeActivity =
async (req, res) => {

  try {

    const activity =
      await Activity.findByIdAndUpdate(

        req.params.id,

        {
          status: "closed",
        },

        {
          new: true,
        }
      );

    res.json({
      message:
        "Activity Closed",

      activity,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};