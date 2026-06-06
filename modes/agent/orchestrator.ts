import { isCancel, text } from "@clack/prompts";
import chalk from "chalk";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./tool-executor";
import { createAgentTools } from "./agent-tools";
import { getAgentModel } from "../../ai";
import { stepCountIs, ToolLoopAgent } from "ai";
import { renderTerminalMarkdown } from "../../tui/terminal-md";

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

    const agent = new ToolLoopAgent({
        model: getAgentModel(),
        stopWhen: stepCountIs(50),
        instructions: [
            `Workspace root: ${config.codebasePath}`,
            'All mutations are staged until approval.',
        ].join("\n"),
        tools,
    }); 

    const result = await agent.generate({
        prompt: goal.trim(),
        onStepFinish: ({ toolCalls }) => {
            for (const tc of toolCalls) {
                const preview = JSON.stringify(tc.input).slice(0, 160);
                console.log(
                    chalk.green('✓'),
                    chalk.bold(String(tc.toolName)),
                    chalk.dim(preview + (preview.length >= 160 ? "..." : "")),
                )
            }
        }
    });

    if(result.text?.trim())
        console.log(renderTerminalMarkdown(result.text));
}