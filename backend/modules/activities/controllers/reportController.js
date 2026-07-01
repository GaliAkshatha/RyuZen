import asyncHandler from "../../../shared/middleware/asyncHandler.js";

import activityService from "../services/activityService.js";

/**
 * Export submissions as CSV
 */
export const exportCSV = asyncHandler(

    async (

        req,

        res

    ) => {

        const csv =

            await activityService.exportCSV(

                req.params.id

            );

        res.header(

            "Content-Type",

            "text/csv"

        );

        res.attachment(

            "activity-report.csv"

        );

        return res.send(

            csv

        );

    }

);