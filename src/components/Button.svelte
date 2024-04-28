<script lang="ts">
    export let text;
    export let onclick;
</script>

<button class="p-4 rounded-md transition duration-150 bg-secondary hover:bg-tertiary" on:click={onclick}>{text}</button>