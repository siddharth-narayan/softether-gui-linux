<script lang="ts">
    import { appDataDir } from "@tauri-apps/api/path";
    import { readConfigJson, searchAcccount } from "../account";
    import Button from "./Button.svelte";
    import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
    import { Command } from "@tauri-apps/api/shell";

    export let account: AccountType;

    let configPromise = readConfigJson()
    let connected = false;
    let show = true
    
    disconnect()

    // Called when the "Connect Account" button is clicked.
    // Calls createFileFromTemplate() to create the .vpn file
    // Then calls connect() to connect that .vpn file
    function connectAccount() {
        let accountName =
            account.Username.toString().replaceAll(" ", "_") + account.Hostname;

        searchAcccount(accountName).then((account) => {

        })
        readConfigJson().then((config: Config) => {
            let accountsJson: AccountType[] = config["Accounts"];
            console.log(accountsJson);
            
            // Loop through all accounts in "Accounts": []
            // Connects if the AccountNames match
            for (let i = 0; i < accountsJson.length; i++) {
                console.log(accountsJson[i]["AccountName"]);
                if (accountsJson[i]["AccountName"] === accountName) {
                    createFileFromTemplate(accountsJson[i]).then(() => {
                        connect();
                    });
                }
            }
        });
    }

    async function connect() {
        let appDataDirPath = await appDataDir();

        // "\\" is there because softether will treat "/" as an argument
        // as if it was on Windows, so it's necessary to escape the leading "/"
        let filePath = "\\" + appDataDirPath + "accounts/temp";
 
        // Import account
        let command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountImport",
            filePath,
        ]);

        let output = (await command.execute()).stdout
        // console.log(output)

        // Connect account
        command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountConnect",
            "temp",
        ]);

        output = (await command.execute()).stdout
        // console.log(output)

        connected = true;
    }

    async function disconnect() {
 
        // Import account
        let command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountDisconnect",
            "temp",
        ]);

        let output = (await command.execute()).stdout
        // console.log(output)

        // Connect account
        command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountDelete",
            "temp",
        ]);
        
        output = (await command.execute()).stdout
        // console.log(output)

        connected = false
    }

    async function deleteAccount() {
        //Delete it
    }

    async function createFileFromTemplate(account: AccountType) {
        let availableSettings = (await configPromise)["ReadOnlySettings"]
        let appDataDirPath = await appDataDir();
        let template = await readTextFile(
            appDataDirPath + "vpnaccount.template"
        );

        template = template
            .replace("$AccountName", "temp")
            .replace("$HubName", "VPN")
            .replace("$AuthType", "1")
            .replace("$Hostname", account["Hostname"] + "/tcp");

        for (let i = 0; i < availableSettings.length; i++) {
            let configname: string =
                availableSettings[i]["configname"];
            let value = account[configname];
            template = template.replace("$" + configname, value);
        }

        let path = appDataDirPath + "accounts/temp";
        console.log("writing to " + path);

        writeTextFile(path, template);
    }

</script>

{#if show}
    <div class="flex p-8 gap-8 items-center justify-center w-full">
        <b class="w-32 text-text">{account.Username}</b>
        <div>
            <p>Username: {account.Username}</p>
            <p>Hostname: {account.Hostname}</p>
            <p>Port: {account.Port}</p>
        </div>
        <div class="flex flex-col gap-4">
            <Button --color="green" onclick={connectAccount} text={"Connect Account"} show={!connected}/>
            <Button --color="red" onclick={disconnect} text={"Disconnect Account"} bind:show={connected}/>
            <Button --color="red" onclick={deleteAccount} text={"Delete Account"} show={true}/>
        </div>
    </div>
{/if}