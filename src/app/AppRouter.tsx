import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastListener } from '~/app/contexts/ToastsContext';
import '../styles/app.css';
import Spinner from './components/common/Spinner';
import { Footer, Header } from './layout';
// import Updater from './modules/home/updater';
// import MulticallUpdater from './modules/multicall/updater';

const Home = lazy(() => import('./pages/home'));
const Network = lazy(() => import('./pages/Network'));
const TokenList = lazy(() => import('./pages/TokenList'));
const Swap = lazy(() => import('./pages/Swap'));
const Transfer = lazy(() => import('./pages/Transfer'));
const PreviousClaim = lazy(() => import('./pages/PreviousClaim'));

export default function AppRouter() {
  window.ethereum.removeAllListeners(['networkChanged']);

  const LoadingMessage = () => (
    <div className="loading">
      <Spinner size="lg"></Spinner>
    </div>
  );

  return (
    <BrowserRouter>
      <Header />
      {/* <Updater />
      <MulticallUpdater /> */}
      <Suspense fallback={<LoadingMessage />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/network" element={<Network />} />
          <Route path="/tokens" element={<TokenList />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/previousclaim" element={<PreviousClaim />} />
        </Routes>
      </Suspense>

      <Footer />
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      <ToastListener />
    </BrowserRouter>
  );
}
