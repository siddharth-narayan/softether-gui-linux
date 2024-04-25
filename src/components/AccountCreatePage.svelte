<script lang="ts">
    import { invoke } from "@tauri-apps/api/tauri";
    import settings from '../settings.json';
    import Setting from './Setting.svelte';
    import Button from './Button.svelte';

    async function createNewAccount(username: string, password: string, hostname: string, port: number){
    let hashedPassword = await invoke("sha", { password: (password + username.toUpperCase()) })
    }

    function newAccountJson(username: string, hashedPassword: string, hostname: string, port: number) {

        return {
            Username: username,
            Password: hashedPassword,
            Hostname: hostname,
            Port: port
            
        }
    }
</script>

<div class="flex flex-col bg-primary p-8 gap-4 text-text font-bold w-full">
    <h1 class="self-center text-accent text-4xl p-8">Add an Account</h1>
    <h1 class="self-center">You can set up the advanced settings later</h1>
        {#each settings.ReadOnlySettings as setting}
            {#if setting.required == true}
                <Setting id={setting.configname} prettyname={setting.prettyname} placeholder={setting.default.toString()} type={setting.type} defaultval={setting.default} explanation={setting.explanation}></Setting>
            {/if}
        {/each}
        <Button text="Save account!"></Button>
</div>