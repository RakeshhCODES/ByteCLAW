import type { Telegraf } from "telegraf";
import { isOwner } from "./auth";
import { WELCOME } from "./constants";
import { Command } from "commander";
import { commandArg } from "./text";

export function registerHandlers(bots: Telegraf) {
    bots.command("start", async (ctx) => {
        if (!isOwner(ctx.chat.id))
            return;
        await ctx.reply(WELCOME, { parse_mode: "Markdown" })
    });

    bots.command("ask", async (ctx) => {
        if (!isOwner(ctx.chat.id))
            return;
        const q = commandArg(ctx.message.text, 'ask');
        if (!q)
            return ctx.reply('Usage: `/ask <your question>`', {
                parse_mode: "Markdown"
            });
    });
}