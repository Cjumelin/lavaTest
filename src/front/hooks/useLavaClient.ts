import { LavaSDK } from "@lavanet/lava-sdk";
import { useCallback, useEffect, useState } from "react";
import { generateLavaClient } from "../../utils/LavaClient";

export const useLavaClient = () => {
    const [lavaClient, setLavaClient] = useState<LavaSDK>();
    const initLavaClient = useCallback(async () => {
        const lavaClient = await generateLavaClient({
            chainID: 'LAV1',
            rpcInterface: 'tendermintrpc'
        })
        setLavaClient(lavaClient)
    }, [])

    useEffect(() => {
        // Create Lava SDK instance once
        if (!lavaClient)
            initLavaClient()
    }, [lavaClient, initLavaClient])

    return lavaClient
}
