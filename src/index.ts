import { relayCounterInLastNBlock } from "./useCases/relayCounterInLastNBlock/relayCounterInLastNBlock";
import { retrieveLastBockHeight } from "./useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { generateLavaClient } from "./utils/LavaClient";

async function init() {
    const lavaClient = await generateLavaClient({
        chainID: 'LAV1',
        rpcInterface: 'tendermintrpc'
    })
    const res = await relayCounterInLastNBlock(
        lavaClient,
        await retrieveLastBockHeight(lavaClient)
    );
    console.log(res.slice(0, 10))
}

init();