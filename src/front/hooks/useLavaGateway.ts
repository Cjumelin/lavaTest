import { useCallback, useEffect, useState } from "react";
import { LavaGateway, generateLavaGateway } from "../../utils/lavaGateway";

export const useLavaGateway = () => {
    const [lavaGateway, setLavaGateway] = useState<LavaGateway>();
    const initLavaGateway = useCallback(async () => {
        const lavaGateway = await generateLavaGateway({
            chainID: 'LAV1',
            rpcInterface: 'tendermintrpc'
        })
        setLavaGateway(lavaGateway)
    }, [])

    useEffect(() => {
        // Create Lava gateway instance once
        if (!lavaGateway)
            initLavaGateway()
    }, [lavaGateway, initLavaGateway])

    return lavaGateway
}
