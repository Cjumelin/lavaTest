import { useEffect, useState } from "react";
import { RelayCount, relayCounterInBlocks } from "../../useCases/relayCounterInLastNBlock/relayCounterInLastNBlock";
import { useLast20Blocks } from "./useLast20Blocks";

export const useRelayCountPerChain = () => {

    const [
        isRelayCountLoading,
        setIsRelayCountLoading
    ] = useState(true);
    const [
        relayCountPerChain,
        setRelayCountPerChain
    ] = useState<RelayCount[]>([]);

    const { last20blocks, lastBlockHeight } = useLast20Blocks();

    useEffect(() => {
        setIsRelayCountLoading(true)
    }, [lastBlockHeight]);

    useEffect(() => {
        if (last20blocks.length) { // avoid first render
            setRelayCountPerChain(
                relayCounterInBlocks(last20blocks) // Count the number of relays per chain in the given blocks
                    .slice(0, 10)); // Get the top 10
            setIsRelayCountLoading(false)
        }
    }, [last20blocks]);

    return {
        relayCountPerChain,
        isRelayCountLoading,
        lastBlockHeight
    }
}