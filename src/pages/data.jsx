import * as client from '../../.graphclient'
import * as Const from '../utils/Cons';
import moment from 'moment';

export const deposit_columns = [
    {
        header: "Updated",
        accessor: "updateTime",
        numeric: false,
    },
    {
        header: "Depositor",
        accessor: "depositor",
        numeric: false,
    },
    {
        header: "Amount request",
        accessor: "amount",
        numeric: false,
    },
    {
        header: "Amount received",
        accessor: "actualAmountReceived",
        numeric: false,
    },
    {
        header: "Current State",
        accessor: "status",
        numeric: false,
    }
];


export const redeem_columns = [
    {
        header: "Updated",
        accessor: "updateTime",
        numeric: false,
    },
    {
        header: "Redeemer",
        accessor: "redeemer",
        numeric: false,
    },
    {
        header: "Amount",
        accessor: "amount",
        numeric: false,
    },
    {
        header: "Current State",
        accessor: "status",
        numeric: false,
    }
];

export const operator_columns = [
    {
        header: "Address",
        accessor: "address",
        numeric: false,
    },
    {
        header: "tBTC Authorized",
        accessor: "tBTCAuthorizedAmount",
        numeric: true,
    },
    {
        header: "Random Beacon Authorized",
        accessor: "randomBeaconAuthorizedAmount",
        numeric: true,
    },
    {
        header: "Amount Staked",
        accessor: "stakedAmount",
        numeric: true,
    },
    {
        header: "Available reward",
        accessor: "availableReward",
        numeric: true,
    },
    {
        header: "Faults",
        accessor: "misbehaved",
        numeric: true,
    }, {
        header: "Node registered ?",
        accessor: "registeredOperatorAddress",
        numeric: true,
    }, {
        header: "Staked At",
        accessor: "stakedAt",
        numeric: true,
    },
];


export const groups_columns = [
    {
        header: "Group Public key",
        accessor: "id",
    },
    {
        header: "Total Slot",
        accessor: "size",
    },
    {
        header: "Unique Member",
        accessor: "uniqueMemberCount",
    },
    {
        header: "Faults",
        accessor: "misbehavedCount",
    },
    {
        header: "Total Slashed Amount",
        accessor: "totalSlashedAmount",
    },
    {
        header: "Create At",
        accessor: "createdAt",
    }, {
        header: "State",
        accessor: "state",
    }
];


const COUNT_FORMATS =
    [
        { // 0 - 999
            letter: '',
            limit: 1e3
        },
        { // 1,000 - 999,999
            letter: 'K',
            limit: 1e6
        },
        { // 1,000,000 - 999,999,999
            letter: 'M',
            limit: 1e9
        },
        { // 1,000,000,000 - 999,999,999,999
            letter: 'B',
            limit: 1e12
        }
    ];


export const formatString = (data) => {
    if (data == null) {
        return "...";
    }
    if (data.length < 10) {
        return data;
    }

    const fistSymbol = data.slice(0, 7);
    const endSymbol = data.slice(data.length - 7);
    return fistSymbol + " ... " + endSymbol;
};

export const formatStringEnd = (data) => {
    if (data == null) {
        return "...";
    }
    if (data.length < 10) {
        return data;
    }

    const fistSymbol = data.slice(0, 10);
    return fistSymbol + " ... ";
};


export const formatSatoshi = (data) => {
    return data / Const.SATOSHI_BITCOIN;
};

export const formatGwei = (value) => {
    return parseFloat(value / Const.DECIMAL_ETH).toFixed(7);
};

export const formatWeiDecimal = (value) => {
    return new Intl.NumberFormat().format(formatGwei(value));
};

export const formatNumberToDecimal = (value) => {
    return new Intl.NumberFormat().format(value);
};

export const formatNumber = (value) => {
    let newValue = value / Const.DECIMAL_ETH;
    const format = COUNT_FORMATS.find(format => (newValue < format.limit));
    newValue = (1000 * newValue / format.limit);
    newValue = Math.round(newValue * 10) / 10;
    return (newValue + format.letter);
}

export function formatTimeToText(timestamp) {
    if (timestamp == 0)
        return "Didn't staked"
    const date = moment.duration(
        moment(new Date().getTime()).diff(moment(timestamp))
    );
    const day = date.days();
    const month = date.months();
    const year = date.years();
    const hour = date.hours();
    const minute = date.minutes();
    const second = date.seconds();

    if (year > 0) {
        if (year == 1) {
            return year + " year ago";
        } else {
            return year + " years ago";
        }
    } else if (month > 0) {
        if (month == 1) {
            return month + " month ago";
        } else {
            return month + " months ago";
        }
    } else if (day > 0) {
        if (day == 1) {
            return day + " day ago";
        } else {
            return day + " days ago";
        }
    } else if (hour > 0) {
        if (hour == 1) {
            return hour + " hour ago";
        } else {
            return hour + " hours ago";
        }
    } else if (minute > 0) {
        if (minute == 1) {
            return minute + " minute ago";
        } else {
            return minute + " minutes ago";
        }
    } else {
        if (second == 1) {
            return second + " second ago";
        } else {
            return second + " seconds ago";
        }
    }
}

