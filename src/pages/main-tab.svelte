
<script lang="ts">
    import Alert from '@/components/alert.svelte'

    export let isActive = false;
    const targetUrl = 'warpcast.com'
    let isVerifyingProxy = false;
    let alert: any & { showAlert: (msg: string, type: 'warning' | 'success' | 'danger' | 'info') => void };

    const promptForSignIn = async () => {

    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      const lastTab = tabs[0];

        if(!lastTab) {
            alert.showAlert('No active tab found', 'danger')
            return;
        }

        if(!lastTab?.url?.includes(targetUrl)) {
            alert.showAlert('You are not on warpcast.com page', 'danger')
            return;
        }
        if(!lastTab.id) {
            alert.showAlert('No active tab found', 'danger')
            return;
        }

        chrome.scripting.executeScript({
            target: {tabId: lastTab.id},
            func: () => {
                window.postMessage({type: 'warp-login'}, '*');
            }
        })

        window.close();
    });



    }

    $: {
    }
   

</script>


<div id="tab-1" class="{`tab-pane ${isActive ? 'active' : ''} ${ isVerifyingProxy ? 'blink' : ''}`}">

    <Alert bind:this={alert} alertMsg="" alertType="warning" alertVisible={false} alertTimeout={0} />

    
    <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Before Login:</h2>
    <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400 text-left text-[1.1rem]">
        <li class="flex items-center" style="margin-bottom: 1rem;">
            <svg class="w-3.5 h-3.5 me-2 text-purple-500 dark:text-purple-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
             </svg>
             Your active tab should be on warpcast.com.
        </li>
        <li class="flex items-center" style="margin-bottom: 1rem;">
            <svg class="w-3.5 h-3.5 me-2 text-purple-500 dark:text-purple-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
             </svg>
             You need an Ethereum wallet, ClearWallet & Metamask, were tested.
        </li>
        <li class="flex items-center" style="margin-bottom: 1rem;">
            <svg class="w-3.5 h-3.5 me-2 text-purple-500 dark:text-purple-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
             </svg>
             You need to sign the message with the address that owns your FID.
        </li>
        <li class="flex items-center" style="margin-bottom: 1rem;">
          <svg class="w-3.5 h-3.5 me-2 text-purple-500 dark:text-purple-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
           </svg>
           If you don't have the address that owns your FID, it's necessary to import it to your wallet.
      </li>
    </ul>

    <button on:click={
      () => {
        promptForSignIn();
      }
  } class="btn btn-green" style="margin-bottom: 1rem;" id="btnProxyStart">Request Wallet Login</button>

  </div>

  <style lang="scss">

.blink {
    animation: blinker 1s linear infinite;
    cursor: wait;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}


  </style>