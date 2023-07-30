import { lavaBlockSearchResponse } from "./lavaBlockSearchResponse.stub";
import { relayCounterInBlocks } from "./relayCounterInLastNBlock";

describe("sandbox", () => {
    it("retrieve number in relay in the last 20 block of lavachain", async () => {
        let res = await relayCounterInBlocks(
            lavaBlockSearchResponse.result.blocks,
        );
        expect(res).toEqual([
            { name: 'ETH1', count: '23490' },
            { name: 'POLYGON1', count: '12511' },
            { name: 'EVMOS', count: '10443' },
            { name: 'GTH1', count: '4655' },
            { name: 'CELO', count: '3168' },
            { name: 'ARB1', count: '3158' },
            { name: 'AVAX', count: '3099' },
            { name: 'COS3', count: '2454' },
            { name: 'OPTM', count: '1986' },
            { name: 'POLYGON1T', count: '397' },
            { name: 'FTM250', count: '368' },
            { name: 'LAV1', count: '316' },
            { name: 'CANTO', count: '90' },
            { name: 'APT1', count: '45' },
            { name: 'JUNT1', count: '29' },
            { name: 'COS4', count: '18' },
            { name: 'FVM', count: '14' },
            { name: 'STRK', count: '14' },
            { name: 'SOLANAT', count: '14' },
            { name: 'ARBN', count: '14' },
            { name: 'BASET', count: '9' },
            { name: 'EVMOST', count: '5' },
            { name: 'ALFAJORES', count: '3' },
            { name: 'JUN1', count: '3' },
            { name: 'COS5T', count: '2' },
            { name: 'COS5', count: '1' }
        ]
        );
    })
})