import { BaseDirectory, exists } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import { Arch, Platform, arch, platform } from "@tauri-apps/api/os";
import { appDataDir } from "@tauri-apps/api/path";
import { Account } from "./account";
import { accounts, startCon, stopCon } from "./main";
import { execute } from "./tools";

export let appDataDirPath: string

export let accountCreateEl: HTMLElement
export let startButtonEl: HTMLElement
export let stopButtonEl: HTMLElement
export let userEl: HTMLInputElement
export let passEl: HTMLInputElement
export let serverHostEl: HTMLInputElement
export let portEl: HTMLInputElement


async function setup(plat: Platform, arch: Arch, appDataDirPath: String) {
  let awk = "awk '/vpnclient/";

  switch (arch) {
    case "aarch64":
      awk += " && /arm64-64bit/";
      break;
    case "arm":
      awk += " && /arm-32bit/";
      break;
    case "mips":
      awk += " && /mips/";
      break;
    case "mips64":
      awk += " && /mips/";
      break;
    case "powerpc":
      awk += " && /powerpc-32bit/";
      break;
    case "powerpc64":
      awk += " && /powerpc64-64bit/";
      break;
    case "sparc64":
      awk += " && /sparc64-64bit/";
      break;
    case "x86":
      awk += " && /x86-32bit/";
      break;
    case "x86_64":
      awk += " && /x64-64bit/";
      break;
    default:
      awk += " && /x64-64bit/";
      break;
  }

  switch (plat) {
    case "darwin":
      awk += " && /macos/";
      break;
    case "freebsd":
      awk += " && /freebsd/";
      break;
    case "linux":
      awk += " && /linux/";
      break;
    case "solaris":
      awk += " && /solaris/";
      break;
    default:
      awk += " && /linux/";
      break;
  }
  
  await execute("cp -r assets/gui " + appDataDirPath)
  await execute("wget $(curl -s https://api.github.com/repos/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest | grep 'browser_' | cut -d\\\" -f4 | " + awk + "')", appDataDirPath.toString());
  await execute("gzip -d $(ls | grep soft | cut -d ' ' -f9)", appDataDirPath.toString());
  await execute("tar -xvf $(ls | grep soft | cut -d ' ' -f9)", appDataDirPath.toString());
  await execute("rm $(ls | grep soft | cut -d ' ' -f9)", appDataDirPath.toString());
  await execute("make", appDataDirPath + "vpnclient");
}

function setupElements(){
  accountCreateEl = <HTMLElement> document.getElementById("accountCreate");
  startButtonEl = <HTMLElement> document.getElementById("start-button");
  stopButtonEl = <HTMLElement> document.getElementById("stop-button");
  stopButtonEl.style.display = "none"
  
  userEl = <HTMLInputElement> document.getElementById("username");
  passEl = <HTMLInputElement> document.getElementById("password");
  serverHostEl = <HTMLInputElement> document.getElementById("serverHost");
  portEl = <HTMLInputElement> document.getElementById("port");
}

async function attachListeners(){

  accountCreateEl.addEventListener("click", () => {
    let username = userEl.value!
    let password = passEl.value!
    let serverHost = serverHostEl.value
    let port = portEl.value

    accountCreateEl.addEventListener("click", () => {
      accounts.push(new Account(username, password, serverHost, port, false))
    })
  })



  startButtonEl.addEventListener("click", () => {startCon()})
  stopButtonEl.addEventListener("click", () => {stopCon()})

}

export async function startup() {
  appDataDirPath =  await appDataDir()

  setupElements()
  attachListeners()

  if (!(await exists("gui/config.json", { dir: BaseDirectory.AppData }))) {
    console.log("intitializing");
    await setup(await platform(), await arch(), appDataDirPath);
    
  }
  await startClient();
}

async function startClient() {
  while (!(await exists(appDataDirPath + "vpnclient/vpnclient"))) {
    const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
    await delay(500)
    console.log("no");
  }
  console.log("start client")

  invoke("startclient", {});
}
