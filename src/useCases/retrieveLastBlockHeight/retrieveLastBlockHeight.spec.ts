import { LavaGateway } from "../../utils/lavaGateway";
import { lavaBlockchainResponse } from "./lavaBlockchainResponse.stub";
import { retrieveLastBockHeight } from "./retrieveLastBlockHeight";


describe("sandbox", () => {
    it("retrieve last block height", async () => {
        const lavaGatewayStub = {
            sendRelay: () => JSON.stringify(lavaBlockchainResponse)
        } as unknown as LavaGateway;
        let res = await retrieveLastBockHeight(lavaGatewayStub);
        expect(res).toEqual(309490);
    })
})