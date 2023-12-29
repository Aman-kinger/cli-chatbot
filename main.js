import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main(){
    console.log(colors.bold.green("Hello! What would you like to know?"))
    const chatContext = []
    while(true){
        const userInput = readlineSync.question(colors.yellow("You: "));

        try{
            //construct the messagses array by mapping over the chatContext array
            const messages = chatContext.map(([role, content]) => ({
                role,
                content
            }));
            messages.push({'role': 'user', 'content': userInput});

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages
            });

            const completionText = completion.choices[0].message.content;

            if(userInput.toLowerCase() === 'exit'){
                console.log(colors.green("Bot: ") + completionText);
                return;
            }

            console.log(colors.green("Bot: ") + completionText);

            //update the chatContext with the user input and the bot response
            chatContext.push(['user', userInput]);
            chatContext.push(['assistant', completionText]);
        }
        catch(err){
            console.log(colors.red("Error: ") + err.message);
        }
    }
}

main();