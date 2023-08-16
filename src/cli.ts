import { BlockList, BlockListState } from "./useCases/relayCounterInLastNBlock/blockList";
import { retrieveLastBockHeight } from "./useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { generateLavaGateway } from "./utils/lavaGateway";
import { poll } from "./utils/polling";

const showResult = ({ lastBlockHeight, countRelayPerChain }: BlockListState) => {
    if (countRelayPerChain.length === 0)
        console.log("No transaction of type \"/lavanet.lava.pairing.MsgRelayPayment\"")
    console.log(`Last block height: ${lastBlockHeight}`);
    console.log("Top 10 chain sorted by number of relay\n", countRelayPerChain.slice(0, 10), "\n");
}

async function init() {
    const lavaGateway = await generateLavaGateway({
        chainID: 'LAV1',
        rpcInterface: 'tendermintrpc'
    });
    let blockList: BlockList = new BlockList([], 0);
    poll(async () => {
        try {
            const lastHeight = await retrieveLastBockHeight(lavaGateway);
            if (lastHeight !== blockList.state.lastBlockHeight) {
                blockList = new BlockList(
                    await lavaGateway.getBlocks(
                        lastHeight,
                        blockList.state.blocks.length ?
                            1 : // retrieve the last block if blocks have been retrieved
                            20, // retrieve the last 20 blocks if blocks havn't been retrieved
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