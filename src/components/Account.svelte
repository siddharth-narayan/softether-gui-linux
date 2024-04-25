<script lang="ts">
    // import settings from "../settings.json"
    export let accountName: string;
    export let username: string;
    export let hostname: string;
    export let port: number;
</script>

<div class="flex p-8 gap-8 items-center justify-center w-full">
    <b class="w-1/5 text-text">{accountName}</b>
    <div>
        <p>Username: {username}</p>
        <p>Hostname: {hostname}</p>
        <p>Port: {port}</p>
    </div>
</div>