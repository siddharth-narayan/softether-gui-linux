<script lang="ts">
    import { appDataDir } from "@tauri-apps/api/path";
    import {
        readConfigJson,
        searchAccount,
        type AccountType,
        deleteAccountFromConfig,
    } from "../account";
    import Button from "./Button.svelte";
    import {
        readTextFile,
        removeFile,
        writeTextFile,
    } from "@tauri-apps/api/fs";
    import { Command } from "@tauri-apps/api/shell";

    export let account: AccountType;
    export let rerender

    let availableSettingsPromise = readConfigJson("ReadOnlySettings");
    let connected = false;
    let show = true;

    // Make sure no account is connected
    disconnect();

    // Connects vpnclient to the "temp" file which MUST exist
    export async function connect() {
        // Create "temp" file
        let accountName =
            account.Username.toString().replaceAll(" ", "_") + account.Hostname;

        let accountJson = await searchAccount(accountName);
        console.log(accountJson);

        if (accountJson[1] < 0) {
            return;
        }

        await createTempFromJson(accountJson[0]);

        // Connect

        let appDataDirPath = await appDataDir();

        // "\\" is there because softether will treat "/" as an argument
        // as if it was on Windows, so it's necessary to escape the leading "/" in the path
        // The final command will look like this: "vpncmd localhost /CLIENT /CMD AccountImport \/<path>"
        let filePath = "\\" + appDataDirPath + "accounts/temp";

        // Import account
        let command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountImport",
            filePath,
        ]);

        let result = await command.execute();

        console.log("Process exited with code " + result.code);
        console.log(result.stdout);

        // Connect account
        command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountConnect",
            "temp",
        ]);

        result = await command.execute();

        console.log("Process exited with code " + result.code);
        console.log(result.stdout);

        if (result.code == 0) {
            connected = true;
        }
    }

    // Disconnects vpnclient from the "temp" account and file
    export async function disconnect() {
        // Disconnect account
        let command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountDisconnect",
            "temp",
        ]);

        let output = (await command.execute()).stdout;

        // Delete account from vpnclient
        command = new Command("vpncmd", [
            "localhost",
            "/CLIENT",
            "/CMD",
            "AccountDelete",
            "temp",
        ]);

        let result = await command.execute();

        console.log("Process exited with code " + result.code);
        console.log(result.stdout);

        if (result.code == 0) {
            connected = false;
        }

        // Delete temp file (if it exists)
        appDataDir().then((appDataDirPath) => {
            let filePath = appDataDirPath + "accounts/temp";
            removeFile(filePath).catch(() => {
                console.log("temp was already deleted");
            });
        });
    }

    async function deleteAccount() {
        let accountName =
            account.Username.toString().replaceAll(" ", "_") + account.Hostname;
        deleteAccountFromConfig(accountName);
    }

    async function createTempFromJson(account: AccountType) {
        let availableSettings = await availableSettingsPromise
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
            let configname: string = availableSettings[i]["configname"];
            let value = account[configname];
            template = template.replace("$" + configname, value);
        }

        let path = appDataDirPath + "accounts/temp";
        console.log("writing to " + path);

        writeTextFile(path, template);
    }
</script>

{#if show}
    <div class="flex p-8 items-center justify-between w-full">
        <b class="w-32 text-text">{account.Username}</b>
        <div>
            <p>Username: {account.Username}</p>
            <p>Hostname: {account.Hostname}</p>
            <p>Port: {account.Port}</p>
        </div>
        <div class="flex flex-col gap-4">
            <Button
                --color="green"
                onclick={connect}
                text={"Connect Account"}
                show={!connected}
            />
            <Button
                --color="red"
                onclick={disconnect}
                text={"Disconnect Account"}
                show={connected}
            />
            <Button
                --color="red"
                onclick={deleteAccount}
                text={"Delete Account"}
                show={true}
            />
        </div>
    </div>
{/if}
