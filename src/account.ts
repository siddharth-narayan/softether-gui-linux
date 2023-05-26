import { invoke } from "@tauri-apps/api/tauri"
import { execute, getCurrentDate, readTextFileFromAppData, writeTextFileToAppData } from "./tools"
import { appDataDirPath } from "./startup"

export class Account {
    accountName!: string
    username: string
    password: string = ""
    hostname: string
    port: string
    isImported = false
    accountFilePath: string = ""

    constructor(username: string, password: string, hostname: string, port: string, temp: boolean) {
        this.username = username
        this.password = password
        this.hostname = hostname
        this.port = port

        if (temp) {
            this.accountName = "temp"
        } else {
            this.accountName = username + "_" + hostname
        }
    }

    async writeAccountToFile() {
        this.accountFilePath = appDataDirPath + "gui/accounts/" + this.accountName + ".vpn"

        let text: String = await readTextFileFromAppData("gui/vpnaccount.template")
        //HASH THE PASSWD
        text = text
            .replace("$HashedPassword", await invoke("sha", { password: (this.password + this.username.toUpperCase()) }))
            .replace("$Port", this.port)
            .replace("$Hostname", this.hostname)
            .replace("$Username", this.username)
            .replace("$AccountName", this.accountName)
            .replace("$AuthType", "standard")

        writeTextFileToAppData(this.accountFilePath, text.toString())
    }

    async conAccount() {
        console.log("connecting account")
        if (this.isImported)
            await execute(
                appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountConnect " + this.accountName)
    }

    async disconAccount() {
        console.log("diconnecting account")
        if (this.isImported) {

            await execute(
                appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountDisconnect " + this.accountName)
        } else {
            await execute(
                appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountDisconnect " + this.accountName, undefined, true)
        }
    }

    async importAccount() {

        if (this.accountFilePath != "") {
            await this.delAccount()
            console.log("importing account")
            await execute(
                appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountImport " + this.accountName + ".vpn", appDataDirPath + "gui/accounts")

            this.isImported = true
        }
    }

    async delAccount() {

        await this.disconAccount()
        console.log("deleting account")
        await execute(
            appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountDelete " + this.accountName)

        this.isImported = false
    }
}