<script lang="ts">
    // import settings from '../available-settings.json';
    import Setting from './Setting.svelte';
    import Button from './Button.svelte';
    import { readConfigJson, writeAccountToConfig } from '../account';

    export let rerender: boolean = false;

    let configPromise = readConfigJson()
    let array: ([settingName: string, value: string | number | boolean ])[] = []

    // Initialize settings array to default values
    configPromise.then((config) => {
        let availableSettings = config["ReadOnlySettings"]
        for (let index = 0; index < availableSettings.length; index++){
            array.push([availableSettings[index].configname, availableSettings[index].default])
        }
    })

    // To prevent account json being written every time an input is typed into
    function accountJsonCallback(){
        (writeAccountToConfig(array)).then(()=>{
            rerender = rerender == false ? true : false
        })
    }

    let index = 0;
    function indexf(){
        return index++;
    }

</script>

<div class="flex flex-col bg-primary p-8 gap-4 text-text font-bold w-full">
    <h1 class="self-center text-accent text-4xl p-8">Add an Account</h1>
    <h1 class="self-center">You can set up the advanced settings later</h1>
    {#await configPromise}
    <p>Loading ...</p>
    {:then config} 
        {#each config["ReadOnlySettings"] as setting}
            {#if setting.required == true}
                <Setting prettyname={setting.prettyname} configname={setting.configname} type={setting.type} defaultval={setting.default} required={true} explanation={setting.explanation} bind:array={array} index={indexf()}></Setting>
            {/if}
        {/each}
    {/await}
        <Button --color="grey" show={true} onclick={accountJsonCallback} text="Save account!"></Button>
</div>