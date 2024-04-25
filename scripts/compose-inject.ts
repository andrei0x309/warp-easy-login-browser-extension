const compose_inject = async () => {
    const fs = await import('fs')
    const thirdPartyDeps = fs.readFileSync('src/client/inject-parts/third-party-deps.ts').toString();
    const own_deps = fs.readFileSync('src/client/inject-parts/own-deps.ts').toString();
    const injectScript = fs.readFileSync('src/client/inject.ts').toString();
    const injectComposed = `${thirdPartyDeps}\n${own_deps}\n${injectScript}`;
    fs.writeFileSync('src/client/inject-composed.ts', injectComposed);
    console.log('Composed inject script');
    }

(async () => {
    await compose_inject()
})();
