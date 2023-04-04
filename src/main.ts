//import { invoke } from "@tauri-apps/api/tauri";
import { Child, Command } from '@tauri-apps/api/shell'
import * as fs from 'fs'
import { BaseDirectory, exists, writeTextFile } from  '@tauri-apps/api/fs'
import { appDataDir } from "@tauri-apps/api/path";

let process: Child;
let appDataDirPath: String;

const command = new Command("sh")

window.addEventListener("DOMContentLoaded", async () => {

  process = await command.spawn()
  command.stdout.on('data', function(line){
    console.log(line);
  })

  appDataDirPath = await appDataDir()
  console.log(appDataDirPath)
  
  if(!await exists("logins.json", { dir: BaseDirectory.AppData })){
    writeTextFile('logins.json', fs.readFileAsync('/assets/blank.json'), {dir: BaseDirectory.AppData})
  }
});