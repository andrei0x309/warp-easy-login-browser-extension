<script lang="ts">
    export let isActive = false;

    const navigdateTo = (url: string) => {
        chrome.tabs.create({ url });
    }

</script>


<div id="tab-2" class="{`tab-pane ${isActive ? 'active' : ''}`} dark:text-gray-100 text-gray-800" style="font-size: 1rem; text-align: left;">
    <br />
    This extension alows you to login to <a style="color: blueviolet;" on:click={() => { navigdateTo('https://warpcast.com')}} href="#link1">warpcast.com</a> without needing a mobile device.
    <br /><br />
    Being forced to use a mobile device is not the web3 way, you should be allowed to use any wallet or device you wish to use.
    <br /><br />
    This extension is open-source and the source can be found on GitHub here: <a style="color: blueviolet;" on:click={() => {
    navigdateTo('https://github.com/andrei0x309/warp-easy-login-browser-extension')
    }} href="#link1">Repo Link</a>
</div>