export function formatTimestampToText(date) {
    const month = date.months();
    let day = date.days();
    const hours = date.hours();
    const minutes = date.minutes();
    if (month > 0) {
        day = day + month * 30;
    }
    if (day > 0) {
        return `${day < 10 ? "0" + day : day}d ${hours < 10 ? "0" + hours : hours}h ago`;
    } else {
        return `${hours < 10 ? "0" + hours : hours}h ${
            minutes < 10 ? "0" + minutes : minutes
        }m ago`;
    }
}

export function formatEntryDate(date) {
    const month = date.months();
    let day = date.days();
    const hours = date.hours();
    const minutes = date.minutes();
    const seconds = date.seconds();
    if (month > 0) {
        day = day + month * 30;
    }
    if (day > 0) {
        return `${day < 10 ? "0" + day : day}d ${hours < 10 ? "0" + hours : hours}h`;
    } else if (hours > 0) {
        return `${hours < 10 ? "0" + hours : hours}h ${
            minutes < 10 ? "0" + minutes : minutes
        }m`;
    } else if (minutes > 0) {
        return `${
            minutes < 10 ? "0" + minutes : minutes
        }m`;
    } else if (seconds > 0) {
        return `${
            seconds < 10 ? "0" + seconds : seconds
        }s`;
    }
}

