import React, { useEffect, useState } from 'react';
import { RelayCount, relayCounterInLastNBlock } from '../useCases/relayCounterInLastNBlock/relayCounterInLastNBlock';
import { retrieveLastBockHeight } from '../useCases/retrieveLastBlockHeight/retrieveLastBlockHeight';
import { generateLavaClient } from '../utils/LavaClient';
import { poll } from '../utils/polling';
import './App.css';
import Table from './Table';
import logo from './logo.svg';

export default function App() {

  const [isRelayCountLoading, setIsRelayCountLoading] = useState(true);
  const [data, setData] = useState<RelayCount[]>([]);

  useEffect(() => {
    startPolling();
  })

  const startPolling = async () => {
    const lavaClient = await generateLavaClient({
      chainID: 'LAV1',
      rpcInterface: 'tendermintrpc'
    });
    poll(async () => {
      const res = await relayCounterInLastNBlock(
        lavaClient,
        await retrieveLastBockHeight(lavaClient)
      );
      setData(res.slice(0, 10));
      setIsRelayCountLoading(false)
    });
  }

  return (
    <div className="App">
      <div className="App-header">{
        isRelayCountLoading ? (<>
          <h1>Loading your awsome data...</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </>
        ) : (<Table relayCountPerChain={data}></Table>)
      }
      </div>
    </div>
  );
}