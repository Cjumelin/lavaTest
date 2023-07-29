//Import lava-sdk
import { LavaSDK } from "@lavanet/lava-sdk";
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import Long from "long";
import { getBlocks } from "../../utils/LavaClient";
import { MsgRelayPayment } from "../../utils/src/codec/pairing/tx";

// Retrieve decoded transaction on a flat array
const getTransactions = (txs: any) => txs.map((block: any) =>
    block.block.data.txs
        .map(
            (tx: any) => Tx.decode(Buffer.from(tx, "base64"))
        )
).flat();

// Retrieve RelayPaymentMessage and return them decoded
const getDecodedRelayPaymentMsg = (txs: any) => txs
    .map((tx: any) => tx.body.messages)
    .flat()
    .filter(
        (message: any) =>
            message.typeUrl === '/lavanet.lava.pairing.MsgRelayPayment')
    .map(
        (message: any) =>
            MsgRelayPayment.decode(new Uint8Array(message.value))
    )

// retrieve relays in a flatten array
const getRelays = (messages: any) => messages
    .map((msg: any) => msg.relays)
    .flat()

const countRelayByChain = (relays: any) => {
    type RelayCountByChain = { [key: string]: Long }

    const relayCountByChain: RelayCountByChain = {}

    for (const relay of relays) {
        const relayNum = new Long(
            relay.relayNum.low,
            relay.relayNum.high,
            relay.relayNum.unsigned
        )
        relayCountByChain[relay.specId] = relayCountByChain[relay.specId] || new Long(0)
        relayCountByChain[relay.specId] = relayCountByChain[relay.specId].add(relayNum)
    }

    type ChainRelayCount = { name: string, count: Long };
    const relayCountByChainReadable: ChainRelayCount[] = []

    for (const chainName of Object.keys(relayCountByChain)) {
        relayCountByChainReadable.push({
            name: chainName,
            count: relayCountByChain[chainName]
        })
    }

    return relayCountByChainReadable
        //sort then by desc
        .sort(
            (a: ChainRelayCount, b: ChainRelayCount) =>
                a.count.greaterThan(b.count) ? -1 : 1
        )
        // Making them human readable
        .map(
            ({ name, count }: ChainRelayCount) =>
            ({
                name,
                count: count.toString()
            })
        );

}

export type RelayCount = { name: string, count: string };

export const relayCounterInLastNBlock = async (
    lavaClient: LavaSDK,
    lastBlockHeight: number,
    nBlockToExplore: number = 20
): Promise<RelayCount[]> => {
    const blocks = await getBlocks(lavaClient)(lastBlockHeight, nBlockToExplore);

    return countRelayByChain(
        getRelays(
            getDecodedRelayPaymentMsg(
                getTransactions(blocks.result.blocks)
            )
        )
    )
}
