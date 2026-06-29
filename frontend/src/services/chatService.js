import apiClient from "./apiClient";

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("user")
    );

}

export async function getConversations() {

    const user = getCurrentUser();

    return await apiClient.get(

        `/conversations/${user.id}`

    );

}

export async function createConversation({

    receiverId,

}) {

    const user = getCurrentUser();

    return await apiClient.post(

        "/conversations",

        {

            senderId: user.id,

            receiverId,

        }

    );

}

export async function getMessages({

    conversationId,

}) {

    return await apiClient.get(

        `/messages/${conversationId}`

    );

}

export async function sendMessage({

    conversationId,

    content,

    messageType = "text",

}) {

    const user = getCurrentUser();

    return await apiClient.post(

        "/messages",

        {

            conversationId,

            senderId: user.id,

            content,

            messageType,

        }

    );

}