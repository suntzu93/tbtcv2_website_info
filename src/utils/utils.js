import * as Const from "./Cons";

const getEtherScanLink= () => {
    return localStorage.getItem("network") === Const.NETWORK_MAINNET ? "https://etherscan.io" : "https://goerli.etherscan.io"
}

export const getEtherAddressLink = () => {
    return getEtherScanLink() + "/address/"
}
export const getEtherTxHashLink = () => {
    return getEtherScanLink() + "/tx/"
}