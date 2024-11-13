const rentIncreaseAndDecrease = () => {
    const data = [];
    
    for (let i = -10; i <= 10; i++) data.push(String(parseFloat(i).toFixed(3)));
    return data;
}

const loanTermData = () => {
    const data = ['10', '15', '20', '25', '30'];
    
    return data;
}

const interestRateData = () => {
    const data = [];
    const startValue = 3;
    const endValue = 8.5;
    const incrementalValue = 0.125;
    
    let i = startValue
    
    while(i <= endValue) {
        data.push(String(parseFloat(i).toFixed(3)));
        i += incrementalValue;
    }

    return data;
}

const discountPointsData = () => {
    const data = [];
    const startValue = 0.000;
    const endValue = 3.000;
    const incrementalValue = 0.125;
    
    let i = startValue
    
    while(i <= endValue) {
        data.push(String(parseFloat(i).toFixed(3)));
        i += incrementalValue;
    }

    return data;
}

const homeAppreciationAndDepreciationData = () => {
    const data = [];
    const startValue = -20;
    const endValue = 20;
    const incrementalValue = 1;
    
    let i = startValue
    
    while(i <= endValue) {
        data.push(String(i));
        i += incrementalValue;
    }

    return data;
}

const expectedYearsInHome = () => {
    const data = [];
    const startValue = 1;
    const endValue = 30;
    const incrementalValue = 1;
    
    let i = startValue
    
    while(i <= endValue) {
        data.push(String(i));
        i += incrementalValue;
    }

    return data;
}

const homeSellingCostsData = () => {
    const data = [];
    const startValue = 0.00;
    const endValue = 6.00;
    const incrementalValue = 0.50;
    
    let i = startValue
    
    while(i <= endValue) {
        data.push(String(parseFloat(i).toFixed(2)));
        i += incrementalValue;
    }

    return data;
}

const taxRateData = () => {
    const data = [];
    const startValue = 0;
    const endValue = 50;
    const incrementalValue = 1;
    
    let i = startValue
    
    while(i <= endValue) {
        data.push(String(parseFloat(i).toFixed(2)));
        i += incrementalValue;
    }

    return data;
}

const savingsRateData = () => {
    const data = [];
    const startValue = 0;
    const endValue = 10;
    const incrementalValue = 0.5;
    
    let i = startValue;
    
    while(i <= endValue) {
        data.push(String(parseFloat(i).toFixed(2)));
        i += incrementalValue;
    }

    return data;
};


export {
    rentIncreaseAndDecrease, 
    loanTermData, 
    interestRateData, 
    discountPointsData, 
    homeAppreciationAndDepreciationData, 
    expectedYearsInHome,
    homeSellingCostsData,
    taxRateData,
    savingsRateData
};