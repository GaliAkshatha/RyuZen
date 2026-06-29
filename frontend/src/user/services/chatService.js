import apiClient from "./apiClient";

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("user")
    );

}

/* -----------------------------
   Conversations
------------------------------ */

export async function getConversations() {

    const user = getCurrentUser();

    return await apiClient.get(
        `/conversations/${user.id}`
    );

}

export async function createConversation(
    receiverId
) {

    const user = getCurrentUser();

    return await apiClient.post(

        "/conversations",

        {

            senderId: user.id,

            receiverId,

        }

    );

}

/* -----------------------------
   Messages
------------------------------ */

export async function getMessages(
    conversationId
) {

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

/* -----------------------------
   Read Receipts
   (Future)
------------------------------ */

export async function markMessagesAsRead(
    conversationId
) {

    return await apiClient.patch(

        `/messages/${conversationId}/read`

    );

}

/* -----------------------------
   Typing Indicator
   (Socket later)
------------------------------ */

export async function sendTypingStatus(
    conversationId,

    isTyping
) {

    return await apiClient.post(

        `/messages/typing`,

        {

            conversationId,

            isTyping,

        }

    );

}