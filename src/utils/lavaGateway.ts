import { LavaSDK } from "@lavanet/lava-sdk";
import { Network } from "../types/network.type";
import { lavaBlockSearchResponse } from "../useCases/relayCounterInLastNBlock/lavaBlockSearchResponse.stub";
import { lavaBlockchainResponse } from "../useCases/retrieveLastBlockHeight/lavaBlockchainResponse.stub";

export type LavaGateway = {
    lavaClient: LavaSDK,
    getBlockchain: () => Promise<any>,
    getBlocks: (
        lastBlockHeight: number,
        nBlockToExplore: number) => Promise<any>
}

const generateInMemoryLavaGateway = (): LavaGateway => {
    return {
        lavaClient: {} as LavaSDK,
        getBlockchain: async () => lavaBlockchainResponse,
        getBlocks: async () => lavaBlockSearchResponse
    }
}

//Initialize Lava SDK to the selected API
export const generateLavaGateway = async (
    { chainID, rpcInterface }: Network): Promise<LavaGateway> => {
    let lavaClient: LavaSDK;
    if (process.env.REACT_APP_ENV === "inMemory") {
        return generateInMemoryLavaGateway();
    }
    try {
        lavaClient = await LavaSDK.create({
            privateKey: process.env.LAVA_PRIVKEY,
            badge: {
                badgeServerAddress: "https://badges.lavanet.xyz", // Or your own Badge-Server URL 
                projectId: "3f850af078b30020705043f13970b901"
            },
            chainID,
            rpcInterface, // Optional
            geolocation: "2",
        });
    } catch (e: any) {
        throw new Error(JSON.parse(e));
    }

    if ((lavaClient as any).error)
        throw new Error((lavaClient as any).error);
    return {
        lavaClient,
        getBlockchain: initGetBlockchain(lavaClient),
        getBlocks: initGetBlocks(lavaClient),
    }
}


type RPCCallArgs = {
    method: string,
    params: string[]
}

const unwrapJSONResponse = (res: any) => {
    const unwrappedRes = JSON.parse(res);
    if (unwrappedRes.error) {
        throw new Error(unwrappedRes.error);
    }
    return unwrappedRes.result
}

const RPCCall = (lavaClient: LavaSDK) =>
    async (rpcCallArgs: RPCCallArgs) => {
        let res: any;
        try {
            res = await lavaClient.sendRelay(rpcCallArgs)
        } catch (e: any) {
            throw new Error(JSON.stringify(e));
        }
        return unwrapJSONResponse(res)
    }

const initGetBlockchain = (lavaClient: LavaSDK) =>
    async () => RPCCall(lavaClient)
        ({
            method: 'blockchain',
            params: ['1', '0']
        });

const initGetBlocks = (lavaClient: LavaSDK) =>
    async (
        lastBlockHeight: number,
        nBlockToExplore: number
    ) => RPCCall(lavaClient)({
        method: 'block_search',
        params: [
            `block.height > ${lastBlockHeight - nBlockToExplore}`,
            "1",
            "20",
            "desc"
        ]
    })
