const puppeteer = require('puppeteer');
require('dotenv').config();
const questionAnswerMap = require('./questionAnswerMap.js');

let isTypingSell = false;
let isTypingHuntFishCommands = false;
let isTypingClaimAll = false;
let isDoingQuiz = false;

(async () => {
    const browser = await puppeteer.launch(
        {
            headless: true
        }
    );
    const page = await browser.newPage();
    await page.goto('https://discord.com/login');
    await loginToDiscord(page);
    console.log(`Logged into discord.`);
    await openCorrectChannel(page);
    console.log(`Opened the correct server and channel.`);

    await runCommands(page);
})();

typeInChatWindow = async(page, message) => {
    const textboxes = await page.$$('div[role=textbox]'); // This has 2 textboxes = The search/filter one ontop and the main chat box.
    await textboxes[1].click();
    await textboxes[1].type(message);
    await textboxes[1].press('Enter');
};

runCommands = async (page) => {
    typeSellCommand(page);
    typeFishHuntCommands(page);
    typeClaimAllCommand(page);
    doQuiz(page);
};

doQuiz = async (page) => {
    while (isTypingSell || isTypingClaimAll || isTypingHuntFishCommands) {
        await page.waitFor(2000);
    }

    isDoingQuiz = true;
    await typeInChatWindow(page, ';q');
    await page.waitFor('#messages');
    await page.waitFor(3000); // Wait for quiz question to come in.

    let lastMessageId = await page.$$eval(
        '#messages > div',
        (messages) => {
            return messages.length-3; // Theres 2 divs in the #messages div that arent messages and it starts at 0 so need to do -3
        }
    );

    let question;
    try {
        question = await page.$eval(
            `div#messages-${lastMessageId} > div > div > div > div > div > div > strong`,
            (el) => {
                return el.innerText;
            }
        );
    } catch (ex) {
        // Just set a default question and answer it so the program doesnt crash when we called the ;q command too early or something
        question = 'A Blaze can be killed with snowballs.';
    }

    const answer = questionAnswerMap[question];

    if (answer == null || answer == undefined) {
        // choose answer a (the answers are in randomized order so its still a 50/50 if theres only 2 answers, might add support for randomizing 4 answers later
        console.log(`!!! Unknown question: ${question} !!!`);
        await typeInChatWindow(page, 'a');
    } else {
        // Find out which letter is linked to the answer.
        let answerDivs = await page.$$(`div#messages-${lastMessageId} > div > div > div > div > div > div`);

        let answerDiv;
        for (let i in answerDivs) {
            let className = await answerDivs[i].getProperty('className').then((cn) => cn.jsonValue());
            if (className.toString().indexOf('embedFieldValue-') !== -1) {
                answerDiv = answerDivs[i];
            }
        }

        if (answerDiv !== undefined) {
            let answers = await page.evaluate(element => element.textContent, answerDiv);
            let letterAnswer = 'a';
            let matches = answers.match(new RegExp(/(\[).(\])\ [a-zA-Z0-9].*/g));
            matches.forEach((possibleAnswer) => {
                let possibleAnswerLetter = possibleAnswer.substr(1, 1);
                let possibleAnswerWithoutLetter = possibleAnswer.replace(/(\[).(\])/g, '').trim();
                if (answer == possibleAnswerWithoutLetter) {
                    letterAnswer = possibleAnswerLetter;
                }
            });

            await typeInChatWindow(page, letterAnswer);
            console.log(`${getCurrentTime()} => Answered to quiz, will quiz again in 5 minutes`);
        } else {
            console.log(`${getCurrentTime()} => Failed to retrieve possible answers.`);
        }
    }

    isDoingQuiz = false;
    await page.waitFor(5.2 * 60 * 1000);
    await doQuiz(page);
};

getCurrentTime = () => {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
};

loginToDiscord = async (page) => {
    await page.waitFor('input[name=email]');
    await page.waitFor('input[name=password]');
    await page.click('input[name=email]');
    await page.type('input[name=email]', process.env.EMAIL);
    await page.click('input[name=password]');
    await page.type('input[name=password]', process.env.PASSWORD);
    await page.click('button[type=submit]');
    await page.waitForNavigation();
};

openCorrectChannel = async (page) => {
    await page.goto(process.env.CHANNELURL);
    await page.waitFor('div[role=textbox]');
};

typeClaimAllCommand = async (page) => {
    while (isTypingSell || isTypingHuntFishCommands || isDoingQuiz) {
        await page.waitFor(2000);
    }

    isTypingClaimAll = true;
    await typeInChatWindow(page, ';claimall');
    await typeInChatWindow(page, ';o a');

    console.log(`${getCurrentTime()} => Did ;claimall and ;o a => Running these commands again in 1 hour.`);
    isTypingClaimAll = false;
    await page.waitFor(60 * 60 * 1000);
    await typeClaimAllCommand(page);
};

typeFishHuntCommands = async (page) => {
    while (isTypingSell || isTypingClaimAll || isDoingQuiz) {
        await page.waitFor(2000);
    }

    isTypingHuntFishCommands = true;;
    await typeInChatWindow(page, ';f');
    await typeInChatWindow(page, ';h');

    isTypingHuntFishCommands = false;

    console.log(`${getCurrentTime()} => Did ;f and ;h => Running these commands again in ${5.2 * 60} seconds.`);
    await page.waitFor(5.2 * 60 * 1000);
    await typeFishHuntCommands(page);
};

typeSellCommand = async (page) => {
    while (isTypingHuntFishCommands || isTypingClaimAll || isDoingQuiz) {
        await page.waitFor(2000);
    }

    isTypingSell = true;
    await typeInChatWindow(page, ';s');

    isTypingSell = false;
    let timeout = Math.floor(Math.random() * 50000)+120000;

    console.log(`${getCurrentTime()} => Sold items; Selling again in ${timeout/1000} seconds.`);
    await page.waitFor(timeout);
    await typeSellCommand(page);
};