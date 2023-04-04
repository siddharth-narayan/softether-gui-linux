//import { invoke } from "@tauri-apps/api/tauri";
import { Child, Command } from '@tauri-apps/api/shell'
import { BaseDirectory, exists, readTextFile, writeTextFile } from  '@tauri-apps/api/fs'
import { appDataDir } from "@tauri-apps/api/path";

let sh: Child;
let terminalElement: HTMLElement;

const command = new Command("sh")

async function readTextFileFromAppData(path: string): Promise<String> {
  return readTextFile(path, {dir: BaseDirectory.AppData})
}

function shwrite(line: string){
  sh.write(line + "\n")
  console.log("Wrote to shell: " + line)
}

function writeLineToTerminal(line: string){
  let htmlLine = document.createElement("nu-block")
  htmlLine.append(document.createTextNode(line))
  terminalElement.appendChild(htmlLine)
}

window.addEventListener("DOMContentLoaded", async () => {

  terminalElement = document.getElementById('cmd')!
  sh = await command.spawn()
  command.stdout.on('data', function(line){
    writeLineToTerminal(line)
  })
  
  shwrite("ls")

  if(!await exists("logins.json", { dir: BaseDirectory.AppData })){
    shwrite("cp assets/blank.json " + await appDataDir() + "config.json")
  }

  
});