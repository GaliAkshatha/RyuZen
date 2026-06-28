import conversationService
from "../services/conversationService.js";

export async function createConversation(
    req,
    res
){

    try{

        const {

            senderId,

            receiverId,

        } = req.body;

        const conversation =

            await conversationService
            .createConversation(

                senderId,

                receiverId

            );

        res.status(201).json({

            success:true,

            message:
                "Conversation ready.",

            data:
                conversation,

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message,

        });

    }

}