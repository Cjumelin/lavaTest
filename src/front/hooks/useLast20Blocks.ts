import { useCallback, useEffect, useState } from "react";
import { retrieveLastBockHeight } from "../../useCases/retrieveLastBlockHeight/retrieveLastBlockHeight";
import { getBlocks } from "../../utils/LavaClient";
import { poll } from "../../utils/polling";
import { useLavaClient } from "./useLavaClient";

export const useLast20Blocks = () => {

    const lavaClient = useLavaClient()

    const [lastBlockHeight, setLastBlockHeight] = useState<number>(0);
    const [last20blocks, setLast20Blocks] = useState<any[]>([])
    const startPolling = useCallback(async () => { // Poll block height every 20 seconde
        poll(async () => {
            let lastBlockHeightRes = await retrieveLastBockHeight(lavaClient!) // tender mint rpc call to retrieve the last block height
            if (lastBlockHeight !== lastBlockHeightRes)
                setLastBlockHeight(lastBlockHeightRes); // set new block height if different from block height stored in react
        });
    }, [lastBlockHeight, lavaClient])

    useEffect(() => {
        if (lavaClient)
            startPolling(); // after lavaClient instanciation
    }, [lavaClient, startPolling]);

    const resetPolling = useCallback(() => {
        setLastBlockHeight(0);
        setLast20Blocks([]);
    }, [])

    const retrieveLastNBlock = useCallback(async () => {
        let res: any;
        try {

            res = await getBlocks(lavaClient!)(
                lastBlockHeight,
                last20blocks.length ?
                    1 : // retrieve the last block if blocks have been retrieved
                    20, // retrieve the last 20 blocks if blocks havn't been retrieved
            );
        } catch (e) {
            resetPolling();
        }
        setLast20Blocks([
            ...res.blocks,
            ...last20blocks
        ].slice(0, 20))
    }, [last20blocks, lastBlockHeight, lavaClient, resetPolling])

    useEffect(() => {
        if (lastBlockHeight) { // avoid first render
            retrieveLastNBlock(); // retrieve last 20 block
        }
    }, [lastBlockHeight, retrieveLastNBlock]);


    return { last20blocks, lastBlockHeight }
}