import { BaseDirectory, exists } from "@tauri-apps/api/fs"
import { appDataDirPath } from "./main"
import { invoke } from "@tauri-apps/api/tauri"
import { Arch, Platform, arch, platform } from "@tauri-apps/api/os"

function setup(plat: Platform, arch: Arch, appDataDirPath: String){
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
  
    "cp -r assets/gui " + appDataDirPath
    "cd " + appDataDirPath
    "wget $(curl -s https://api.github.com/repos/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest | grep 'browser_' | cut -d\\\" -f4 | " + awk + "')"
    "gzip -d $(ls | grep soft | cut -d ' ' -f9)"
    "tar -xvf $(ls | grep soft | cut -d ' ' -f9)"
    "rm $(ls | grep soft | cut -d ' ' -f9)"
    "cd " + appDataDirPath + "vpnclient"
    "make"
}

export async function startup(){
    if(!await exists("gui/config.json", { dir: BaseDirectory.AppData })){
        console.log("intitializing")
        setup(await platform(), await arch(), appDataDirPath)
        await startClient()
      }
}

export async function startClient(){
    
    while(!await exists(appDataDirPath + "vpnclient/vpnclient")){
      console.log("no")
    }

    invoke("startclient", {})
    
}