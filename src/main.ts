// import { Account } from './account';
// import { appDataDirPath, passEl, portEl, serverHostEl, startButtonEl, startup, stopButtonEl, userEl } from './startup';
// import { execute } from './tools';

// export let accounts: Account[] = []
// export let currentAccount: Account

// export async function stopCon() {
  
//   stopButtonEl.style.display = "none"
//   startButtonEl.style.display = "inline"
  
//   if (currentAccount == undefined) {
//     return
//   }

//   currentAccount.disconAccount()
// }

// export async function startCon() {
  
//   if (serverHostEl.value == "" || portEl.value == "" || userEl.value == "" || passEl.value == "") {
//     return
//   }

//   startButtonEl.style.display = "none"
//   stopButtonEl.style.display = "inline"



//   //  if(ACCOUTN SELECTED){

//   //  }
//   let acc = new Account(userEl.value!, passEl.value!, serverHostEl.value!, portEl.value!, true)

//   await acc.writeAccountToFile()
//   await acc.importAccount()
//   await acc.conAccount()
//   currentAccount = acc
// }

// window.addEventListener("DOMContentLoaded", async () => {
//   await startup()
//   console.log(appDataDirPath)
// }); 

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;