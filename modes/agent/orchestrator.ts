import { isCancel, text } from "@clack/prompts";
import chalk from "chalk";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./tool-executor";
import { createAgentTools } from "./agent-tools";
import { getAgentModel } from "../../ai";
import { stepCountIs, ToolLoopAgent } from "ai";

export async function runAgentMode() {
    console.log(chalk.cyan.bold("\n🤖 ByteClaw Agent Mode\n"));

    const goal = await text({
        message: "What's your mission?",
        placeholder: "e.g., Create a React app, analyze a repository, or generate documentation",
    });

    if (isCancel(goal) || !goal.trim()) return;

    const config = defaultAgentConfig();
    const tracker = new ActionTracker();
    const executor = new ToolExecutor(tracker, config);
    const tools = createAgentTools(executor);
}