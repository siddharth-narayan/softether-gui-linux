import { invoke } from "@tauri-apps/api/tauri";
import { Command } from '@tauri-apps/api/shell'
import {  } from  '@tauri-apps/api/path'

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;
let command: Command

async function greet() {
  

}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  
  document
    .querySelector("#greet-button")
    ?.addEventListener("click", () => greet());
  
  command = new Command("sh")
  command.spawn()
  command.stdout.on('data', function(line){
    greetMsgEl.textContent = line
    console.log(line);
  })
});
