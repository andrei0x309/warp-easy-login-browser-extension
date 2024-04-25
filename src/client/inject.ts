// @ts-nocheck

window.addEventListener('message', async (event) => {
    if (event.source !== window) {
        return;
    }
    
    if (event.data.type && event.data.type === 'warp-login') {

        if(!hasEthWallet()) {
            window.postMessage({ type: NO_WALLET }, '*');
        } else {
            const result = await generateApiToken();
            window.postMessage({ type: result.data}, '*');
            if (result.success) {
                window.location.reload();
            }
        }
    }

});