<script>
    export let hoverText;
    export let iconUrl;
    export let index;
    export let pageSwitch;

    function onclick() {
        pageSwitch(index);
    }
</script>

<button on:click={onclick} class="bg-secondary p-2 w-16 h-16 max-w-16 max-h-16">
    <img src={iconUrl}/>
</button>