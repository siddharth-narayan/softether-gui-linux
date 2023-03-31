import { invoke } from "@tauri-apps/api/tauri";
import { Command } from '@tauri-apps/api/shell'

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
  // if (greetMsgEl && greetInputEl) {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   greetMsgEl.textContent = await invoke("greet", {
  //     name: greetInputEl.value,
  //   });
  // }

  const command = new Command("echo $PATH").execute()
  greetMsgEl.textContent = (await command).stdout;
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document
    .querySelector("#greet-button")
    ?.addEventListener("click", () => greet());
});
