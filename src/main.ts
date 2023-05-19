import { CommandExecutor, commandLoop } from './commandExecutor';
import { Account } from './account';
import { startup } from './startup';

export let commandExecutor: CommandExecutor = new CommandExecutor()
export let accounts: Account[] = []

export async function startCon(){

}

window.addEventListener("DOMContentLoaded",  async () => {
  startup()
  commandLoop()
});