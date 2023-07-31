import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import Long from "long";
import { MsgRelayPayment } from "../../utils/src/codec/pairing/tx";

export type RelayCount = { name: string, count: string };

export type BlockListCreatorArgs = {
    blocks: any[],
    lastBlockHeight: number,
}

export type BlockListState = {
    blocks: any[],
    lastBlockHeight: number,
    txsPerBlock: Tx[][],
    txs: Tx[],
    msgPerTx: any[],
    msgsRelayPayment: MsgRelayPayment[],
    relays: any[],
    countRelayPerChain: RelayCount[],
}

export class BlockList {
    protected txsPerBlock: Tx[][];
    private txs: Tx[];
    private msgPerTx: any[];
    private msgsRelayPayment: MsgRelayPayment[];
    private relays: any[]
    private countRelayPerChain: RelayCount[];

    constructor(
        private blocks: any[],
        private lastBlockHeight: number
    ) {
        this.txsPerBlock = this.getTxsPerBlock();
        this.txs = this.getTxs();
        this.msgPerTx = this.getMsgPerTx();
        this.msgsRelayPayment = this.getMsgsRelayPayment();
        this.relays = this.getRelays();
        this.countRelayPerChain = this.getCountRelayPerChain();
    }

    public get state(): BlockListState {
        return {
            blocks: this.blocks,
            lastBlockHeight: this.lastBlockHeight,
            txsPerBlock: this.txsPerBlock,
            txs: this.txs,
            msgPerTx: this.msgPerTx,
            msgsRelayPayment: this.msgsRelayPayment,
            relays: this.relays,
            countRelayPerChain: this.countRelayPerChain,
        }
    }

    private getTxsPerBlock(): Tx[][] {
        return this.blocks.map((block: any) =>
            block.block.data.txs
                .map(
                    (tx: any) => Tx.decode(Buffer.from(tx, "base64"))
                )
        );
    }

    // Retrieve decoded transaction on a flat array
    public getTxs(): Tx[] {
        return this.getTxsPerBlock().flat();
    }

    // Retrieve RelayPaymentMessage and return them decoded
    private getMsgsRelayPayment(): MsgRelayPayment[] {
        return this.getMsgPerTx().flat()
            .filter(
                (message: any) =>
                    message.typeUrl === '/lavanet.lava.pairing.MsgRelayPayment')
            .map(
                (message: any): MsgRelayPayment =>
                    MsgRelayPayment.decode(new Uint8Array(message.value))
            )
    }
    private getMsgPerTx(): any[] {
        return this.txs
            .map((tx: Tx) => tx?.body?.messages);
    }

    // retrieve relays in a flatten array
    private getRelays(): any[] {
        return this.getRelaysPerMsg().flat()
    }
    private getRelaysPerMsg(): any[][] {
        return this.msgsRelayPayment
            .map((msg: any) => msg.relays)
    }

    private getCountRelayPerChain() {
        type RelayCountByChain = { [key: string]: Long }

        const relayCountByChain: RelayCountByChain = {}

        for (const relay of this.relays) {
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
            //sort them by count desc
            .sort(
                (a: ChainRelayCount, b: ChainRelayCount) =>
                    a.count.greaterThan(b.count) ? -1 : 1 // compare Long types
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
}