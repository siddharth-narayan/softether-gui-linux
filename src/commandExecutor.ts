import { Command } from "@tauri-apps/api/shell";
import { setTimeout } from "timers/promises";
import { writeTerm } from "./tools";
import { commandExecutor } from "./main";

export class CommandExecutor {
  isCurrentCommandCompleted: boolean = true;
  commands: string[] = [];

  async executeNextCommand(): Promise<string> {
    while (this.isCurrentCommandCompleted! || this.commands.length == 0) {
      await setTimeout(500);
    }

    this.isCurrentCommandCompleted = false;
    let command = new Command(this.commands[0]);

    command.stdout.on("data", (line) => {
      writeTerm(line);
    });

    let output = (await command.execute()).stdout;
    this.isCurrentCommandCompleted = true;

    return output;
  }

  addCommand(command: string) {
    this.commands.push(command);
  }

  addCommands(commands: string[]) {
    this.commands.concat(commands);
  }
}

export async function commandLoop() {
  while (true) {
    await commandExecutor.executeNextCommand();
  }
}

export function execute(string: string) {
  commandExecutor.addCommand(string);
}

export function executeMultiple(commands: string[]) {
  commandExecutor.addCommands(commands);
}
