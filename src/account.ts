import { invoke } from "@tauri-apps/api";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

export type AccountType = {
    [key: string]: any;
};

export type SettingType = {
    [key: string]: any;
};

export type Config = {
    ["Accounts"]: AccountType[];
    ["ReadOnlySettings"]: SettingType[];
};

export async function searchAccount(
    accountName: string
): Promise<[AccountType, number]> {
    let accountsJson: AccountType[] = await readConfigJson("Accounts");

    // Loop through all accounts in "Accounts": []
    // returns if the account names match
    for (let i = 0; i < accountsJson.length; i++) {
        console.log(accountsJson[i]["AccountName"]);
        if (accountsJson[i]["AccountName"] === accountName) {
            return [accountsJson[i], i];
        }
    }
    return [{}, -1]
}

// Used by AccountCreatePage
export async function writeAccountToConfig(
    array: [settingName: string, value: string | number | boolean][]
) {
    let accounts = await readConfigJson("Accounts")
    let accountJson = jsonFromArray(array);
    accounts.push(accountJson)

    await writeJsonToConfig(accounts, "Accounts");
    return true;
}

export async function deleteAccountFromConfig(accountName: string) {
    console.log("Deletings account " + accountName)
    let accounts = await readConfigJson("Accounts");
    for (let i = 0; i < accounts.length; i++) {
        let account = accounts[i]
        if (account.AccountName === accountName) {
            accounts.splice(i, 1)
        }
    }
    writeJsonToConfig(accounts, "Accounts")
}

export async function readConfigJson(path: string): Promise<SettingType> {
    let appDataDirPath = await appDataDir();
    let jsonText = await readTextFile(appDataDirPath + "config.json");
    let json = JSON.parse(jsonText.toString());
    return json[path];
}

export async function writeJsonToConfig(json: {}, path: string) {
    let appDataDirPath = await appDataDir();
    console.debug(appDataDirPath + "config.json");
    let jsonText = await readTextFile(appDataDirPath + "config.json");
    let config = JSON.parse(jsonText.toString());
    config[path] = json;

    writeTextFile(appDataDirPath + "config.json", JSON.stringify(config));
}

// This function depends on array indices 0 1 and 2 being Username Password and Hostname
function jsonFromArray(
    array: [settingName: string, value: string | number | boolean][]
) {
    let accountJson: AccountType = {};
    for (let i = 0; i < array.length; i++) {
        if (array[i][0] === "HashedPassword") {
            invoke("sha", {
                password: array[1][1] + array[0][1].toString().toUpperCase(),
            }).then((hashvalue) => {
                console.debug(hashvalue);
                accountJson["HashedPassword"] = hashvalue;
            });
        } else {
            accountJson[array[i][0]] = array[i][1];
        }
        // accountJson = Username.replaceSpacesWithUnderscores() + Hostname
    }

    accountJson["AccountName"] =
        array[0][1].toString().replace(" ", "_") + array[2][1];
    return accountJson;
}
