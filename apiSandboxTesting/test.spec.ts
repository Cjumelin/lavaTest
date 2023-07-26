import { AvailableNetwork, networks, relayCountInLast20Block } from "./apiSandbox";
import { osmosisBlockchainMethodStub } from "./apiStub/osmosisBlochainMethodResult.stub";

describe("sandbox", () => {
    it("retrieve txs count of osmosis", async () => {
        let res = await relayCountInLast20Block
            // (generateRPCConnection)
            (async () => osmosisBlockchainMethodStub)
            (networks[AvailableNetwork.osmosis]);
        expect(res).toEqual(54);
    })
})