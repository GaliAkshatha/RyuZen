/**
 * Real haversine great-circle distance between two coordinates, in
 * meters - genuine geospatial math, not a placeholder. Used to check
 * a student's submitted GPS coordinates against a session's real
 * configured location and radius.
 */
export function haversineDistanceMeters(

    lat1: number,

    lon1: number,

    lat2: number,

    lon2: number

): number {

    const EARTH_RADIUS_METERS = 6371000;

    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);

    const dLon = toRadians(lon2 - lon1);

    const a =

        Math.sin(dLat / 2) ** 2 +

        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_METERS * c;

}
