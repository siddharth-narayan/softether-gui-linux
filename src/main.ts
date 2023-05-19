import { Child, Command } from '@tauri-apps/api/shell'
import { BaseDirectory, exists, readTextFile, writeTextFile } from  '@tauri-apps/api/fs'
import { appDataDir } from "@tauri-apps/api/path";
import { Arch, arch, Platform, platform } from '@tauri-apps/api/os'
import { invoke } from '@tauri-apps/api/tauri'
import { stat } from 'fs';

let sh: Child;
let accountCreateEl: HTMLElement
let startButtonEl: HTMLElement

export let appDataDirPath: string

async function startCon(){

}

window.addEventListener("DOMContentLoaded",  async () => {

  

  
  userEl = <HTMLInputElement>document.getElementById('username')!
  passEl = <HTMLInputElement>document.getElementById('password')!
  serverHostEl = <HTMLInputElement>document.getElementById('serverHost')!
  portEl = <HTMLInputElement>document.getElementById('port')!
  // authTypeEl = document.getElementById('')!
  
  accountCreateEl = document.getElementById("accountCreate")!
  startButtonEl = document.getElementById("start-button")!

  accountCreateEl.addEventListener("click", () => {
    let username = userEl.value!
    let password = passEl.value!
    let serverHost = serverHostEl.value
    let port = portEl.value
  
    makeAccount(username, password, serverHost, port, "temp")  
  })

  startButtonEl.addEventListener("click", () => {startCon()})

  let command = new Command("sh")
  sh = await command.spawn().then()
  command.stdout.on('data', function(line){
    writeTerm(line)
  })
  
  appDataDirPath =  await appDataDir()


  
});