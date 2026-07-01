export const login = asyncHandler(

    async (

        req,

        res

    ) => {

        const data =

            await authService.login(

                req.body

            );

        return ApiResponse.success(

            res,

            "Login successful.",

            data

        );

    }

);