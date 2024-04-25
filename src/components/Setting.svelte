<style>

</style>

<script lang="ts">
    export let prettyname: string;
    export let placeholder: string;
    export let type: string;
    export let defaultval: String | Number | Boolean;
    export let explanation: String;
</script>

<div class="flex p-8 gap-8 items-center justify-center w-full">
    <b class="w-1/5 text-text">{prettyname}</b>
    <input class="bg-secondary p-2 text-text w-1/5" id={prettyname} placeholder={defaultval.toString()} {type}/>
    <p class="text-text w-3/5 p-8">{explanation}</p>
</div>