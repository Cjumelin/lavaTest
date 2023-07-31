import { BlockList } from "./blockList";
import { lavaBlockSearchResponse } from "./lavaBlockSearchResponse.stub";

describe("sandbox", () => {
    it("retrieve number in relay in the last 20 block of lavachain", () => {
        let blockList = new BlockList(
            lavaBlockSearchResponse.result.blocks,
            0
        ).state.countRelayPerChain;
        expect(blockList).toEqual([
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
    it("inspect different msg types", async () => {
        let res = new BlockList(
            lavaBlockSearchResponse.result.blocks,
            0
        ).state.msgPerTx.flat().map((msg: any) => msg.typeUrl)
            .reduce(
                (acc: any, curr: any) => {
                    acc[curr] = acc[curr] + 1 || 0
                    return acc
                },
                {}
            );
        expect(res).toEqual(
            {
                "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward": 14,
                "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission": 9,
                "/cosmos.staking.v1beta1.MsgDelegate": 5,
                "/lavanet.lava.conflict.MsgConflictVoteCommit": 70,
                "/lavanet.lava.conflict.MsgConflictVoteReveal": 0,
                "/lavanet.lava.conflict.MsgDetection": 6,
                "/lavanet.lava.pairing.MsgRelayPayment": 41
            }
        );
    })
})