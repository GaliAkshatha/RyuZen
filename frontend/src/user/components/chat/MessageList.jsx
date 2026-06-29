import MessageBubble from "./MessageBubble";

function MessageList({

    messages,

}) {

    if (messages.length === 0) {

        return (

            <div
                className="
                    h-full
                    flex
                    items-center
                    justify-center
                    text-gray-400
                "
            >

                Start your conversation 👋

            </div>

        );

    }

    return (

        <div
            className="
                flex
                flex-col
                gap-3
            "
        >

            {

                messages.map(

                    (message) => (

                        <MessageBubble

                            key={message._id}

                            message={message}

                        />

                    )

                )

            }

        </div>

    );

}

export default MessageList;