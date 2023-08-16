import { useEffect, useState } from "react";
import { BlockList, BlockListState } from "../../useCases/relayCounterInLastNBlock/blockList";
import { useLast20Blocks } from "./useLast20Blocks";

export const useBlockList = () => {
    const [
        isBlockListLoading,
        setIsBlockListLoading
    ] = useState(true);
    const [
        blockListState,
        setBlockListState
    ] = useState<BlockListState>(new BlockList([], 0).state);

    const { last20blocks, lastBlockHeight, errors, setErrors } = useLast20Blocks();

    useEffect(() => {
        setIsBlockListLoading(true)
    }, [lastBlockHeight]);

    useEffect(() => {
        if (last20blocks.length) { // avoid first render
            setBlockListState(
                new BlockList(
                    last20blocks,
                    lastBlockHeight
                ).state // Count the number of relays per chain in the given blocks
            ); // Get the top 10
            setIsBlockListLoading(false)
        }
    }, [last20blocks]);

    return {
        blockListState,
        isBlockListLoading,
        errors,
        setErrors
    }
}