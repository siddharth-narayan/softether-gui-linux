<script lang="ts">
    // import settings from '../available-settings.json';
    import Setting from './Setting.svelte';
    import Button from './Button.svelte';
    import { readConfigJson, writeAccountToConfig } from '../account';

    export let rerender: boolean = false;

    let availableSettingsPromise = readConfigJson("ReadOnlySettings")
    let array: ([settingName: string, value: string | number | boolean ])[] = []

    // Initialize settings array to default values
    availableSettingsPromise.then((availableSettings) => {
        for (let index = 0; index < availableSettings.length; index++){
            array.push([availableSettings[index].configname, availableSettings[index].default])
        }
    })

    // To prevent account json being written every time an input is typed into
    function accountJsonCallback(){
        (writeAccountToConfig(array)).then(()=>{
            rerenderToggle()
        })
    }

    let index = 0;
    function indexf(){
        return index++;
    }

    function test(setting){
        console.log(setting)
        return setting
    }

</script>

<div class="flex flex-col bg-primary p-8 gap-4 text-text font-bold w-full">
    <h1 class="self-center text-accent text-4xl p-8">Add an Account</h1>
    <h1 class="self-center">You can set up the advanced settings later</h1>
    {#await availableSettingsPromise}
        <p>Loading ...</p>
    {:then settings} 
    {#if settings.length === 0}
        <h1 class="self-center">Nothing to see here! How about you go add an account?</h1>
        {/if}
        {#each settings as setting}
            {#if setting.required == true}
                <Setting setting={test(setting)} bind:array={array} index={indexf()}></Setting>
            {/if}
        {/each}
    {/await}
        <Button --color="grey" show={true} onclick={accountJsonCallback} text="Save account!"></Button>
</div>