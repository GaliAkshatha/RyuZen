import { z } from "zod";

import { ChatType } from "../../domain/constants/ChatType.js";

export const CreateChatSchema = z.object({

    participantIds: z.array(

        z.string().trim().min(1)

    )

        .min(1, "At least one participant is required."),

    type: z.enum([

        ChatType.DIRECT,

        ChatType.GROUP

    ])

        .optional()

});
