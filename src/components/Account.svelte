<script lang="ts">
    import { appDataDir } from "@tauri-apps/api/path";
    import { readConfigJson } from "../account";
    import availableSettings from "../available-settings.json";
    // import template from "../"
    import Button from "./Button.svelte";
    import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
    import { Command } from "@tauri-apps/api/shell";
    export let account;

    function connectAccount() {
        let accountName =
            account.Username.toString().replaceAll(" ", "_") + account.Hostname;
        console.log("aaa");
        readConfigJson().then((json) => {
            let accountsJson = json["Accounts"];
            console.log(accountsJson);
            for (let i = 0; i < accountsJson.length; i++) {
                console.log(accountsJson[i]["AccountName"]);
                if (accountsJson[i]["AccountName"] === accountName) {
                    createFileFromTemplate(accountsJson[i]).then(() => {
                        connectFile(accountName);
                    });
                }
            }
        });
    }

    async function connectFile(accountName) {
        let appDataDirPath = appDataDir();
        let filePath = appDataDirPath + "accounts/" + accountName;
        let command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountConnect",
            filePath,
        ]);
        // command.execute()
    }

    async function createFileFromTemplate(account: {}) {
        let appDataDirPath = await appDataDir();
        let template = await readTextFile(
            appDataDirPath + "vpnaccount.template"
        );
        // let
        for (let i = 0; i < availableSettings.ReadOnlySettings.length; i++) {
            let configname: string =
                availableSettings.ReadOnlySettings[i]["configname"];
            let value = account[configname];
            template = template.replace("$" + configname, value);
        }

        template = template
            .replace("$AccountName", account["AccountName"])
            .replace("$HubName", account["HubName"])
            .replace("$AuthType", account["AuthType"]);

        let path =
            appDataDirPath +
            "accounts/" +
            account["Username"].replaceAll(" ", "_") +
            account["Hostname"];
        console.log("writing to " + path);

        writeTextFile(path, template);
    }
    // import settings from "../settings.json"
    // export let accountName: string;
    // export let username: string;
    // export let hostname: string;
    // export let port: number;
    //accountName={"user"} username={account.Username} hostname={account.Hostname} port={account.Port}
</script>

<div class="flex p-8 gap-8 items-center justify-center w-full">
    <b class="w-32 text-text">{account.Username}</b>
    <div>
        <p>Username: {account.Username}</p>
        <p>Hostname: {account.Hostname}</p>
        <p>Port: {account.Port}</p>
    </div>
    <div class="flex flex-col gap-4">
        <Button onclick={connectAccount} text={"Connect Account"} />
        <Button text={"Disconnect Account"} />
        <Button text={"Delete Account"} />
    </div>
</div>
