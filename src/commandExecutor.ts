import { Command } from "@tauri-apps/api/shell"
import { setTimeout } from "timers/promises"

class CommandExecutor {
    isCurrentCommandCompleted: boolean = true
    commands: string[] = []

    async executeNextCommand(): Promise<string>{
        while (this.isCurrentCommandCompleted!){
            await setTimeout(500)
        }

        this.isCurrentCommandCompleted = false
        let command = new Command(this.commands[0])
        let output = (await command.execute()).stdout
        this.isCurrentCommandCompleted = true

        return output

    }

    addCommand(command: string) {
        this.commands.push(command)
    }
}