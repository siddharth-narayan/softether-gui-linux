import { invoke } from "@tauri-apps/api/tauri"
import { execute, getCurrentDate, readTextFileFromAppData, writeTerm, writeTextFileToAppData } from "./tools"
import { appDataDirPath, gateways } from "./startup"
import { Command } from "@tauri-apps/api/shell"

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
            .replace("$Hostname", this.hostname + "/tcp")
            .replace("$Username", this.username)
            .replace("$AccountName", this.accountName)
            .replace("$AuthType", "1")
            .replace("$DeviceName", "VPN")
            .replace("$HubName", "VPN")

        writeTextFileToAppData(this.accountFilePath, text.toString())
    }

    async conAccount() {
        console.log("connecting account")
        if (this.isImported){
            await execute(
                appDataDirPath + "vpnclient/vpncmd localhost /CLIENT /CMD AccountConnect " + this.accountName);

            //do some finishing work by running the following commands:
            //sudo dhclient
            //ip route del default via <old gateway ip>
            //ip route add <hostname ip> via <old gateway ip>
            //then disable ipv6 because it makes the vpn not work at all.
            await execute("pkexec " + appDataDirPath + "gui/setroute.sh")// + gateways[1] + " " + gateways[0] + " " + this.hostname)
            console.log("pkexec " + appDataDirPath + "gui/setroute.sh " + gateways[0] + " " + this.hostname)
        }
            
            
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