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

export { interestRateData };