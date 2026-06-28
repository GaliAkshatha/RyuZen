import apiClient from "./apiClient";

export async function getNotifications(userId) {
    return apiClient.get(
        `/notifications/${userId}`
    );
}