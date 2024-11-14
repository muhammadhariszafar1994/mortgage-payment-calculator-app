export const numberWithCommas = (x) => {
    return x?.toString()
            .replace(/,/g,"")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const removeCommas = (x) => {
    return x?.toString().replace(/,/g, "");
}