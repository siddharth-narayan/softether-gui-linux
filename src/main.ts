import { invoke } from "@tauri-apps/api/tauri";
import { Child, Command } from '@tauri-apps/api/shell'
import {  } from  '@tauri-apps/api/path'
import { BaseDirectory } from "@tauri-apps/api/path";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;
let process: Child

const command = new Command("sh")

async function greet() {
  process.write(greetInputEl.value + "\n")
}

window.addEventListener("DOMContentLoaded", async () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  
  document
    .querySelector("#greet-button")
    ?.addEventListener("click", () => greet());
  
  
  process = await command.spawn()
  command.stdout.on('data', function(line){
    greetMsgEl.textContent = line
    console.log(line);
  })
});