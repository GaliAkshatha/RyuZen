import {
    useEffect,
    useMemo,
    useState,
} from "react";

import ConversationCard from "./ConversationCard";

import {
    getConversations,
} from "../../services/chatService";

function ConversationList({

    selectedConversation,

    onSelectConversation,

}) {

    const [

        conversations,

        setConversations,

    ] = useState([]);

    const [

        loading,

        setLoading,

    ] = useState(true);

    const [

        search,

        setSearch,

    ] = useState("");

    useEffect(() => {

        loadConversations();

    }, []);

    async function loadConversations() {

        try {

            const data =
                await getConversations();

            setConversations(

                data.conversations || []

            );

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    const filteredConversations =

        useMemo(() => {

            return conversations.filter(

                (conversation) => {

                    const otherParticipant =

                        conversation.otherParticipant;

                    return otherParticipant?.name

                        ?.toLowerCase()

                        .includes(

                            search.toLowerCase()

                        );

                }

            );

        }, [

            conversations,

            search,

        ]);

    if (loading) {

        return (

            <div
                className="
                    col-span-4
                    flex
                    items-center
                    justify-center
                    text-gray-400
                "
            >

                Loading conversations...

            </div>

        );

    }

    return (

        <div
            className="
                col-span-4
                bg-zinc-900
                rounded-xl
                border
                border-zinc-800
                overflow-hidden
            "
        >

            <div className="p-4">

                <input

                    type="text"

                    placeholder="Search..."

                    value={search}

                    onChange={(e) =>

                        setSearch(
                            e.target.value
                        )

                    }

                    className="
                        w-full
                        px-3
                        py-2
                        rounded-lg
                        bg-zinc-800
                        text-white
                        outline-none
                    "

                />

            </div>

            <div
                className="
                    overflow-y-auto
                    h-[calc(100%-72px)]
                "
            >

                {

                    filteredConversations.map(

                        (conversation) => (

                            <ConversationCard

                                key={
                                    conversation._id
                                }

                                conversation={
                                    conversation
                                }

                                selectedConversation={
                                    selectedConversation
                                }

                                onSelectConversation={
                                    onSelectConversation
                                }

                            />

                        )

                    )

                }

            </div>

        </div>

    );

}

export default ConversationList;