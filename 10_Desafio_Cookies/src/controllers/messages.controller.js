import { Chat } from "../models/Chat.model.js";

const bd = new Chat('messages');


async function toSocketMessages(){
    return await bd.getNormalized();
}

async function insertMessage(message){
    await bd.save(message);
}


export {
    toSocketMessages,
    insertMessage
};