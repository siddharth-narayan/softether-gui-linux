<script>
	import AccountCreatePage from "./components/AccountCreatePage.svelte";
	import SettingsPage from "./components/SettingsPage.svelte";
	import AccountsPage from "./components/AccountsPage.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	
	let rerender = false;
	// import "./styles.css"
</script>

<main class="bg-background flex gap-4 p-8">
	<Sidebar></Sidebar>
	<!-- <SettingsPage></SettingsPage> -->
	<!-- <AccountCreatePage></AccountCreatePage> -->
	<div class="flex flex-col gap-8">
		<AccountCreatePage bind:rerender={rerender}></AccountCreatePage>
		{#key rerender}
			<AccountsPage></AccountsPage>
		{/key}
	</div>
	
</main>