<script>
    import SidebarComponent from "./SidebarComponent.svelte";

    export let pageIndex;

    function pageSwitch(index) {
        pageIndex = index
        console.log("New page index: " + index)
    }

    let index = 0
    function indexf(){
        return index++
    }
</script>
<div class="bg-primary gap-8 p-8 flex flex-col">
    <SidebarComponent iconUrl={"src/assets/person_add_icon.png"} hoverText={"Add an Account"} index={indexf()} {pageSwitch}></SidebarComponent>
    <SidebarComponent iconUrl={"src/assets/person_icon.png"} hoverText={"Accounts"} index={indexf()} {pageSwitch}> </SidebarComponent>
    <SidebarComponent iconUrl={"src/assets/setting_icon.png"} hoverText={"Settings"} index={indexf()} {pageSwitch}></SidebarComponent>
</div>