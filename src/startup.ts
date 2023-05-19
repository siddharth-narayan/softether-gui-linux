import { BaseDirectory, exists } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import { Arch, Platform, arch, platform } from "@tauri-apps/api/os";
import { appDataDir } from "@tauri-apps/api/path";
import { Account } from "./account";
import { accounts, startCon } from "./main";

export let appDataDirPath: string

export let accountCreateEl: HTMLElement
export let startButtonEl: HTMLElement
export let userEl: HTMLInputElement
export let passEl: HTMLInputElement
export let serverHostEl: HTMLInputElement
export let portEl: HTMLInputElement


function setup(plat: Platform, arch: Arch, appDataDirPath: String) {
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

  "cp -r assets/gui " + appDataDirPath;
  "cd " + appDataDirPath;
  "wget $(curl -s https://api.github.com/repos/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest | grep 'browser_' | cut -d\\\" -f4 | " +
    awk +
    "')";
  ("gzip -d $(ls | grep soft | cut -d ' ' -f9)");
  ("tar -xvf $(ls | grep soft | cut -d ' ' -f9)");
  ("rm $(ls | grep soft | cut -d ' ' -f9)");
  "cd " + appDataDirPath + "vpnclient";
  ("make");
}

function setupElements(){
  accountCreateEl = <HTMLElement> document.getElementById("accountCreate");
  startButtonEl = <HTMLElement> document.getElementById("start-button");
  
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

}

export async function startup() {
  appDataDirPath =  await appDataDir()

  setupElements()
  attachListeners()

  if (!(await exists("gui/config.json", { dir: BaseDirectory.AppData }))) {
    console.log("intitializing");
    setup(await platform(), await arch(), appDataDirPath);
    await startClient();
  }
}

async function startClient() {
  while (!(await exists(appDataDirPath + "vpnclient/vpnclient"))) {
    console.log("no");
  }

  invoke("startclient", {});
}
