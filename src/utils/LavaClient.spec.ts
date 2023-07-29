import { retrieveLastBockHeight } from "../useCases/retrieveLastBlockHeight/retrieveLastBlockHeight"
import { generateLavaClient, getBlocks } from "./LavaClient"

describe('Lava client', () => {
    it('should retrieve N blocks', async () => {
        const lavaClient = await generateLavaClient({
            chainID: 'LAV1',
            rpcInterface: 'tendermintrpc'
        })
        const res = await getBlocks(lavaClient)(
            await retrieveLastBockHeight(lavaClient),
            20
        )
        expect(res.result.blocks.length).toEqual(20)
    })
})