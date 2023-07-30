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
        let blocks: any[] = [];
        let lastBlockHeight: number = -1;
        poll(async () => {
            try {
                const lastBlockHeightRes = await retrieveLastBockHeight(lavaClient);
                if (lastBlockHeightRes !== lastBlockHeight) {
                    lastBlockHeight = lastBlockHeightRes;
                    const newBlocks = await getBlocks(lavaClient)(
                        lastBlockHeightRes,
                        blocks.length ? 1 : 20
                    );
                    blocks = [
                        ...newBlocks.blocks, // retrieve the last block if blocks have already been retrieved
                        ...blocks
                    ].slice(0, 20)
                    const relayCountPerChain = relayCounterInBlocks(
                        blocks
                    );
                    console.log(relayCountPerChain.slice(0, 10));
                }
            } catch (e) {
                console.log(e)
            }
        }, 1000);
    } catch (e) {
        console.log(e)
    }
};

init();