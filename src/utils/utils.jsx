import * as Const from "./Cons";

const getEtherScanLink = () => {
    return Const.DEFAULT_NETWORK === Const.NETWORK_MAINNET ? "https://etherscan.io" : "https://goerli.etherscan.io"
}

export const getEtherAddressLink = () => {
    return getEtherScanLink() + "/address/"
}
export const getEtherTxHashLink = () => {
    return getEtherScanLink() + "/tx/"
}

export const getDomain = () => {
    if (Const.DEFAULT_NETWORK == Const.NETWORK_MAINNET) {
        return "https://tbtcscan.com"
    } else {
        return "https://testnet.tbtcscan.com"
    }
}