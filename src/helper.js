const numberWithCommas = (x) => {
    return x?.toString()
            .replace(/,/g,"")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const removeCommas = (x) => {
    return x?.toString().replace(/,/g, "");
}

const loanPurpose = () => {
    const data = ['Purchase', 'Refinance'];

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

const debtToIncomeRatioData = () => {
    return Array.from({ length: 21 }, (_, i) => i * 5);
};

const housingRatioData = () => {
    return Array.from({ length: 21 }, (_, i) => i * 5);
};

const formatNumberWithPercentage = (n) => {
    // Ensure the input is a string
    let inputString = n.toString();

    // Remove any existing percentage signs
    let cleanedInput = inputString.replace(/%/g, "");

    // Format the number with commas
    let formattedNumber = cleanedInput.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Add a single percentage sign
    return formattedNumber + "%";
}

export { 
    numberWithCommas, 
    removeCommas, 
    loanPurpose, 
    loanTermData, 
    interestRateData, 
    debtToIncomeRatioData, 
    housingRatioData, 
    formatNumberWithPercentage 
};