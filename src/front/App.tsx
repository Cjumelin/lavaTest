import React from 'react';
import './App.css';
import Table from './Table';
import { useBlockList } from './hooks/useBlockList';
import logo from './logo.svg';

export default function App() {

  const {
    isBlockListLoading,
    blockListState,
    errors
  } = useBlockList()

  return (
    <div className="App">
      <div className="App-header">{
        isBlockListLoading ? (<>
          <h1>Loading your awsome data...</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </>
        ) : (<Table
          blockListState={blockListState}
        ></Table>)
      }
      </div>
      {
        errors.length &&
        <div className='text-red-600'>
          {JSON.stringify(errors)}
          <button
            type="button"
            className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Please reload
          </button>
        </div>
      }
    </div>
  );
}