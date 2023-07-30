import { relayCounterInBlocks } from "./useCases/relayCounterInLastNBlock/relayCounterInLastNBlock";
import { retrieveLastBockHeight } from "./useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { generateLavaClient, getBlocks } from "./utils/LavaClient";
import { poll } from "./utils/polling";

async function init() {
    try {
        const lavaClient = await generateLavaClient({
            chainID: 'LAV1',
            rpcInterface: 'tendermintrpc'
        });
        poll(async () => {
            let res: any;
            try {
                res = await getBlocks(lavaClient)(await retrieveLastBockHeight(lavaClient), 20)
            } catch (e) {
                console.log(e)
            }
            const relayCountPerChain = relayCounterInBlocks(
                res.blocks
            );
            console.log(relayCountPerChain.slice(0, 10));
        });
    } catch (e) {
        console.log(e)
    }
};

init();