import { relayCounterInLastNBlock } from "./useCases/relayCounterInLastNBlock/relayCounterInLastNBlock";
import { retrieveLastBockHeight } from "./useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { generateLavaClient } from "./utils/LavaClient";

const pollingTime = 1000 * 60 * 5; // Every 5 minutes

const poll = async (fn: () => Promise<any>) => {
    await fn();
    setTimeout(() => poll(fn), pollingTime);
}

async function init() {
    try {
        const lavaClient = await generateLavaClient({
            chainID: 'LAV1',
            rpcInterface: 'tendermintrpc'
        });
        poll(async () => {
            const res = await relayCounterInLastNBlock(
                lavaClient,
                await retrieveLastBockHeight(lavaClient)
            );
            console.log(res.slice(0, 10)); // Replace by an event in the future
        });
    } catch (e) {
        console.log(e)
    }
};

init();