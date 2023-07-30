import { LavaSDK } from "@lavanet/lava-sdk";
import { useEffect, useState } from "react";
import { RelayCount, relayCounterInBlocks } from "../../useCases/relayCounterInLastNBlock/relayCounterInLastNBlock";
import { retrieveLastBockHeight } from "../../useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { generateLavaClient, getBlocks } from "../../utils/LavaClient";
import { poll } from "../../utils/polling";

export const useRelayCountPerChain = () => {

    const [lavaClient, setLavaClient] = useState<LavaSDK>();
    const [isRelayCountLoading, setIsRelayCountLoading] = useState(true);
    const [relayCountPerChain, setRelayCountPerChain] = useState<RelayCount[]>([]);
    const [last20blocks, setLast20Blocks] = useState<any[]>([])
    const [lastBlockHeight, setLastBlockHeight] = useState<number>(0);

    const initLavaClient = async () => {
        const lavaClient = await generateLavaClient({
            chainID: 'LAV1',
            rpcInterface: 'tendermintrpc'
        })
        setLavaClient(lavaClient)
    }

    useEffect(() => {
        if (lavaClient)
            startPolling(); // after lavaClient instanciation
        else
            initLavaClient(); // Create Lava SDK instance
    }, [lavaClient])

    const startPolling = async () => { // Poll block height every 20 seconde
        poll(async () => {
            let lastBlockHeightRes = await retrieveLastBockHeight(lavaClient!) // tender mint rpc call to retrieve the last block height
            if (lastBlockHeight !== lastBlockHeightRes)
                setLastBlockHeight(lastBlockHeightRes); // set new block height if different from block height stored in react
        });
    }

    useEffect(() => {
        if (lastBlockHeight) { // avoid first render
            setIsRelayCountLoading(true) // Show loader to not leave invalide data on the table
            retrieveLastNBlock(); // retrieve last 20 block
        }
    }, [lastBlockHeight])

    const getNUnwrappedBlock = async (blockNumber: number): Promise<any[]> => // unwrappe response from lava SDK
        (await getBlocks(lavaClient!)(lastBlockHeight, blockNumber)).blocks; //  tender mint rpc call to retrieve the last N blocks


    const retrieveLastNBlock = async () => {
        if (!last20blocks.length) {
            setLast20Blocks(await getNUnwrappedBlock(20)); // Retrieve last 20 block if none have been retrieved yet
        } else {
            setLast20Blocks([
                (await getNUnwrappedBlock(1))[0], // retrieve the last block if blocks have already been retrieved
                ...last20blocks
            ].slice(0, 20))
        }
    }

    useEffect(() => {
        if (last20blocks.length) { // avoid first render
            setRelayCountPerChain(
                relayCounterInBlocks(last20blocks) // Count the number of relays per chain in the given blocks
                    .slice(0, 10)); // Get the top 10
            setIsRelayCountLoading(false)
        }
    }, [last20blocks])

    return {
        relayCountPerChain,
        isRelayCountLoading,
        lastBlockHeight
    }
}