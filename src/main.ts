import { Child, Command } from '@tauri-apps/api/shell'
import { BaseDirectory, exists, readTextFile, writeTextFile } from  '@tauri-apps/api/fs'
import { appDataDir } from "@tauri-apps/api/path";
import { Arch, arch, Platform, platform } from '@tauri-apps/api/os'
import { invoke } from '@tauri-apps/api/tauri'
import { stat } from 'fs';

let sh: Child;
let terminalElement: HTMLElement;
let userEl: HTMLInputElement
let passEl: HTMLInputElement
let serverHostEl: HTMLInputElement
let portEl: HTMLInputElement
let authTypeEl: HTMLElement
let accountCreateEl: HTMLElement
let startButtonEl: HTMLElement

let appDataDirPath: string

async function readTextFileFromAppData(path: string): Promise<String> {
  return readTextFile(path, {dir: BaseDirectory.AppData})
}

async function writeTextFileToAppData(path: string, contents: string){
  return writeTextFile(path, contents, {dir: BaseDirectory.AppData })
}

function shwrite(line: string){
  sh.write(line + "\n")
  console.log("Wrote to shell: " + line)
  writeTerm("$ " + line) 
}

function writeTerm(line: string){
  let htmlLine = document.createElement("p")
  htmlLine.textContent = line
  //htmlLine.className = "mt-2 p-2 focus-visible:outline-none border-l-4 border-slate-800 text-sm bg-slate-800 text-slate-400 font-sans"
  terminalElement.appendChild(htmlLine)
  terminalElement.scrollTop = 10000000000
}

function startCon(){

  // if(ACCOUNT SELECTED){

  // } else {

  // }

  let username = userEl.value!
  let password = passEl.value!
  let serverHost = serverHostEl.value
  let port = portEl.value

  makeAccount(username, password, serverHost, port, "temp")

  invoke("startConnection", {path: appDataDirPath + "gui/accounts/temp.vpn"})
}

async function makeAccount(username:string, password:string, serverHost:string, port:string, name: string){

  let text: String = await readTextFileFromAppData("gui/vpnaccount.template")
  text.replace("$Username", username)
  //HASH THE PASSWD
  text.replace("$HashedPassword", await invoke("sha0", {password: (password + username.toUpperCase())} ))
  console.log(await invoke("sha0", {password: (password + username.toUpperCase())} ))
  text.replace("$ServerHost", serverHost)
  text.replace("$Port", port)

  writeTextFileToAppData("gui/accounts/" + name +".vpn", text.toString())
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

  shwrite("cp assets/gui " + appDataDirPath)
  shwrite("cd " + appDataDirPath)
  shwrite("wget $(curl -s https://api.github.com/repos/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest | grep 'browser_' | cut -d\\\" -f4 | " + awk + "')")
  shwrite("gzip -d $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("tar -xvf $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("rm $(ls | grep soft | cut -d ' ' -f9)")

}

window.addEventListener("DOMContentLoaded",  async () => {

  invoke("startVpnServer", {});

  terminalElement = document.getElementById('cmd')!
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
  }
});