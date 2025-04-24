// Type text with a typewriter effect
import {wait} from "./timing.js";

export async function runCommands(commands) {
    const terminalContent = document.getElementById('terminal-content');
    const cloudTerminal = document.getElementById('cloud-terminal')
    cloudTerminal.classList.add('active');
    terminalContent.innerHTML = '';
    commands = commands.trim().split(/\n\s*/)
    for (const command of commands) {
        if (command.startsWith('cd')
            || command.startsWith('./')
            || command.startsWith('chmod')
            || command.startsWith('sudo')
        ) {
            await addCommandLine(terminalContent, command);
            await wait(300);
        } else {
            await addResponseLine(terminalContent, command);
        }
    }
    await wait(300)
    cloudTerminal.classList.remove('active');
}

function typeText(element, text, speed = 30) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        element.classList.add('typing');

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
                resolve();
            }
        }

        type();
    });
}


// Add a command line to the terminal
function addCommandLine(terminalContent, command) {
    /*`
        <div class="command-line">
            <div class="prompt">
            >
            </div>
            <div class="command">

            </div>
        </div>
    `*/
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';

    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.textContent = '> ';

    const commandText = document.createElement('div');
    commandText.className = 'command';

    commandLine.appendChild(prompt);
    commandLine.appendChild(commandText);

    terminalContent.appendChild(commandLine);
    terminalContent.scrollTop = terminalContent.scrollHeight;

    return typeText(commandText, command);
}

// Add a response line to the terminal


function addResponseLine(terminalContent, response) {
    const responseLine = document.createElement('div');
    responseLine.textContent = response;

    terminalContent.appendChild(responseLine);
    terminalContent.scrollTop = terminalContent.scrollHeight;

    return wait(300);
}

