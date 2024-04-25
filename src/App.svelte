<script>
	export let name;
	import AccountCreatePage from "./components/AccountCreatePage.svelte";
	import SettingsPage from "./components/SettingsPage.svelte";
	import AccountsPage from "./components/AccountsPage.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	
	import "./styles.css"
</script>

<main class="bg-background flex gap-4 p-8">
	<Sidebar></Sidebar>
	<!-- <SettingsPage></SettingsPage> -->
	<!-- <AccountCreatePage></AccountCreatePage> -->
	<AccountsPage></AccountsPage>
</main>

<style>

</style>