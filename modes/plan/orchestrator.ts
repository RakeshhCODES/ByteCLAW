import chalk from "chalk";
import { confirm, isCancel, text } from "@clack/prompts";
import { ToolLoopAgent, stepCountIs } from "ai";
import { getAgentModel } from "../../ai";
import { ActionTracker } from "../agent/action-tracker";
import { ToolExecutor } from "../agent/tool-executor";
import { createAgentTools } from "../agent/agent-tools";
import { defaultAgentConfig } from "../agent/types";
import { runApprovalFlow } from "../agent/approval";
import { renderTerminalMarkdown } from "../../tui/terminal-md";
import { generatePlan } from "./planner";
import { printPlan, selectSteps } from "./selection";

export async function runPlanMode(): Promise<void> {
    console.log(
        chalk.bold("\n🧭 Plan Mode\n")
    );
    const goal = await text({
        message: "What is your goal?"
    })
    if (isCancel(goal) || !goal.trim())
        return;
    const plan = await generatePlan(goal);

    printPlan(plan)

    const selected = await selectSteps(plan);
    if (selected.length === 0)
        return;

    const proceed = await confirm({
        message: `Execute ${selected.length} step(s)`,
        initialValue: true
    });

    const config = defaultAgentConfig();
    const tracker = new ActionTracker();
    const executor = new ToolExecutor(tracker , config);

    const tools = {
        ...createAgentTools(executor)
    }
}