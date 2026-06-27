import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";

function Connect() {

    return (

        <div
            className="
                h-[calc(100vh-120px)]
                grid
                grid-cols-12
                gap-6
            "
        >

            <ConversationList />

            <ChatWindow />

        </div>

    );

}

export default Connect;