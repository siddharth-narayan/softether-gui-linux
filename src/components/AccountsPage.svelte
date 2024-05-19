<script>
    import { readConfigJson } from "../account";
    import Account from "./Account.svelte"
    
    console.log("LOADED ACCOUNTSPAGE")
    let configPromise = readConfigJson()
</script>

<div class="flex flex-col bg-primary p-8 gap-4 text-text font-bold w-full">
    <h1 class="self-center text-accent text-4xl p-8">Accounts</h1>
    <h1 class="self-center">Please don't connect two accounts at the same time (it will break everything)</h1>
    {#await configPromise}
        <p>Loading ...</p>
    {:then config} 
        {#if config.Accounts.length === 0}
            <h1 class="self-center">Nothing to see here! How about you go add an account?</h1>
        {/if}
        {#each config.Accounts as account}
            <Account {account}></Account>
        {/each}
    {/await}
</div>