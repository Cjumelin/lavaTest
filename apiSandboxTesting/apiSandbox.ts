//Import lava-sdk
import { LavaSDK } from "@lavanet/lava-sdk";

export enum AvailableNetwork {
    ethereum = "ethereum",
    osmosis = "osmosis",
    fantom = "fantom",
    celo = "celo",
    lava = "lava",
    arbitum = "arbitum",
    cosmos = "cosmos",
    aptos = "aptos",
    starknet = "starknet",
    juno = "juno",
    polygon = "polygon",
    evmos = "evmos",
    base = "base",
    optimism = "optimism",
    canto = "canto",
    avalanche = "avalanche",
    solana = "solana",
    filecoin = "filecoin",
}

enum AvailableRPCInterface {
    JSONRPC = 'jsonrpc',
    TENDERMINT_RPC = 'tendermintrpc'
}

type Network = {
    chainID: string,
    method: string,
    rpcInterface: AvailableRPCInterface,
    params?: string[],
    countRelaysIn: (res: any) => number
};

type Networks = { [Key in AvailableNetwork]: Network };

export const networks: Networks = {
    [AvailableNetwork.osmosis]: {
        chainID: 'COS3',
        method: 'blockchain',
        params: ['20', '0'],
        rpcInterface: AvailableRPCInterface.TENDERMINT_RPC,
        countRelaysIn: (res: any) => {
            const blocks = res.result.block_metas as Array<any>;
            return blocks.reduce(
                (acc, block) => acc + parseInt(block.num_txs), 0
            );
        }
    },
    [AvailableNetwork.ethereum]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.fantom]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.celo]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.lava]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.arbitum]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.cosmos]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.aptos]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.starknet]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.juno]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.polygon]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.evmos]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.base]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.optimism]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.canto]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.avalanche]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.solana]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    },
    [AvailableNetwork.filecoin]: {
        chainID: "",
        method: "",
        rpcInterface: AvailableRPCInterface.JSONRPC,
        params: undefined,
        countRelaysIn: function (res: any): number {
            throw new Error("Function not implemented.");
        }
    }
}


//Initialize Lava SDK to the selected API
export const generateRPCConnection = async ({ chainID, rpcInterface, method, params }: Network) => {
    const lavaSDK = await (new LavaSDK({
        privateKey: process.env.LAVA_PRIVKEY,
        badge: {
            badgeServerAddress: "https://badges.lavanet.xyz", // Or your own Badge-Server URL 
            projectId: "3f850af078b30020705043f13970b901"
        },
        chainID,
        rpcInterface, // Optional
        geolocation: "2",
    }));

    console.log(lavaSDK)

    const res = JSON.parse(await lavaSDK.sendRelay({
        method,
        params: params || []
    }))

    console.log(res)

    return res;

}


//Send a relay using the SDK
export const relayCountInLast20Block =
    (getLast20Blocks: (ofNetwork: Network) => Promise<any>) =>
        async (network: Network) => {
            return network.countRelaysIn(await getLast20Blocks(network));
        }
