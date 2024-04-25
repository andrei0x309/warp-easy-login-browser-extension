import type { Tab, T_DEFAULT_OPTIONS } from '../types';

export const DEFAULT_OPTIONS = {
  theme: 'dark',
} as T_DEFAULT_OPTIONS;


export const getStorageData = (key: string): Promise<any> =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, (result) => (chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result))),
  );

export const setStorageData = (data: Record<string, unknown>): Promise<void | Error> =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () => (chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve())),
  );

export const setLastTab = async (lastTab: Tab) => {
  await setStorageData({ lastTab });
};

export const getLastTab = async () => {
  const data = await getStorageData('lastTab');
  return data?.lastTab as Tab || {} as Tab
};

export const setOptions = async (options: T_DEFAULT_OPTIONS) => {
  await setStorageData({ options });
};

export const getOptions = async () => {
  const data = await getStorageData('options');
  return data?.options || DEFAULT_OPTIONS;
};

export const setDefaultOptions = async () => {
  const options = await getOptions();
  if (options?.activeProxy?.type) {
    return;
  }
  await setOptions(DEFAULT_OPTIONS);
};

export const getUrl = (url: string) => chrome.runtime.getURL(url)

export const createRandomMessageId = () => Math.random().toString(36).substring(7);
