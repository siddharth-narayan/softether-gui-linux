<script>
	import AccountCreatePage from "./components/AccountCreatePage.svelte";
	import SettingsPage from "./components/SettingsPage.svelte";
	import AccountsPage from "./components/AccountsPage.svelte";
	import Sidebar from "./components/Sidebar.svelte";

	let pageIndex = 0
</script>

<main class="bg-background flex gap-4 p-4 h-full">
	<Sidebar bind:pageIndex={pageIndex}></Sidebar>
	{#key pageIndex}
		{#if pageIndex === 0}
			<AccountCreatePage></AccountCreatePage>
		{/if}
		{#if pageIndex === 1}
			<AccountsPage></AccountsPage>
		{/if}
		{#if pageIndex === 1}
			<!-- <SettingsPage></SettingsPage> -->
		{/if}
		
	{/key}
</main>