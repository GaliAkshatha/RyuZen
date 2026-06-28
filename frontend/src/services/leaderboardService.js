import apiClient from "./apiClient";

export async function getleaderboard(params) {
    return apiClient.get(
        "/leaderboard/academic"
    );
}