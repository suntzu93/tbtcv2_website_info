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

export const getBlockStreamInfo = () => {
    if (Const.DEFAULT_NETWORK == Const.NETWORK_MAINNET) {
        return "https://blockstream.info/tx/"
    } else {
        return "https://blockstream.info/testnet/tx/"
    }
}

export function getGroupState(group,currentBlock) {
    //259_200 is group life time, ~30 days assuming 15s block time
    if (group?.terminated || parseInt(group?.createdAtBlock) + 259200 < currentBlock) {
        return "Inactive"
    } else {
        return "Active"
    }
}