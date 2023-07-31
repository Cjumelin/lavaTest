import React from "react"
import { BlockListState } from "../useCases/relayCounterInLastNBlock/blockList"

type TableProps = {
    blockListState: BlockListState
}

export default function Table({ blockListState: blockList }: TableProps) {
    return (
        <div className="bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="bg-gray-900 py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-base font-semibold leading-6 text-white">
                                    Top 10 chains on lava by the number of relays pass in
                                    Lava Blockchain in the last 20 blocks</h1>
                                <p className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                                    Last block height {blockList.lastBlockHeight}
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                                                    Chain Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                                    Number of relays
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {blockList.countRelayPerChain
                                                .slice(0, 10)
                                                .map((relayCount: any, ind: number) => (
                                                    <tr key={ind}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                                            {relayCount.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{relayCount.count}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}