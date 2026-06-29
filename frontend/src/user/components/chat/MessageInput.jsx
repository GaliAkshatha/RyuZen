import {

    useState,

} from "react";

import {

    sendMessage,

} from "../../../services/chatService";

function MessageInput({

    conversation,

    onMessageSent,

}) {

    const [

        text,

        setText,

    ] = useState("");

    async function handleSend() {

        if (!text.trim()) return;

        try {

            const data =

                await sendMessage({

                    conversationId:

                        conversation._id,

                    content: text,

                });

            onMessageSent(

                data.data

            );

            setText("");

        }

        catch (error) {

            console.log(error);

        }

    }

    return (

        <div

            className="

                border-t

                border-zinc-800

                p-4

                flex

                gap-3

            "

        >

            <input

                type="text"

                value={text}

                placeholder="Type a message..."

                onChange={(e) =>

                    setText(

                        e.target.value

                    )

                }

                onKeyDown={(e) => {

                    if (

                        e.key === "Enter"

                    ) {

                        handleSend();

                    }

                }}

                className="

                    flex-1

                    rounded-lg

                    bg-zinc-800

                    px-4

                    py-2

                    text-white

                    outline-none

                "

            />

            <button

                onClick={handleSend}

                className="

                    px-5

                    rounded-lg

                    bg-violet-600

                    hover:bg-violet-700

                    text-white

                    transition

                "

            >

                Send

            </button>

        </div>

    );

}

export default MessageInput;