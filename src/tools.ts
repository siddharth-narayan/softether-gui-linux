import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs"

export async function readTextFileFromAppData(path: string): Promise<String> {
    return readTextFile(path, {dir: BaseDirectory.AppData})
}

export async function writeTextFileToAppData(path: string, contents: string){
    return writeTextFile(path, contents, {dir: BaseDirectory.AppData })
}

export function writeTerm(line: string){
    let terminalElement = document.getElementById('cmd')!
    let htmlLine = document.createElement("p")
    htmlLine.textContent = line
    //htmlLine.className = "mt-2 p-2 focus-visible:outline-none border-l-4 border-slate-800 text-sm bg-slate-800 text-slate-400 font-sans"
    terminalElement.appendChild(htmlLine)
    terminalElement.scrollTop = 10000000000
}

