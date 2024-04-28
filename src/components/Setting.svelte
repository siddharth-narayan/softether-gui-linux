<script lang="ts">
    // import { currentPageJson } from "../stores";
    import { invoke } from "@tauri-apps/api/tauri";
    export let prettyname: string;
    export let configname: string;
    export let required: boolean;
    export let type: string;
    export let defaultval: String | Number | Boolean;
    export let explanation: String;

    export let array: ([settingName: string, value: string | number | boolean])[];
    export let index: number;

    let value: string | number | boolean;
    
    $: array[index] = [configname, value]
</script>

<div class="flex p-8 gap-8 items-center justify-center w-full">
    <b class="w-1/5 text-text">{prettyname}</b>
    <!-- Why is there not a better way to do this?? -->
    {#if type === "string"}
    <input class="bg-secondary p-2 text-text w-1/5" id={prettyname} placeholder={defaultval.toString()} type="string" bind:value={value}/>
    {/if}
    {#if type === "number"}
    <input class="bg-secondary p-2 text-text w-1/5" id={prettyname} placeholder={defaultval.toString()} type="number" bind:value={value}/>
    {/if}
    {#if type === "boolean"}
    <input class="bg-secondary p-2 text-text w-1/5" id={prettyname} placeholder={defaultval.toString()} type="boolean" bind:value={value}/>
    {/if}
    {#if type === "password"}
    <input class="bg-secondary p-2 text-text w-1/5" id={prettyname} placeholder={defaultval.toString()} type="password" bind:value={value}/>
    {/if}
    <!-- <input class="bg-secondary p-2 text-text w-1/5" id={prettyname.replaceAll(" ", "")} placeholder={defaultval.toString()} {type}/> -->
    <p class="text-text w-3/5 p-8">{explanation}</p>
</div>