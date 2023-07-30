import { LavaSDK } from "@lavanet/lava-sdk";
import { RelayCount, relayCounterInBlocks } from "./useCases/relayCounterInLastNBlock/relayCounterInLastNBlock";
import { retrieveLastBockHeight } from "./useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { generateLavaClient, getBlocks } from "./utils/LavaClient";
import { poll } from "./utils/polling";

type Block = any

type BlockList = {
    lastBlockHeight: number,
    blocks: Block[],
    relayCountPerChain: RelayCount[],
    retrieveLastBlockHeight: () => Promise<number>,

    // side effect notice by returning void
    refreshBlocks: (...args: any[]) => Promise<void>,
    updateRelayCountPerChain: () => void
}

const blockListCreator = (lavaClient: LavaSDK): BlockList => ({
    lastBlockHeight: 0,
    blocks: [],
    relayCountPerChain: [],
    refreshBlocks: async function () {
        let res = await getBlocks(lavaClient)(
            this.lastBlockHeight,
            this.blocks.length ?
                1 : // retrieve the last block if blocks have been retrieved
                20, // retrieve the last 20 blocks if blocks havn't been retrieved
        );
        this.blocks = [
            ...res.blocks,
            ...this.blocks
        ].slice(0, 20)
    },
    retrieveLastBlockHeight: async () => await retrieveLastBockHeight(lavaClient),
    updateRelayCountPerChain: function () {
        this.relayCountPerChain = relayCounterInBlocks(this.blocks);
    }
})

const updateBlockList = async (blockList: BlockList, newBlockHeight: number) => {
    blockList.lastBlockHeight = newBlockHeight;
    await blockList.refreshBlocks() // refresh block list with the last 20 blocks
    const relayCountPerChain = relayCounterInBlocks(
        blockList.blocks
    );
}
const showResult = ({ lastBlockHeight, relayCountPerChain }: BlockList) => {
    if (relayCountPerChain.length === 0)
        console.log("No transaction of type \"/lavanet.lava.pairing.MsgRelayPayment\"")
    console.log(`Last block height: ${lastBlockHeight}`);
    console.log("Top 10 chain sorted by number of relay\n", relayCountPerChain.slice(0, 10), "\n");
}

async function init() {
    const lavaClient = await generateLavaClient({
        chainID: 'LAV1',
        rpcInterface: 'tendermintrpc'
    });
    let blockList = blockListCreator(lavaClient);
    poll(async () => {
        try {
            const lastBlockHeightRes = await blockList.retrieveLastBlockHeight()
            if (lastBlockHeightRes !== blockList.lastBlockHeight) {
                await updateBlockList(blockList, lastBlockHeightRes);
                showResult(blockList)
            }
        } catch (e) {
            console.log(e)
            blockList = blockListCreator(lavaClient); // reset value adn retry in case of error (e.g: -32603 => Code::InternalError)
        }
    }, 1000);
};

init();