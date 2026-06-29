function MessageBubble({

    message,

}) {

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    const isOwnMessage =

        message.sender._id === user.id ||

        message.sender === user.id;

    return (

        <div

            className={`

                flex

                ${

                    isOwnMessage

                        ? "justify-end"

                        : "justify-start"

                }

            `}

        >

            <div

                className={`

                    max-w-[70%]

                    rounded-xl

                    px-4

                    py-2

                    text-white

                    ${

                        isOwnMessage

                            ? "bg-violet-600"

                            : "bg-zinc-800"

                    }

                `}

            >

                <p>

                    {message.content}

                </p>

                <p

                    className="

                        text-[10px]

                        text-right

                        mt-1

                        opacity-70

                    "

                >

                    {

                        new Date(

                            message.createdAt

                        ).toLocaleTimeString(

                            [],

                            {

                                hour: "2-digit",

                                minute: "2-digit",

                            }

                        )

                    }

                </p>

            </div>

        </div>

    );

}

export default MessageBubble;