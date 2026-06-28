const API =
    import.meta.env.VITE_API_URL;

export async function getConversations() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const response =
        await fetch(

            `${API}/conversations/${user.id}`

        );

    return await response.json();

}

export async function createConversation(
    receiverId
) {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const response =
        await fetch(

            `${API}/conversations`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                },

                body: JSON.stringify({

                    senderId:
                        user.id,

                    receiverId,

                }),

            }

        );

    return await response.json();

}

export async function getMessages(
    conversationId
) {

    const response =
        await fetch(

            `${API}/messages/${conversationId}`

        );

    return await response.json();

}

export async function sendMessage(

    conversationId,

    text

) {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const response =
        await fetch(

            `${API}/messages`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                },

                body: JSON.stringify({

                    conversationId,

                    sender: user.id,

                    text,

                }),

            }

        );

    return await response.json();

}