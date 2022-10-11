export const truncateAddress = (address) => {
    if (!address) return "No Account";
    const match = address.match(
        /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export const toHex = (num) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};


export const verifyToken = (token) => {
    return token != undefined && token != 'undefined' && token.length > 0;
}

export const isItemExists= (dataArr,itemCheck) =>{
    return dataArr.some(item => item === itemCheck);
}

export const removeItem = (setSelectedIpfs,item) => {
    setSelectedIpfs((prevState) =>
      prevState.filter((prevItem) => prevItem !== item)
    );
  };