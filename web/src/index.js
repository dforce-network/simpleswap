import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import Web3Provider from 'web3-react'

import ThemeProvider, { GlobalStyle } from './theme'
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './contexts/Application'
import TransactionContextProvider, { Updater as TransactionContextUpdater } from './contexts/Transactions'
import TokensContextProvider from './contexts/Tokens'
import BalancesContextProvider from './contexts/Balances'
import AllowancesContextProvider from './contexts/Allowances'
import AllBalancesContextProvider from './contexts/AllBalances'
import SimpleSwapContextProvider from './contexts/SimpleSwap'

import App from './pages/App'
import NetworkOnlyConnector from './NetworkOnlyConnector'
import InjectedConnector from './InjectedConnector'

import './i18n'

if (process.env.NODE_ENV === 'production') {
  // turn off GA in production
  ReactGA.initialize('test', { testMode: true })
} else {
  ReactGA.initialize('test', { testMode: true })
}
ReactGA.pageview(window.location.pathname + window.location.search)

const Network = new NetworkOnlyConnector({
  providerURL: process.env.REACT_APP_NETWORK_URL || ''
})
const Injected = new InjectedConnector({
  supportedNetworks: process.env.REACT_APP_NETWORK_IDS.split(',').map(id => Number(id))
})
const connectors = { Injected, Network }

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <TransactionContextProvider>
          <TokensContextProvider>
            <BalancesContextProvider>
              <AllBalancesContextProvider>
                <AllowancesContextProvider>
                  <SimpleSwapContextProvider>
                    {children}
                  </SimpleSwapContextProvider>
                </AllowancesContextProvider>
              </AllBalancesContextProvider>
            </BalancesContextProvider>
          </TokensContextProvider>
        </TransactionContextProvider>
      </ApplicationContextProvider>
    </LocalStorageContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <ApplicationContextUpdater />
      <TransactionContextUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3Provider connectors={connectors} libraryName="ethers.js">
    <ContextProviders>
      <Updaters />
      <ThemeProvider>
        <>
          <GlobalStyle />
          <App />
        </>
      </ThemeProvider>
    </ContextProviders>
  </Web3Provider>,
  document.getElementById('root')
)
