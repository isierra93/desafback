import * as fs from 'fs';
import { validator } from './validator.js';
import { messagesSchema } from './Chat.entity.js';
import { normalize } from 'normalizr';


export class Chat extends validator {

    constructor(fileName) {
        super();
        this.pathFile = `./src/db/${fileName}.txt`;
    }

    /**
     * Async Method to get all products
     * @param {boolean} toSave Parameter to define response according to use
     * @returns Array of products or object
     */
    async getAll(toSave = false) {
        const issetFile = await this.issetFile(this.pathFile);
        if (!issetFile.error) {
            return issetFile.messages.length > 0 ? issetFile.messages : (toSave ? [] : {
                error: 1,
                message: "No messages stored"
            });
        } else {
            const response = {
                error: 1,
                message: `Directory ${this.pathFile} doesn't exits`
            }
            return response;
        }
    }

    async getNormalized() {
        const rawData = await this.getAll();
        const dataToNormalize = {
            id: "backendCoderHouse",
            messages: rawData
        };
        const normalizedData = normalize(dataToNormalize, messagesSchema);

        const rawLength = JSON.stringify(rawData).length;
        const normalizedLength = JSON.stringify(normalizedData).length;

        return {
            normalized: normalizedData,
            compression: Math.trunc((1 - rawLength / normalizedLength) * 100),
        };
    }


    /**
     * Async Method to save product
     * @param {object} object 
     * @returns object
     */
    async save(object) {
        const response = {
            error: 1,
            message: `Error almacenando el mensaje`
        }

        const issetFile = await this.issetFile(this.pathFile);

        if (issetFile.error) {
            await fs.promises.writeFile(this.pathFile, '[]');
        }

        let array = await this.getAll(true);

        object.id = array.length > 0 ? parseInt(array.at(-1).id + 1) : 1;

        array.push(object);

        try {
            await fs.promises.writeFile(this.pathFile, JSON.stringify(array, null, "\t"));
            response.error = 0,
                response.message = `The message has been saved with id: ${object.id}`;
        } catch (error) {
            throw new Error(error);
        }

        return response;
    }
}
