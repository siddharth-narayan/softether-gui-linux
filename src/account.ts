import { invoke } from "@tauri-apps/api"
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { appDataDir } from "@tauri-apps/api/path"

export function writeAccountsJsonFromArray(array: ([settingName: string, value: string | number | boolean ])[]){
    let accountJson = jsonFromSettingsArray(array)
    writeAccountJsonToConfig(accountJson)
}

export async function readConfigJson(): Promise<{}> {
    let appDataDirPath = await appDataDir()
    console.debug(appDataDirPath + "config.json")
    let jsonText = await readTextFile(appDataDirPath + "config.json")
    let json = JSON.parse(jsonText.toString())
    return json
}

export async function readAccountsJson(): Promise<{}> {
    let appDataDirPath = await appDataDir()
    console.debug(appDataDirPath + "config.json")
    let jsonText = await readTextFile(appDataDirPath + "config.json")
    let json = JSON.parse(jsonText.toString())
    return json["Acccounts"]
}

function createFileFromTemplate(accountJson: {}){
    appDataDir().then((appDataDirPath)=>{
        readConfigJson
    })
}

// This function depends on array indices 0 1 and 2 being Username Password and Hostname
function jsonFromSettingsArray(array: ([settingName: string, value: string | number | boolean ])[]) {
    let accountJson = {}
    for (let i = 0; i < array.length; i++){
        if(array[i][0] === "HashedPassword"){
            invoke("sha", { password: array[1][1] + array[0][1].toString().toUpperCase()}).then((hashvalue)=>{
                console.debug(hashvalue);
                accountJson[array[i][0]] = hashvalue;
            })
        } else {
            accountJson[array[i][0]] = array[i][1];
        }
        // accountJson = Username.replaceSpacesWithUnderscores() + Hostname        
    }
    
    accountJson["AccountName"] = array[0][1].toString().replace(" ", "_") + array[2][1]
        
    accountJson["AuthType"] = "password"

    // TODO: (way later lol) make it so you can use any vpn hub
    accountJson["HubName"] = "VPN"
    return accountJson
}

async function writeAccountJsonToConfig(accountJson: {}){
    let appDataDirPath = await appDataDir()
    console.debug(appDataDirPath + "config.json")
    let jsonText = await readTextFile(appDataDirPath + "config.json")
    let json = JSON.parse(jsonText.toString())
    json.Accounts.push(accountJson)
    
    writeTextFile(appDataDirPath + "config.json", JSON.stringify(json))
}