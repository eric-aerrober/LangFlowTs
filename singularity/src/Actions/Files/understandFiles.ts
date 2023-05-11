import { ActionType } from "../../Managers/ActionContext";
import { ChatContext } from "../../Managers/ChatContext";
import { RecordAction, WithEmptyActionContext } from "../../Managers/Decorators";
import { listFiles } from "../../Managers/Files";
import { Action } from "../Action";
import summaryize from "../Basic/summaryize";
import {readFile} from "../../Managers/Files"

interface FileKnowledge {
    [path: string]: string 
}
const fileKnowledge: FileKnowledge = {};

export function updateFileKnowledge (path: string, summary: string) {
    fileKnowledge[path] = summary;
}

export function getFileKnowledge (path: string) {
    return fileKnowledge[path];
}

export async function getWorkspaceKnowledge () {
    const allFiles = await listFiles();
    let response = ""
    for (const file of allFiles) {
        const summary = getFileKnowledge(file);
        response += `---- \n ${file} \n ${summary} \n\n`;
    }
    return response + '----';
}

class UnderstandFiles extends Action {

    @RecordAction(ActionType.Files, 'Understanding File')
    public static async understandOne ({chat, file} : {chat: ChatContext, file: string}) {
        
        const fileData = readFile(file)
        const summary = await summaryize({
            chat, 
            data: fileData,
            context: "Data is from file: " + file
        });
        updateFileKnowledge(file, summary.summary);

        return {
            resultContext: chat,
            fileKnowledge: fileKnowledge
        }
    }

    @RecordAction(ActionType.Files, 'Understanding Files')
    public static async understandAll ({chat} : {chat: ChatContext}) {
        
        const allFiles = await listFiles();

        for (const file of allFiles) {
            await UnderstandFiles.understandOne({chat, file});
        }

        return {
            resultContext: chat,
            fileKnowledge: fileKnowledge
        }
    }
}

export default {
    understandAll: UnderstandFiles.understandAll,
    understandOne: UnderstandFiles.understandOne
}
