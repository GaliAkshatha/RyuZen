import asyncHandler from "../../../shared/middleware/asyncHandler.js";

import ApiResponse from "../../../shared/utils/apiResponse.js";

import authService from "../services/authService.js";

export const register = asyncHandler(

    async (req, res) => {

        const user = await authService.register(req.body);

        return ApiResponse.success(

            res,

            "Registration successful. Awaiting approval.",

            user,

            201

        );

    }

);