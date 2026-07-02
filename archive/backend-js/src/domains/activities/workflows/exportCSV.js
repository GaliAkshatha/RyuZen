import { Parser } from "json2csv";

import ActivitySubmission

from "../models/ActivitySubmission.js";

export default async function exportCSV(

    activityId

){

    const submissions =

        await ActivitySubmission.find({

            activity:activityId,

            isDeleted:false,

        })

        .populate(

            "student",

            "name email"

        );

    const rows = submissions.map(

        submission=>({

            Name:

                submission.student?.name,

            Email:

                submission.student?.email,

            Status:

                submission.status,

            Score:

                submission.score,

            Submitted:

                submission.submittedAt,

        })

    );

    const parser =

        new Parser();

    return parser.parse(rows);

}