import { LavaSDK } from "@lavanet/lava-sdk";
import { BlockList, BlockListState } from "./useCases/relayCounterInLastNBlock/blockList";
import { retrieveLastBockHeight } from "./useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { generateLavaClient, getBlocks } from "./utils/LavaClient";
import { poll } from "./utils/polling";

interface BlockListApiGateway {
    retrieveLastBlockHeight: () => Promise<number>,
    retrieveBlocks: (blocks: any[], lastHeight: number) => Promise<any[]>,
}

const initBlockListApiGateway = (lavaClient: LavaSDK): BlockListApiGateway => ({
    retrieveBlocks: async function (blocks: any[], lastHeight: number) {
        let res = await getBlocks(lavaClient)(
            lastHeight,
            blocks.length ?
                1 : // retrieve the last block if blocks have been retrieved
                20, // retrieve the last 20 blocks if blocks havn't been retrieved
        );
        return [
            ...res.blocks,
            ...blocks
        ].slice(0, 20)
    },
    retrieveLastBlockHeight: async () => await retrieveLastBockHeight(lavaClient),

})

const showResult = ({ lastBlockHeight, countRelayPerChain }: BlockListState) => {
    if (countRelayPerChain.length === 0)
        console.log("No transaction of type \"/lavanet.lava.pairing.MsgRelayPayment\"")
    console.log(`Last block height: ${lastBlockHeight}`);
    console.log("Top 10 chain sorted by number of relay\n", countRelayPerChain.slice(0, 10), "\n");
}

async function init() {
    const lavaClient = await generateLavaClient({
        chainID: 'LAV1',
        rpcInterface: 'tendermintrpc'
    });
    let blockListApiGateway = initBlockListApiGateway(lavaClient);
    let blockList: BlockList = new BlockList([], 0);
    poll(async () => {
        try {
            const lastHeight = await blockListApiGateway.retrieveLastBlockHeight();
            if (lastHeight !== blockList.state.lastBlockHeight) {
                blockList = new BlockList(
                    await blockListApiGateway.retrieveBlocks(
                        blockList.state.blocks,
                        lastHeight
                    ),
                    lastHeight
                );
                showResult(blockList.state);
            }
        } catch (e) {
            console.log(e);
            blockList = new BlockList([], 0); // reset value adn retry in case of error (e.g: -32603 => Code::InternalError)
        }
    }, 1000);
};

init();