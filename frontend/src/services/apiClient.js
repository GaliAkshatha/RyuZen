const API =
    import.meta.env.VITE_API_URL;

async function request(

    endpoint,

    options = {}

) {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const headers = {

        "Content-Type":
            "application/json",

        ...options.headers,

    };

    // Ready for JWT later
    if (user?.token) {

        headers.Authorization =
            `Bearer ${user.token}`;

    }

    const response =
        await fetch(

            `${API}${endpoint}`,

            {

                ...options,

                headers,

            }

        );

    const result =
        await response.json();

    if (!response.ok) {

        throw new Error(

            result.message ||
            "Something went wrong."

        );

    }

    return result;

}

const apiClient = {

    get(endpoint) {

        return request(

            endpoint,

            {

                method: "GET",

            }

        );

    },

    post(

        endpoint,

        body

    ) {

        return request(

            endpoint,

            {

                method: "POST",

                body:
                    JSON.stringify(body),

            }

        );

    },

    put(

        endpoint,

        body

    ) {

        return request(

            endpoint,

            {

                method: "PUT",

                body:
                    JSON.stringify(body),

            }

        );

    },

    patch(
        endpoint,
        body = {}
    ) {

        return request(

            endpoint,

            {

                method: "PATCH",

                body:
                    JSON.stringify(body),

            }

        );

    },

    delete(endpoint) {

        return request(

            endpoint,

            {

                method: "DELETE",

            }

        );

    },

};

export default apiClient;