export function formatDate(date) {
    return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const calculateTimeMoment = (timestamp) => {
    return formatTimestampToText(
        moment.duration(
            moment(new Date().getTime()).diff(moment(timestamp))
        )
    )
};

const calculateTreasuryFee = (treasuryFee) => (
    1 / treasuryFee * 100
)
const calculateTxMaxFee = (txMaxFee) => (
    txMaxFee / Const.SATOSHI_BITCOIN
)

function convertToLittleEndian(hex) {
    try {
        if (hex == null)
            return "Can't detect !"
        hex = hex.replace("0x", "");
        hex = hex.padStart(8, "0");
        let littleEndianHex = "";
        for (let i = hex.length - 2; i >= 0; i -= 2) {
            littleEndianHex += hex.slice(i, i + 2);
        }
        return "0x" + littleEndianHex;
    } catch (e) {
        console.log(e)
    }
}

export const formatDepositsData = (rawData) =>
    rawData.map((item) => ({
        id: item.id,
        status: item.status,
        depositor: item.user.id,
        amount: parseFloat(item.amount),
        newDebt: parseFloat(item.newDebt),
        actualAmountReceived: parseFloat(item.actualAmountReceived),
        treasuryFee: parseFloat(item.treasuryFee),
        walletPubKeyHash: item.walletPubKeyHash,
        fundingTxHash: item.fundingTxHash,
        fundingOutputIndex: item.fundingOutputIndex,
        blindingFactor: item.blindingFactor,
        refundPubKeyHash: item.refundPubKeyHash,
        refundLocktime: formatDate(parseInt(convertToLittleEndian(item.refundLocktime) * 1000)),
        vault: item.vault,
        depositTimestamp: item.depositTimestamp * 1000,
        updateTime: item.updateTimestamp * 1000,
        transactions: item.transactions
    }));


export const formatRedeems = (rawData) =>
    rawData.map((item) => ({
        id: item.id,
        status: item.status,
        redeemer: item.user.id,
        amount: parseFloat(item.amount),
        walletPubKeyHash: item.walletPubKeyHash,
        redeemerOutputScript: item.redeemerOutputScript,
        redemptionTxHash: item.redemptionTxHash,
        treasuryFee: calculateTreasuryFee(item.treasuryFee),
        txMaxFee: calculateTxMaxFee(item.txMaxFee),
        completedTxHash: item.completedTxHash,
        redemptionTimestamp: item.redemptionTimestamp * 1000,
        updateTime: item.updateTimestamp * 1000,
        transactions: item.transactions
    }));

export const formatOperators = (rawData) =>
    rawData.map((item) => ({
        id: item.id,
        registeredOperatorAddress: item.registeredOperatorAddress,
        tBTCAuthorized: item.tBTCAuthorized,
        randomBeaconAuthorized: item.randomBeaconAuthorized,
        tBTCAuthorizedAmount: parseFloat(item.tBTCAuthorizedAmount),
        randomBeaconAuthorizedAmount: parseFloat(item.randomBeaconAuthorizedAmount),
        stakedAmount: parseFloat(item.stakedAmount),
        availableReward: parseFloat(item.availableReward),
        misbehavedCount: item.misbehavedCount,
        poolRewardBanDuration: item.poolRewardBanDuration,
        stakedAt: item.stakedAt * 1000
    }));

export const formatUserDetail = (user) =>
    (
        {
            tokenBalance: user.tokenBalance,
            totalTokensHeld: user.totalTokensHeld,
            mintingDebt: user.mintingDebt,
            deposits: formatDepositsData(user.deposits),
            redemptions: formatRedeems(user.redemptions)
        }
    );

export const getDeposits = async (network, isSearch, searchInput) => {
    const emptyData = JSON.parse(`[]`);
    try {
        let data;
        if (!isSearch) {
            data = await client.execute(client.GetAllDepositsQueryDocument, {});
        } else {
            data = await client.execute(client.GetDepositsQueryByUserDocument, {
                user: searchInput.toLowerCase(),
            });
        }
        if (data.data.deposits !== undefined) {
            return formatDepositsData(data.data.deposits);
        }
    } catch (e) {
        console.log("error to fetch deposit data " + e);
    }
    return emptyData;
};

export const getRedeems = async (network, isSearch, searchInput) => {
    const emptyData = JSON.parse(`[]`);
    try {
        let data = emptyData;
        if (!isSearch) {
            data = await client.execute(client.GetAllRedemptionsQueryDocument, {});
        } else {
            data = await client.execute(client.GetRedemptionQueryByUserDocument, {
                user: searchInput.toLowerCase(),
            });
        }
        if (data.data.redemptions !== undefined) {
            return formatRedeems(data.data.redemptions);
        }
    } catch (e) {
        console.log("error to fetch redeem data " + e);
    }
    return emptyData;
};

export const getTokenInfo = async (network) => {
    const emptyData = JSON.parse(`{}`);
    try {
        // switchNetworkClient(network);
        const data = await client.execute(client.TokenInfoQueryDocument, {});

        if (data.data.tbtctokens !== undefined) {
            return data.data.tbtctokens[0];
        }
    } catch (e) {
        console.log("error to fetch token info data " + e);
    }
    return emptyData;
};

export const getOperators = async (isSearch, searchInput) => {
    const emptyData = JSON.parse(`[]`);
    try {
        let data;
        if (!isSearch) {
            data = await client.execute(client.OperatorsDocument, {});
        } else {
            data = await client.execute(client.SearchOperatorsDocument, {
                id: searchInput.toLowerCase(),
            });
        }
        return formatOperators(data.data.operators);
    } catch (e) {
        console.log("error to fetch operators data " + e);
    }
    return emptyData;
}

export const getOperatorDetail = async (operator) => {
    const emptyData = JSON.parse(`[]`);
    try {
        const data = await client.execute(client.OperatorDetailDocument, {
            id: operator
        });
        return data.data.operator;
    } catch (e) {
        console.log("error to fetch operators data " + e);
    }
    return emptyData;
}

export const getGroupDetail = async (groupId) => {
    const emptyData = JSON.parse(`[]`);
    try {
        const data = await client.execute(client.RandomBeaconGroupDetailDocument, {
            id: groupId
        });
        return data.data.randomBeaconGroup;
    } catch (e) {
        console.log("error to fetch operators data " + e);
    }
    return emptyData;
}

export const getUserDetail = async (userAddress) => {
    const emptyData = JSON.parse(`[]`);
    try {
        let data;
        data = await client.execute(client.GetUserDetailDocument, {
            id: userAddress,
        });
        return formatUserDetail(data.data.user);
    } catch (e) {
        console.log("error to fetch operators data " + e);
    }
    return emptyData;
}

export const getListGroups = async () => {
    const emptyData = JSON.parse(`[]`);
    try {
        let data;
        data = await client.execute(client.ListRandomBeaconGroupDocument, {});
        return data.data;
    } catch (e) {
        console.log("error to fetch operators data " + e);
    }
    return emptyData;
}

export const getCurrentBlockNumber = async () => {
    try {
        const response = await fetch(Const.DEFAULT_NETWORK === Const.NETWORK_MAINNET
            ? Const.RPC_ETH_MAINNET
            : Const.RPC_ETH_GOERLI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1,
            }),
        })
        const dataJson = await response.json();
        return parseInt(dataJson.result, 16);
    } catch (e) {
        return "ERROR";
    }
};