import apiClient from "./apiClient";

export async function createActivity(activity) {

    return apiClient.post(
        "/activities",
        activity
    );

}

export async function updateActivity(
    activityId,
    activity
) {

    return apiClient.put(
        `/activities/${activityId}`,
        activity
    );

}

export async function getActivities() {
    return apiClient.get(
        "/activities"
    );
}

export async function getActivity(activityId) {
    return apiClient.get(
        `/activities/${activityId}`
    );
}

export async function submitActivity(
    activityId,
    submission
) {
    return apiClient.post(
        `/activities/${activityId}/submit`,
        submission
    );
}

export async function getUserSubmissions(userId) {

    return apiClient.get(
        `/activities/user/${userId}`
    );

}

export async function getResponses(activityId) {
    return apiClient.get(
        `/activities/${activityId}/responses`
    );
}

export async function approveSubmission(
    submissionId
) {

    return apiClient.patch(
        `/activities/responses/${submissionId}/approve`
    );

}

export async function rejectSubmission(
    submissionId
) {

    return apiClient.patch(
        `/activities/responses/${submissionId}/reject`
    );

}

export async function getCSV(activityId) {
    return apiClient.get(
        `/activities/${activityId}/export-csv`
    );
}

export async function getClose(activityId) {
    return apiClient.patch(
        `/activities/${activityId}/close`
    );
}