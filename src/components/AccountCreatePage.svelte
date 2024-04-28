<script lang="ts">
    import settings from '../available-settings.json';
    import Setting from './Setting.svelte';
    import Button from './Button.svelte';
    import { writeAccountsJsonFromArray } from '../account';

    let array: ([settingName: string, value: string | number | boolean ])[] = []
    for (let index = 0; index < settings.ReadOnlySettings.length; index++){
        array.push([settings.ReadOnlySettings[index].configname, settings.ReadOnlySettings[index].default])
    }

    // To prevent account json being written every time an input is typed into
    function accountJsonCallback(){
        writeAccountsJsonFromArray(array)
    }

    let index = 0;
    function indexf(){
        return index++;
    }

</script>

<div class="flex flex-col bg-primary p-8 gap-4 text-text font-bold w-full">
    <h1 class="self-center text-accent text-4xl p-8">Add an Account</h1>
    <h1 class="self-center">You can set up the advanced settings later</h1>
        {#each settings.ReadOnlySettings as setting}
            {#if setting.required == true}
                <Setting prettyname={setting.prettyname} configname={setting.configname} type={setting.type} defaultval={setting.default} required={true} explanation={setting.explanation} bind:array={array} index={indexf()}></Setting>
            {/if}
        {/each}
        <Button class={"p-8 font-bold bg-secondary rounded-md hover:bg-primary"} onclick={accountJsonCallback} text="Save account!"></Button>
</div>