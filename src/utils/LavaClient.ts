import { LavaSDK } from "@lavanet/lava-sdk";
import { Network } from "../types/network.type";

//Initialize Lava SDK to the selected API
export const generateLavaClient = async (
    { chainID, rpcInterface }: Network): Promise<LavaSDK> => {
    let lavaClient: LavaSDK;
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
        throw new Error(e)
    }

    if ((lavaClient as any).error)
        throw new Error((lavaClient as any).error);
    return lavaClient
}

type RPCCallArgs = {
    method: string,
    params: string[]
}

const RPCCall = (lavaClient: LavaSDK) =>
    async (rpcCallArgs: RPCCallArgs) => {
        let res: any;
        try {
            res = await lavaClient.sendRelay(rpcCallArgs)
        } catch (e: any) {
            throw new Error(e);
        }
        if (res.error)
            throw new Error(res.error);
        return JSON.parse(res);
    }

export const getBlockchain = (lavaClient: LavaSDK) =>
    async () => RPCCall(lavaClient)
        ({
            method: 'blockchain',
            params: ['1', '0']
        });

export const getBlocks = (lavaClient: LavaSDK) =>
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
