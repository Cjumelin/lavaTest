import { LavaSDK } from "@lavanet/lava-sdk";
import { getBlockchain } from "../../utils/LavaClient";

export const retrieveLastBockHeight =
    async (lavaClient: LavaSDK) => {
        const res = await getBlockchain(lavaClient)();
        return parseInt(res.last_height);
    }