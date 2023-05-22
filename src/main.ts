import { Account } from './account';
import { startup } from './startup';
import { writeTerm } from './tools';
import { Command } from "@tauri-apps/api/shell"
export let accounts: Account[] = []

export async function startCon(){

}

export async function execute(string: string, cwd?: string): Promise<string> {
  console.log("-c " + string)
  //"-c", { "validator": "\\S*" }
  //, "-c " + string, {cwd: cwd}
  let command = new Command("sh", "-c " + string, {cwd: cwd});
    
  command.stdout.on("data", (line: string) => {
    writeTerm(line);
  });
  console.log("sh" + " -c " + string)
  let output = (await command.execute()).stdout;
  console.log("awegawegwae")
  return output;
}

window.addEventListener("DOMContentLoaded",  async () => {
  startup()
});