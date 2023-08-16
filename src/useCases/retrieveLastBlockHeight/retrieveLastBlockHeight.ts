import { LavaGateway } from "../../utils/lavaGateway";

export const retrieveLastBockHeight =
    async (lavaGateway: LavaGateway) => {
        const res = await lavaGateway.getBlockchain();
        return parseInt(res.last_height);
    }