import chai from 'chai';
import chaiAsPromised from "chai-as-promised";
import {FUN_TRANSLATIONS_BASE_URL, TRANSLATE_IN_SHAKESPEAREAN_PATH, translateInShakespearean} from "../services/translationService";
import nock from "nock";
import {translateErrorTotalResponse, translateSuccessResponse} from "./translationsServiceResponse";

chai.use(chaiAsPromised);
chai.should();

describe('Shakespearean Translation Service', () => {

    afterEach(() => {
        nock.cleanAll();
    })

    it('should throw an error if send null or string lower than 5 characters', () => {
        Promise.all([
            translateInShakespearean(null).should.be.rejectedWith(Error, "text must be a string with almost 1 character"),
            translateInShakespearean("").should.be.rejectedWith(Error, "text must be a string with almost 1 character"),
            translateInShakespearean("Foo").should.be.rejectedWith(Error, "text must be a string with almost 1 character"),
        ]);
    });

    it('should return translate when invoked with a non null string', async () => {
        if (!nock.isActive()) nock.activate();
        nock(FUN_TRANSLATIONS_BASE_URL)
            .post(TRANSLATE_IN_SHAKESPEAREAN_PATH, {text: /.*/})
            .reply(200, translateSuccessResponse);


        const text = "Hi, my friend. How are you?"
        const translation = await translateInShakespearean(text);
        translation.should.be.to.equal(translateSuccessResponse.contents.translated);
        nock.isDone().should.be.true;
        nock.restore();
    });

    it('should return Error in translation if total!==1', async () => {
        if (!nock.isActive()) nock.activate();

        nock(FUN_TRANSLATIONS_BASE_URL)
            .post(TRANSLATE_IN_SHAKESPEAREAN_PATH, {text: /.*/})
            .reply(200, translateErrorTotalResponse);

        const text = "Hi, my friend. How are you?"
        await translateInShakespearean(text).should.be.rejectedWith(Error, "Error in translation. Translation is not unique or is null");
        nock.isDone().should.be.true;
        nock.restore();
    });

    it('should return "Error Quota reached" if is out of quota', async () => {
        if (!nock.isActive()) nock.activate();

        nock(FUN_TRANSLATIONS_BASE_URL)
            .post(TRANSLATE_IN_SHAKESPEAREAN_PATH, {text: /.*/})
            .reply(429, {});

        const text = "Hi, my friend. How are you?"
        await translateInShakespearean(text).should.be.rejectedWith(Error, "Maximus quota reached in translate service");
        nock.isDone().should.be.true;
        nock.restore();
    });

    it('should return generic in translate if the api is in Error', async () => {
        if (!nock.isActive()) nock.activate();

        nock(FUN_TRANSLATIONS_BASE_URL)
            .post(TRANSLATE_IN_SHAKESPEAREAN_PATH, {text: /.*/})
            .reply(500, {});

        const text = "Hi, my friend. How are you?"
        await translateInShakespearean(text).should.be.rejectedWith(Error, "Error translate in shakespearean");
        nock.isDone().should.be.true;
        nock.restore();
    });

    describe('Timeout', () => {
        let env;
        before(() => env = process.env);

        it('should throw error if external call has timeout', async () => {
            const timeout = 200;
            process.env.EXTERNAL_API_TIMEOUT = timeout.toString();

            if (!nock.isActive()) nock.activate();
            nock(FUN_TRANSLATIONS_BASE_URL)
                .post(TRANSLATE_IN_SHAKESPEAREAN_PATH, {text: /.*/})
                .delay(timeout + 10)
                .reply(200, translateSuccessResponse);

            const text = "Hi, my friend. How are you?"
            await translateInShakespearean(text).should.be.rejectedWith(Error, "Translation service in timeout");
            nock.isDone().should.be.true;
            nock.restore();
        });

        after(() => process.env = env);
    });


    describe('Api Key', () => {
        let env;
        before(() => env = process.env);

        it('should call external translation service with header if FUN_TRANSLATION_KEY environment is set', async () => {
            const apiHeader = 'TestAPIHeader';
            process.env.FUN_TRANSLATION_KEY = apiHeader
            if (!nock.isActive()) nock.activate();
            nock(FUN_TRANSLATIONS_BASE_URL, {
                reqheaders: {
                    'X-Funtranslations-Api-Secret': apiHeader,
                },
            })
                .post(TRANSLATE_IN_SHAKESPEAREAN_PATH, {text: /.*/})
                .reply(200, translateSuccessResponse);

            const text = "Hi, my friend. How are you?"
            await translateInShakespearean(text);
            nock.isDone().should.be.true;
            nock.restore();
        });

        after(() => process.env = env);
    })


})
