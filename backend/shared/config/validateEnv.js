const REQUIRED_ENV = [

    "PORT",

    "MONGO_URI",

    "JWT_SECRET",

    "NODE_ENV",

];

const ALLOWED_NODE_ENV = [

    "development",

    "production",

    "test",

];

export default function validateEnv() {

    const missing =

        REQUIRED_ENV.filter(

            key => !process.env[key]

        );

    if (missing.length > 0) {

        console.error(

            "\n Missing Environment Variables\n"

        );

        missing.forEach(

            key =>

                console.error(

                    `• ${key}`

                )

        );

        process.exit(1);

    }

    const port =

        Number(process.env.PORT);

    if (Number.isNaN(port)) {

        console.error(

            "\n PORT must be numeric."

        );

        process.exit(1);

    }

    if (

        !ALLOWED_NODE_ENV.includes(

            process.env.NODE_ENV

        )

    ) {

        console.error(

            "\n Invalid NODE_ENV."

        );

        process.exit(1);

    }

}