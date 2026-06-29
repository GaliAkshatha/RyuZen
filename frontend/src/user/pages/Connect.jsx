import { useState } from "react";

import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";

function Connect() {

    const [

        selectedConversation,

        setSelectedConversation,

    ] = useState(null);

    return (

        <div
            className="
                h-[calc(100vh-120px)]
                grid
                grid-cols-12
                gap-6
            "
        >

            <ConversationList

                selectedConversation={
                    selectedConversation
                }

                onSelectConversation={
                    setSelectedConversation
                }

            />

            <ChatWindow

                selectedConversation={
                    selectedConversation
                }

            />

        </div>

    );

}

export default Connect;