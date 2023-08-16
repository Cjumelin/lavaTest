import React, { useEffect } from 'react';
import './App.css';
import Table from './Table';
import { useBlockList } from './hooks/useBlockList';
import logo from './logo.svg';

export default function App() {

  const {
    isBlockListLoading,
    blockListState,
    errors,
    setErrors
  } = useBlockList()

  useEffect(() => {
    if (
      blockListState.blocks.length // Avoid first rendering
      && blockListState.countRelayPerChain.length === 0
    )
      setErrors([...errors, "No transaction of type \"/lavanet.lava.pairing.MsgRelayPayment\""]);
  }, [blockListState])

  function refreshPage() {
    window.location.reload();
  }
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
        {
          errors.length &&
          <div className='py-10 flex flex-col items-center'>
            <h1 className="py-10 text-base font-semibold leading-6 text-white">
              Network errors
            </h1>
            <p className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
              Reload if needed
            </p>
            <div>
              <button
                type="button"
                onClick={refreshPage}
                className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Reload
              </button>
            </div>
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {Object.entries(errors.reduce((acc, val) => {
                  if (!acc[val])
                    acc[val] = 1
                  else
                    acc[val] += 1

                  return acc
                }, {}))
                  .map(([name, count], ind) => (
                    <li key={ind}>
                      <div className="relative pb-8">
                        {ind !== errors.length - 1 ? (
                          <span className="absolute left-1 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className="h-1 w-1 mt-4 rounded-full flex items-center justify-center ring-8 ring-white"
                            >
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-red-600">
                                {count as number} - {name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        }
      </div>
    </div>
  );
}