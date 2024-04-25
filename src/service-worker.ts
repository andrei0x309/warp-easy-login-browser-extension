import { AUTH_SUCCESS, NO_WALLET, SIG_DENIED, NO_AUTH_TOKEN  } from './client/messges'
import { getUrl, createRandomMessageId } from './lib/utils'


 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Service Worker received message:', request)
  const { type } = request
  const iconUrl = getUrl('src/assets/images/icon128.png')
  const messageId = createRandomMessageId()
  switch (type) {
    case AUTH_SUCCESS:
      chrome.notifications.create('auth-success', {
        type: 'basic',
        iconUrl,
        title: 'Warp Easy Login',
        message: 'Authentication successful!\nMessage ID: ' + messageId
      });
      break;
    case NO_WALLET:
      chrome.notifications.create('no-wallet', {
        type: 'basic',
        iconUrl,        
        title: 'Warp Easy Login',
        message: 'No wallet found, please install ClearWallet or MetaMask or other supported wallet.\nMessage ID: ' + messageId
      });
      break;
    case SIG_DENIED:
      chrome.notifications.create('sig-denied', {
        type: 'basic',
        iconUrl,
        title: 'Warp Easy Login',
        message: 'Signature denied, please sign the message to authenticate.\nMessage ID: ' + messageId
      });
      break;
    case NO_AUTH_TOKEN:
      chrome.notifications.create('no-auth-token', {
        type: 'basic',
        iconUrl,
        title: 'Warp Easy Login',
        message: 'Failed to generate auth token, please sign with the address that owns your FID, if you don\'t have that address, import it to your wallet from warpcast.\nMessage ID: ' + messageId
      });
      break;
    default:
      break;
}

})

console.info('Service Worker Loaded')
