import { invoke } from "@tauri-apps/api/tauri"
import { readTextFileFromAppData, writeTextFileToAppData } from "./tools"
import { appDataDirPath } from "./main"

class Account {
    accountName!: string
    username: string
    password: string = ""
    hostname: string
    port: string
    isImported = false
    accountFilePath: string = ""

    constructor(username: string, password: string, hostname: string, port: string, accountName: string | null){
        this.username = username
        this.password = password
        this.hostname = hostname 
        this.port = port

        if (accountName != null){
            this.accountName = accountName
        } else {
            accountName = "temp"
        }
    }

    async writeAccountToFile(){
        this.accountFilePath = appDataDirPath + "gui/accounts/" + this.accountName +".vpn"

        let text: String = await readTextFileFromAppData("gui/vpnaccount.template")
        //HASH THE PASSWD
        text = text
          .replace("$HashedPassword", await invoke("sha", {password: (this.password + this.username.toUpperCase())} ))
          .replace("$Port", this.port)
          .replace("$Hostname", this.hostname)
          .replace("$Username", this.username)
          .replace("$AccountName", this.username + "_" + this.hostname)
        
          writeTextFileToAppData(this.accountFilePath, text.toString())
    }

    conAccount(){
        appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountConnect " + this.username + "_" + this.hostname
    }

    disconAccount(){
        appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountDisconnect " + this.username + "_" + this.hostname
    }

    importAccount(){
        appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountImport " + this.accountFilePath
    }

    delAccount(){
        appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountDelete " + this.username + "_" + this.hostname
    }
}