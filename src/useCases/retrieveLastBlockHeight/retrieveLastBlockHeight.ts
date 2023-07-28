import { LavaSDK } from "@lavanet/lava-sdk";
import { getBlockchain } from "../../utils/LavaClient";

export const retrieveLastBockHeight =
    async (lavaClient: LavaSDK) => {
        const blockchain = await getBlockchain(lavaClient)();
        return parseInt(blockchain.result.last_height);
    }