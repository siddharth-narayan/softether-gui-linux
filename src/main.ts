import { Command } from '@tauri-apps/api/shell';
import { Account } from './account';
import { appDataDirPath, startup } from './startup';
import { execute } from './tools';
export let accounts: Account[] = []

export async function startCon(){

}

window.addEventListener("DOMContentLoaded",  async () => {
  await startup()
  console.log(appDataDirPath)
  await execute("ls /")
}); 