//import { invoke } from "@tauri-apps/api/tauri";
import { Child, Command } from '@tauri-apps/api/shell'
import { BaseDirectory, exists, readTextFile, writeTextFile } from  '@tauri-apps/api/fs'
import { appDataDir } from "@tauri-apps/api/path";
import { Arch, arch, Platform, platform } from '@tauri-apps/api/os'

let sh: Child;
let terminalElement: HTMLElement;

async function readTextFileFromAppData(path: string): Promise<String> {
  return readTextFile(path, {dir: BaseDirectory.AppData})
}


function shwrite(line: string){
  sh.write(line + "\n")
  console.log("Wrote to shell: " + line)
  writeTerm("$ " + line)
}

function writeTerm(line: string){
  let htmlLine = document.createElement("nu-block")
  htmlLine.append(document.createTextNode(line))
  terminalElement.appendChild(htmlLine)
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

  shwrite("cp assets/blank.json " + appDataDirPath + "config.json")
  shwrite("cd " + appDataDirPath)
  shwrite("wget $(curl -s https://api.github.com/repos/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest | grep 'browser_' | cut -d\\\" -f4 | " + awk + "')")
  shwrite("gzip -d $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("tar -xvf $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("rm $(ls | grep soft | cut -d ' ' -f9)")
  shwrite("cd ./vpnclient/")
  shwrite("cat $(ls | cut -d ' ' -f9 | awk '/License/ && /en/')")
  shwrite("make main")

}

window.addEventListener("DOMContentLoaded",  async () => {

  terminalElement = document.getElementById('cmd')!

  let command = new Command("sh")
  sh = await command.spawn().then()
  command.stdout.on('data', function(line){
    writeTerm(line)
  })
  
  if(!await exists("config.json", { dir: BaseDirectory.AppData })){
    console.log("intitializing")
    intitialize(await platform(), await arch(), await appDataDir())
  }
});

