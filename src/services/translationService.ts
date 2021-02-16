import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import logger from "../helpers/logger";

export const FUN_TRANSLATIONS_BASE_URL = "https://api.funtranslations.com";
export const TRANSLATE_IN_SHAKESPEAREAN_PATH = "/translate/shakespeare";

const ERROR_TRANSLATE_NOT_UNIQUE = "Error in translation. Translation is not unique or is null";

export const translateInShakespearean = async (text: string): Promise<string> => {
    if (text === null || text.length === 0) throw new Error("text must be a string with almost 1 character");

    try {
        const headers = {
            ...(process.env.FUN_TRANSLATION_KEY && {"X-Funtranslations-Api-Secret": process.env.FUN_TRANSLATION_KEY})
        }
        const timeout: number = parseInt(process.env.EXTERNAL_API_TIMEOUT, 10) || 0

        const options: AxiosRequestConfig = {headers, timeout};
        const bodyData = {text};
        const url = new URL(TRANSLATE_IN_SHAKESPEAREAN_PATH, FUN_TRANSLATIONS_BASE_URL).href;

        const response: AxiosResponse = await axios.post(url, bodyData, options);
        const data = response.data;
        if (data.success.total !== 1) throw new Error(ERROR_TRANSLATE_NOT_UNIQUE);

        return data.contents.translated;
    } catch (e) {
        logger.debug("Error in translateInShakespearean", e);
        if (e.message && e.message.includes("timeout of")) throw new Error("Translation service in timeout")
        if (e.message === ERROR_TRANSLATE_NOT_UNIQUE) throw e;
        if (e.response && e.response.status === 429) throw new Error("Maximus quota reached in translate service");
        throw new Error("Error translate in shakespearean");
    }
};

