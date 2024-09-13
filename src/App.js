import { useState } from 'react';

import './App.css';
import Calculator from './components/calculator';
import RentVsBuy from './components/rent-vs-buy';

function App() {
  const [activeTab, setActiveTab] = useState('tab1');

  return <>
    <div className="mt-10">
        <div className="border-b border-gray-200">
            <div className="flex space-x-4">
                <button
                    className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'tab1'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('tab1')}
                >
                  Payment
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'tab2'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('tab2')}
                >
                    Rent vs. Buy
                </button>
            </div>
        </div>
        <div className="mt-4">
            {activeTab === 'tab1' && <Calculator />}
            {activeTab === 'tab2' && <RentVsBuy />}
        </div>
    </div>
    
    
  </>;
}

export default App;
