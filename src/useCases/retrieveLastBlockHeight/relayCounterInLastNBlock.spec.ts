import { LavaSDK } from "@lavanet/lava-sdk";
import { lavaBlockchainResponse } from "../retrieveLastBlockHeight/lavaBlockchainResponse.stub";
import { retrieveLastBockHeight } from "../retrieveLastBlockHeight/retrieveLastBlockHeight";


describe("sandbox", () => {
    it("retrieve last block height", async () => {
        const lavaClientStub = {
            sendRelay: () => JSON.stringify(lavaBlockchainResponse)
        } as unknown as LavaSDK;
        let res = await retrieveLastBockHeight(lavaClientStub);
        expect(res).toEqual(309490);
    })
})