/**
 * Applies a MongoDB transaction session to a query.
 *
 * @param {mongoose.Query} query
 * @param {mongoose.ClientSession | null} session
 *
 * @returns {mongoose.Query}
 */
export default function applySession(

    query,

    session = null

) {

    if (session) {

        query.session(session);

    }

    return query;

}