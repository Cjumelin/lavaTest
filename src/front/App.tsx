import React from 'react';
import './App.css';
import Table from './Table';
import { useRelayCountPerChain } from './hooks/useRelayCountPerChain';
import logo from './logo.svg';

export default function App() {

  const {
    isRelayCountLoading,
    relayCountPerChain,
    lastBlockHeight
  } = useRelayCountPerChain()

  return (
    <div className="App">
      <div className="App-header">{
        isRelayCountLoading ? (<>
          <h1>Loading your awsome data...</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </>
        ) : (<Table
          relayCountPerChain={relayCountPerChain}
          lastBlockHeight={lastBlockHeight}
        ></Table>)
      }
      </div>
    </div>
  );
}