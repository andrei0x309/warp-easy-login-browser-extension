// @ts-nocheck

function getBytes(value: string | Uint8Array): Uint8Array {
    if (value instanceof Uint8Array) {
        return value;
    }

    if (typeof(value) === "string" && value.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
        const result = new Uint8Array((value.length - 2) / 2);
        let offset = 2;
        for (let i = 0; i < result.length; i++) {
            result[i] = parseInt(value.substring(offset, offset + 2), 16);
            offset += 2;
        }
        return result;
    }
    throw new Error("invalid bytes");
}


function serialize (object: any) {
    if (typeof object === 'number' && isNaN(object)) {
      throw new Error('NaN is not allowed');
    }
  
    if (typeof object === 'number' && !isFinite(object)) {
      throw new Error('Infinity is not allowed');
    }
  
    if (object === null || typeof object !== 'object') {
      return JSON.stringify(object);
    }
  
    if (object.toJSON instanceof Function) {
      return serialize(object.toJSON());
    }
  
    if (Array.isArray(object)) {
      const values: any = object.reduce((t, cv, ci) => {
        const comma = ci === 0 ? '' : ',';
        const value = cv === undefined || typeof cv === 'symbol' ? null : cv;
        return `${t}${comma}${serialize(value)}`;
      }, '');
      return `[${values}]`;
    }
  
    const values: any = Object.keys(object).sort().reduce((t, cv) => {
      if (object[cv] === undefined ||
          typeof object[cv] === 'symbol') {
        return t;
      }
      const comma = t.length === 0 ? '' : ',';
      return `${t}${comma}${serialize(cv)}:${serialize(object[cv])}`;
    }, '');
    return `{${values}}`;
  };

function createWarpMessage (data: any) {
    return { message: serialize(data) }
  }

const ethGetAddress = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return {
        success: true,
        data: accounts[0]
      }
    } catch (e) {
      return {
        success: false,
        error: e
      }
    }
  }

// async function ethTypeSign (address:string, data: string) {
//     try {
//     const sig = await window.ethereum.request({
//          method: 'eth_signTypedData_v4',
//          params: [address, data]
//       })
//     return {
//         success: true,
//         data: sig
//     }
//     } catch (e) {
//     return {
//         success: false,
//         error: e
//      }
//     }   
//   }

async function ethSignMessage (address:string, data: string) {
    try {
    const sig = await window.ethereum.request({
         method: 'personal_sign',
         params: [data, address]
      })
    return {
        success: true,
        data: sig
    }
    } catch (e) {
    return {
        success: false,
        error: e
     }
    }   
  }

const NO_WALLET = 'NO_WALLET'
const SIG_DENIED = 'SIG_DENIED'
const NO_AUTH_TOKEN = 'NO_AUTH_TOKEN'
const AUTH_SUCCESS = 'AUTH_SUCCESS'

type T_IDDB_VALUE = {
    secret: string;
    expiresAt: number;
}

const EIP_191_PREFIX = "eip191:";
const WARPCAST_API = 'https://client.warpcast.com/v2'


const hasEthWallet = () => {
    return !!window?.ethereum?.request
}

type T_RESULT_GEN_AUTH_TOKEN = {
    success: boolean;
    data: SIG_DENIED  | NO_AUTH_TOKEN | AUTH_SUCCESS | NO_WALLET ;
}


const generateApiToken = async (): Promise<T_RESULT_GEN_AUTH_TOKEN> => {
    try {
 
        const timestamp = Date.now();
        const payload = {
            method: "generateToken",
            params: {
                timestamp,
                expiresAt: 1777046287381
            },
        };
        const msgToSign = createWarpMessage(payload);

        const { success, data } = await ethGetAddress();
        if (!success) {
            return { success: false, data: NO_WALLET }
        }

        const address = data as string;
        const { success: sigSuccess, data: sig } = await ethSignMessage(address, msgToSign.message);

        if (!sigSuccess) {
            return { success: false, data: SIG_DENIED }
        }

        const Buffer = bufferLib.Buffer;

        const sigBase64 = Buffer.from(getBytes(sig)).toString('base64');
        const cusAuth = EIP_191_PREFIX + sigBase64

        const req = await fetch(`${WARPCAST_API}/auth`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cusAuth}`,
            },
            body: JSON.stringify(payload),
        });


        if (req.ok) {
            const data = await req.json();
            const token = data?.result?.token?.secret;
            if (token) {
                await addWarpAuthToken({ secret: token, expiresAt: 1777046287381 });
                return { success: true, data: AUTH_SUCCESS }
            }
            return { success: false, data: NO_AUTH_TOKEN }
        }
        return { success: false, data: NO_AUTH_TOKEN }
    } catch (error) {
        console.error('Failed to generate api token', error)
        return { success: false, data: NO_AUTH_TOKEN}
    }
}


const addWarpAuthToken = async (value: T_IDDB_VALUE):  Promise<unknown> => {
    const dbName = 'localforage'
    const storeName = 'keyvaluepairs'
    const key = 'auth-token'
    const version = 2
    let resolve = (a = false) => {}
    const result = new Promise((res) => {
        resolve = res
    })

    try {
      const dbRequest = indexedDB.open(dbName, version);
  
      dbRequest.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        db.createObjectStore(storeName);
      };
  
      dbRequest.onsuccess = (event: any) => {
  
      const db = dbRequest.result
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
  
      const request = store.put(value, key);

      request.onsuccess = (event: any) => {
        console.log("Successfully added data:", event.target.result);
        resolve?.()
        }

        request.onerror = (event: any) => {
        console.error("Error adding data:", event.target.error);
        resolve?.()
        }

      };
  
      dbRequest.onerror = (event: any) => {
        console.error("Error adding data:", event.target.error);
        resolve?.()
      };
  
     
    } catch (error) {
      console.error("Error accessing IndexedDB:", error);
      resolve?.()
    }
    return result
  }