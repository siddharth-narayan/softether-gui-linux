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

async function startClient(){
  while(!await exists(appDataDirPath + "vpnclient/vpnclient")){
    console.log("no")
  }
  invoke("startclient", {})
}

async function startCon(){

  // if(ACCOUNT SELECTED){

  // } else {

  // }

  let username = userEl.value!
  let password = passEl.value!
  let serverHost = serverHostEl.value
  let port = portEl.value

  makeAccount(username, password, serverHost, port, "temp")

  await shwrite("cd " + appDataDirPath + "vpnclient")
  
  
}

function intitialize(plat: Platform, arch: Arch, appDataDirPath: String){
  let awk = "awk '/vpnclient/"

  switch(arch) {
    case 'aarch64':
      awk += " && /arm64-64bit/"
      break
    case 'arm':
      awk += " && /arm-32bit/"
      break
    case 'mips':
      awk += " && /mips/"
      break
    case 'mips64':
      awk += " && /mips/"
      break
    case 'powerpc':
      awk += " && /powerpc-32bit/"
      break
    case 'powerpc64':
      awk += " && /powerpc64-64bit/"
      break
    case 'sparc64':
      awk += " && /sparc64-64bit/"
      break
    case 'x86':
      awk += " && /x86-32bit/"
      break
    case 'x86_64':
      awk += " && /x64-64bit/"
      break
    default:
      awk += " && /x64-64bit/"
      break
  }

  switch(plat){
    case 'darwin':
      awk += " && /macos/"
      break
    case 'freebsd':
      awk += " && /freebsd/"
      break
    case 'linux':
      awk += " && /linux/"
      break
    case 'solaris':
      awk += " && /solaris/"
      break
    default: 
      awk += " && /linux/"
      break
  }

  shwrite("cp -r assets/gui " + appDataDirPath)
  shwrite("cd " + appDataDirPath)
  shwrite("wget $(curl -s https://api.github.com/repos/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest | grep 'browser_' | cut -d\\\" -f4 | " + awk + "')")
  shwrite("gzip -d $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("tar -xvf $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("rm $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("cd " + appDataDirPath + "vpnclient")
  shwrite("make")
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

  if(!await exists("gui/config.json", { dir: BaseDirectory.AppData })){
    console.log("intitializing")
    intitialize(await platform(), await arch(), appDataDirPath)
    await startClient()
  }
  
});