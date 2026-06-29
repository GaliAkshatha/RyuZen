function ConversationCard({

    conversation,

    selectedConversation,

    onSelectConversation,

}) {

    const {

        otherParticipant,

        lastMessage,

        lastActivity,

        unreadCount,

    } = conversation;

    const isSelected =

        selectedConversation?._id === conversation._id;

    function formatTime(date) {

        if (!date) return "";

        return new Date(date).toLocaleTimeString(

            [],

            {

                hour: "2-digit",

                minute: "2-digit",

            }

        );

    }

    return (

        <div

            onClick={() =>

                onSelectConversation(

                    conversation

                )

            }

            className={`

                flex

                items-center

                justify-between

                gap-4

                px-4

                py-3

                cursor-pointer

                transition-all

                duration-200

                border-b

                border-zinc-800

                ${

                    isSelected

                        ? "bg-violet-600"

                        : "hover:bg-zinc-800"

                }

            `}

        >

            {/* Left */}

            <div

                className="

                    flex

                    items-center

                    gap-3

                    flex-1

                    overflow-hidden

                "

            >

                {/* Avatar */}

                <div

                    className="

                        h-12

                        w-12

                        rounded-full

                        bg-zinc-700

                        flex

                        items-center

                        justify-center

                        text-lg

                        font-bold

                        text-white

                        shrink-0

                    "

                >

                    {

                        otherParticipant?.name

                            ?.charAt(0)

                            ?.toUpperCase()

                    }

                </div>

                {/* Name + Message */}

                <div

                    className="

                        flex

                        flex-col

                        overflow-hidden

                    "

                >

                    <h3

                        className="

                            font-semibold

                            text-white

                            truncate

                        "

                    >

                        {

                            otherParticipant?.name ||

                            "Unknown User"

                        }

                    </h3>

                    <p

                        className="

                            text-sm

                            text-gray-400

                            truncate

                        "

                    >

                        {

                            lastMessage?.content ||

                            "Start a conversation"

                        }

                    </p>

                </div>

            </div>

            {/* Right */}

            <div

                className="

                    flex

                    flex-col

                    items-end

                    gap-2

                    shrink-0

                "

            >

                <span

                    className="

                        text-xs

                        text-gray-400

                    "

                >

                    {

                        formatTime(

                            lastActivity

                        )

                    }

                </span>

                {

                    unreadCount > 0 && (

                        <div

                            className="

                                h-5

                                min-w-5

                                px-1

                                rounded-full

                                bg-violet-500

                                text-white

                                text-xs

                                flex

                                items-center

                                justify-center

                            "

                        >

                            {unreadCount}

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default ConversationCard;