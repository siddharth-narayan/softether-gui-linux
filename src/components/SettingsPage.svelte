<script>
    import settings from '../available-settings.json';
    import Setting from './Setting.svelte';
</script>

<div class="flex flex-col bg-primary p-8 gap-4 text-text font-bold">
    <h1 class="self-center text-accent text-4xl p-8">Account Settings</h1>
        {#each settings.ReadOnlySettings as setting}
            <Setting prettyname={setting.prettyname} type={setting.type} defaultval={setting.default} explanation={setting.explanation}></Setting>
        {/each}
</div>