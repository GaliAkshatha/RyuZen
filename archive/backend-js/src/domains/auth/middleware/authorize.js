import {

    ForbiddenError,

} from "../../../shared/errors/index.js";

export default function authorize(

    ...allowedRoles

) {

    return (

        req,

        res,

        next

    ) => {

        if (!req.user) {

            throw new ForbiddenError(

                "Authentication required."

            );

        }

        if (

            !allowedRoles.includes(

                req.user.role

            )

        ) {

            throw new ForbiddenError(

                "You do not have permission to perform this action."

            );

        }

        next();

    };

}