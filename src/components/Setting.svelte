<script lang="ts">
    // import { currentPageJson } from "../stores";
    import type { SettingType } from "../account";
    
    export let setting: SettingType;
    export let array: ([settingName: string, value: string | number | boolean])[];
    export let index: number;

    let value: string | number | boolean;
    
    $: array[index] = [setting.configname, value === undefined ? setting.default : value]

    console.log(setting)
</script>

<div class="flex p-8 gap-8 items-center justify-center w-full">
    <b class="w-1/5 text-text">{setting.prettyname}</b>
    <!-- Why is there not a better way to do this?? -->
    {#if setting.type === "string"}
    <input class="bg-secondary p-2 text-text w-1/5" id={setting.prettyname} placeholder={setting.default.toString()} type="string" bind:value={value}/>
    {/if}
    {#if setting.type === "number"}
    <input class="bg-secondary p-2 text-text w-1/5" id={setting.prettyname} placeholder={setting.default.toString()} type="number" bind:value={value}/>
    {/if}
    {#if setting.type === "boolean"}
    <input class="bg-secondary p-2 text-text w-1/5" id={setting.prettyname} placeholder={setting.default.toString()} type="boolean" bind:value={value}/>
    {/if}
    {#if setting.type === "password"}
    <input class="bg-secondary p-2 text-text w-1/5" id={setting.prettyname} placeholder={setting.default.toString()} type="password" bind:value={value}/>
    {/if}
    <p class="text-text w-3/5 p-8">{setting.explanation}</p>
</div>