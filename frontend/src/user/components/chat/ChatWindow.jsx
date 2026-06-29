import {

    useEffect,
    useState,

} from "react";

import {

    getMessages,

} from "../../../services/chatService";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({

    selectedConversation,

}) {

    const [

        messages,

        setMessages,

    ] = useState([]);

    const [

        loading,

        setLoading,

    ] = useState(false);

    useEffect(() => {

        if (!selectedConversation)
            return;

        loadMessages();

    }, [selectedConversation]);

    async function loadMessages() {

        try {

            setLoading(true);

            const data =

                await getMessages({

                    conversationId:
                        selectedConversation._id

                });

            setMessages(

                data.data || []

            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    }

    function handleMessageSent(

        newMessage

    ) {

        setMessages(

            (previous) => [

                ...previous,

                newMessage,

            ]

        );

    }

    if (!selectedConversation) {

        return (

            <div

                className="

                    col-span-8

                    flex

                    items-center

                    justify-center

                    text-gray-400

                    bg-zinc-900

                    rounded-xl

                "

            >

                Select a conversation
                to start chatting.

            </div>

        );

    }

    return (

        <div

            className="

                col-span-8

                bg-zinc-900

                rounded-xl

                flex

                flex-col

                overflow-hidden

            "

        >

            {/* Header */}

            <div

                className="

                    px-6

                    py-4

                    border-b

                    border-zinc-800

                "

            >

                <h2

                    className="

                        text-lg

                        font-semibold

                        text-white

                    "

                >

                    {

                        selectedConversation

                        .otherParticipant

                        ?.name

                    }

                </h2>

            </div>

            {/* Messages */}

            <div

                className="

                    flex-1

                    overflow-y-auto

                    p-4

                "

            >

                {

                    loading

                    ?

                    (

                        <div

                            className="

                                text-gray-400

                            "

                        >

                            Loading...

                        </div>

                    )

                    :

                    (

                        <MessageList

                            messages={messages}

                        />

                    )

                }

            </div>

            {/* Input */}

            <MessageInput

                conversation={

                    selectedConversation

                }

                onMessageSent={

                    handleMessageSent

                }

            />

        </div>

    );

}

export default ChatWindow;