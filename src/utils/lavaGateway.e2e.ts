import { retrieveLastBockHeight } from "../useCases/retrieveLastBlockHeight/retrieveLastBlockHeight"
import { generateLavaGateway } from "./lavaGateway"

describe('Lava gateway', () => {
    it('should retrieve N blocks', async () => {
        const lavaGateway = await generateLavaGateway({
            chainID: 'LAV1',
            rpcInterface: 'tendermintrpc'
        })
        const res = await lavaGateway.getBlocks(
            await retrieveLastBockHeight(lavaGateway),
            20
        )
        expect(res.blocks.length).toEqual(20)

        const res2 = await lavaGateway.getBlocks(
            await retrieveLastBockHeight(lavaGateway),
            1
        )
        expect(res2.blocks.length).toEqual(1)
    })
})