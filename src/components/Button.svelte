<script lang="ts">
    export let text: string;
    export let onclick: () => void;
    export let show: boolean;
</script>

<style>
    .button {
        background-color: var(--color);
    }
    .button:hover {
        filter: brightness(125%);
    }
</style>

{#if show}
    <button class="button p-4 rounded-md transition duration-150" on:click={onclick}>{text}</button>
{/if}