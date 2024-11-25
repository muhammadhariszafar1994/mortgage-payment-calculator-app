import { useState } from 'react';

import './App.css';
import Calculator from './components/calculator';
import RentVsBuy from './components/rent-vs-buy';
import HomeAffordabilityModel from './components/home-affordability-model';

function App() {
  const [activeTab, setActiveTab] = useState('tab1');

  return <>
    <div className="mt-10">
        <div className="border-b border-gray-200">
            <div className="flex space-x-4">
                <button
                    className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'tab1'
                            ? 'textSecondary border-b-2 borderSecondary'
                            : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('tab1')}
                >
                  Payment
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'tab2'
                            ? 'textSecondary border-b-2 borderSecondary'
                            : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('tab2')}
                >
                    Rent vs. Buy
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'tab3'
                            ? 'textSecondary border-b-2 borderSecondary'
                            : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('tab3')}
                >
                    Home Affordability Model
                </button>
            </div>
        </div>
        <div className="mt-4">
            {activeTab === 'tab1' && <Calculator />}
            {activeTab === 'tab2' && <RentVsBuy />}
            {activeTab === 'tab3' && <HomeAffordabilityModel />}
        </div>
    </div>
    
    
  </>;
}

export default App;
