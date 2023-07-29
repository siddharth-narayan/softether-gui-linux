import { W } from "@tauri-apps/api/event-2a9960e7";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { Command } from "@tauri-apps/api/shell";

export async function readTextFileFromAppData(path: string): Promise<String> {
    return readTextFile(path, { dir: BaseDirectory.AppData })
}

export function getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
}

export async function writeTextFileToAppData(path: string, contents: string) {
    return writeTextFile(path, contents, { dir: BaseDirectory.AppData })
}

export function assert(condition: boolean, message: string) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

export async function execute(string: string, cwd?: string, hideOutput?: boolean): Promise<string> {
    if (hideOutput === undefined){
        hideOutput === false
    }

    if (!hideOutput) {
        writeTerm("$ " + string)
    }

    let command = new Command("sh", ["-c", string], { cwd: cwd });

    if (!hideOutput) {
        command.stdout.on("data", (line: string) => {
            writeTerm(line)
            //console.log(line)
        });
    }


    let output = (await command.execute()).stdout;
    
    console.log(output)
    return output
}

export function delay(ms: number): Promise<void>{
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function writeTerm(line: string) {
    let terminalElement = document.getElementById('cmd')!
    let htmlLine = document.createElement("p")
    htmlLine.textContent = line
    //htmlLine.className = "mt-2 p-2 focus-visible:outline-none border-l-4 border-slate-800 text-sm bg-slate-800 text-slate-400 font-sans"
    terminalElement.appendChild(htmlLine)
    terminalElement.scrollTop = 10000000000
}