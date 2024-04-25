<script>
    import settings from "../settings.json"
    import Account from "./Account.svelte";
</script>

<div class="flex flex-col bg-primary p-8 gap-4 text-text font-bold w-full">
    <h1 class="self-center text-accent text-4xl p-8">Accounts</h1>
        {#if settings.Accounts.length === 0}
            <h1 class="self-center">Nothing to see here! How about you go add an account?</h1>
        {/if}
        {#each settings.Accounts as account}
            <Account accountName={account.accountName} username={account.username} hostname={account.hostname} port={account.port}></Account>
        {/each}
</div>