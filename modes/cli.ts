import chalk from "chalk";
import {select, isCancel} from "@clack/prompts";


export async function runCLIMode(){
    while(true){
        const mode = await select ({
            message: "CLI Mode: Choose CLI sub-mode",
            options: [
                { value: "agent" , label: "Agent Mode" },
                { value: "plan" , label: "Plan Mode" },
                { value: "ask" , label: "Ask Mode" },
                { value: "back" , label: "Back to main menu" },
            ],
        });

        if(isCancel(mode) || mode === "back") return;

        if(mode === "agent"){
            console.log(chalk.dim("Agent mode..."));
        }
        if(mode === "plan"){
            console.log(chalk.dim("Plan mode..."));
        }
        if(mode === "ask"){
            console.log(chalk.dim("Ask mode..."));
        }

        if (mode !== "agent" && mode !== "plan" && mode !== "ask"){
            console.log(chalk.red("\n This mode is not implemented yet. \n"));

        }
    }
}
