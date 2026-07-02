/**
 * Applies pagination to a mongoose query.
 *
 * @param {Query} query
 * @param {number} page
 * @param {number} limit
 *
 * @returns {Query}
 */

export default function paginate(

    query,

    page = 1,

    limit = 10

) {

    const skip =

        (page - 1) * limit;

    return query

        .skip(skip)

        .limit(limit);

}