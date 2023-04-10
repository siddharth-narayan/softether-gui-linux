import { Child, Command } from '@tauri-apps/api/shell'
import { BaseDirectory, exists, readTextFile, writeTextFile } from  '@tauri-apps/api/fs'
import { appDataDir } from "@tauri-apps/api/path";
import { Arch, arch, Platform, platform } from '@tauri-apps/api/os'
import { invoke } from '@tauri-apps/api/tauri'

let sh: Child;
let terminalElement: HTMLElement;
let userEl: HTMLElement
let passEl: HTMLElement
let serverHostEl: HTMLElement
let portEl: HTMLElement
let authTypeEl: HTMLElement

async function readTextFileFromAppData(path: string): Promise<String> {
  return readTextFile(path, {dir: BaseDirectory.AppData})
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

async function makeAccount(){
  let username = userEl.textContent!
  let password = passEl.textContent!
  let serverHost = serverHostEl.textContent!
  let port = portEl.textContent!

  let text: String = await readTextFileFromAppData("gui/vpnaccount.template")
  text.replace("$Username", username)
  //HASH THE PASSWD
  text.replace("$HashedPassword", password)
  text.replace("$ServerHost", serverHost)
  text.replace("$Port", port)
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

  shwrite("mv assets/gui " + appDataDirPath)
  shwrite("cd " + appDataDirPath)
  shwrite("wget $(curl -s https://api.github.com/repos/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest | grep 'browser_' | cut -d\\\" -f4 | " + awk + "')")
  shwrite("gzip -d $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("tar -xvf $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("rm $(ls | grep soft | cut -d ' ' -f9)")

}

window.addEventListener("DOMContentLoaded",  async () => {

  terminalElement = document.getElementById('cmd')!
  userEl = document.getElementById('username')!
  passEl = document.getElementById('password')!
  serverHostEl = document.getElementById('serverHost')!
  portEl = document.getElementById('port')!
  // authTypeEl = document.getElementById('')!

  let command = new Command("sh")
  sh = await command.spawn().then()
  command.stdout.on('data', function(line){
    writeTerm(line)
  })
  
  if(!await exists("gui/config.json", { dir: BaseDirectory.AppData })){
    console.log("intitializing")
    intitialize(await platform(), await arch(), await appDataDir())
  }

});

