import Activity from "../models/Activity.js";

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
        } = req.body;

        if (
            !title ||
            !description ||
            formFields.length === 0
        ){
            return res.status(400).json({
                message:
                    "Please fill all required fields",
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