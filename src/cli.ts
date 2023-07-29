import { relayCounterInLastNBlock } from "./useCases/relayCounterInLastNBlock/relayCounterInLastNBlock";
import { retrieveLastBockHeight } from "./useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { generateLavaClient } from "./utils/LavaClient";
import { poll } from "./utils/polling";

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
            console.log(res.slice(0, 10));
        });
    } catch (e) {
        console.log(e)
    }
};

init();