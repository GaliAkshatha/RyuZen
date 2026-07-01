import paginate from "./paginate.js";

class QueryBuilder {

    async build({

        model,

        query,

        searchFields = [],

        populate = [],

        filters = {},

    }) {

        const {

            page = 1,

            limit = 10,

            search,

            sort = "-createdAt",

        } = query;

        const mongoQuery = {

            ...filters,

            isDeleted: false,

        };

        if (

            search &&

            searchFields.length

        ) {

            mongoQuery.$or =

                searchFields.map(

                    field => ({

                        [field]: {

                            $regex: search,

                            $options: "i",

                        },

                    })

                );

        }

        let dbQuery =

            model.find(mongoQuery);

        populate.forEach(field => {

            dbQuery.populate(field);

        });

        dbQuery.sort(sort);

        paginate(

            dbQuery,

            Number(page),

            Number(limit)

        );

        return await dbQuery;

    }

}

export default new QueryBuilder();