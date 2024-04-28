<script>
	import AccountCreatePage from "./components/AccountCreatePage.svelte";
	import SettingsPage from "./components/SettingsPage.svelte";
	import AccountsPage from "./components/AccountsPage.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	
	// import "./styles.css"
</script>

<main class="bg-background flex gap-4 p-8">
	<Sidebar></Sidebar>
	<!-- <SettingsPage></SettingsPage> -->
	<!-- <AccountCreatePage></AccountCreatePage> -->
	<div class="flex flex-col gap-8">
		<AccountCreatePage></AccountCreatePage>
		<AccountsPage></AccountsPage>
		<!-- <SettingsPage></SettingsPage> -->
	</div>
	
</main>