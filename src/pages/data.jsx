import * as client from "../../.graphclient";
import * as Const from "../utils/Cons";
import moment from "moment";
import Web3 from "web3";

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
  },
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
    header: "Amount Request",
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
  // {
  //     header: "Available reward",
  //     accessor: "availableReward",
  //     numeric: true,
  // },
  {
    header: "Faults",
    accessor: "misbehaved",
    numeric: true,
  },
  {
    header: "Node registered ?",
    accessor: "registeredOperatorAddress",
    numeric: true,
  },
  {
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
  },
  {
    header: "Expired block",
    accessor: "createdAtBlock",
  },
  {
    header: "State",
    accessor: "state",
  },
];

const COUNT_FORMATS = [
  {
    // 0 - 999
    letter: "",
    limit: 1e3,
  },
  {
    // 1,000 - 999,999
    letter: "K",
    limit: 1e6,
  },
  {
    // 1,000,000 - 999,999,999
    letter: "M",
    limit: 1e9,
  },
  {
    // 1,000,000,000 - 999,999,999,999
    letter: "B",
    limit: 1e12,
  },
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

export const formatGweiFixedZero = (value) => {
  return parseFloat(value / Const.DECIMAL_ETH).toFixed(0);
};

export const formatWeiDecimal = (value) => {
  return new Intl.NumberFormat().format(formatGweiFixedZero(value));
};

export const formatWeiDecimalNoSurplus = (value) => {
  return new Intl.NumberFormat().format(
    parseFloat(value / Const.DECIMAL_ETH).toFixed(0)
  );
};

export const formatNumberToDecimal = (value) => {
  return new Intl.NumberFormat().format(value);
};

export const formatNumber = (value) => {
  let newValue = value / Const.DECIMAL_ETH;
  const format = COUNT_FORMATS.find((format) => newValue < format.limit);
  newValue = (1000 * newValue) / format.limit;
  newValue = Math.round(newValue * 10) / 10;
  return newValue + format.letter;
};

export function formatTimeToText(timestamp) {
  if (timestamp == 0) return "Didn't staked";
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
    return `${day < 10 ? "0" + day : day}d ${
      hours < 10 ? "0" + hours : hours
    }h ago`;
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
    return `${day < 10 ? "0" + day : day}d ${
      hours < 10 ? "0" + hours : hours
    }h`;
  } else if (hours > 0) {
    return `${hours < 10 ? "0" + hours : hours}h ${
      minutes < 10 ? "0" + minutes : minutes
    }m`;
  } else if (minutes > 0) {
    return `${minutes < 10 ? "0" + minutes : minutes}m`;
  } else if (seconds > 0) {
    return `${seconds < 10 ? "0" + seconds : seconds}s`;
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
    moment.duration(moment(new Date().getTime()).diff(moment(timestamp)))
  );
};

// const calculateTreasuryFee = (treasuryFee) => (1 / treasuryFee) * 100;
// const calculateTxMaxFee = (txMaxFee) => txMaxFee / Const.SATOSHI_BITCOIN;

function convertFromLittleEndian(hex) {
  try {
    if (hex == null) return "...";
    hex = hex.replace("0x", "");
    hex = hex.padStart(8, "0");
    let littleEndianHex = "";
    for (let i = hex.length - 2; i >= 0; i -= 2) {
      littleEndianHex += hex.slice(i, i + 2);
    }
    return "0x" + littleEndianHex;
  } catch (e) {
    console.log(e);
  }
}

export function convertToLittleEndian(txHash) {
  try {
    if (txHash === undefined) {
      return "";
    }
    txHash = txHash.replace("0x", "");
    const chunks = txHash.match(/.{2}/g).reverse();
    const littleEndianHex = chunks.join("");
    return "0x" + littleEndianHex;
  } catch (e) {
    console.log(e);
  }
  return "";
}

export const formatDepositsData = (rawData) =>
  rawData.map((item) => ({
    id: item.id,
    status: item.status.replace("_", " "),
    depositor: item.user.id,
    amount: parseFloat(item.amount),
    newDebt: parseFloat(item.newDebt),
    actualAmountReceived: parseFloat(item.actualAmountReceived),
    treasuryFee: parseFloat(item.treasuryFee),
    walletPubKeyHash: item.walletPubKeyHash,
    fundingTxHash: convertFromLittleEndian(item.fundingTxHash),
    fundingOutputIndex: item.fundingOutputIndex,
    // eslint-disable-next-line no-undef
    blindingFactor: BigInt(item.blindingFactor).toString(),
    refundPubKeyHash: item.refundPubKeyHash,
    refundLocktime: formatDate(
      parseInt(convertFromLittleEndian(item.refundLocktime) * 1000)
    ),
    vault: item.vault,
    depositTimestamp: item.depositTimestamp * 1000,
    updateTime: item.updateTimestamp * 1000,
    transactions: item.transactions,
  }));

export const formatRedeems = (rawData) => {
  return rawData.map((item) => ({
    id: item.id,
    status: item.status.replace("_", " "),
    redeemer: item.user.id,
    amount: parseFloat(item.amount),
    actualAmountReceived: parseFloat(item.amount) - item.treasuryFee,
    walletPubKeyHash: item.walletPubKeyHash,
    redeemerOutputScript: item.redeemerOutputScript,
    redemptionTxHash: item.redemptionTxHash,
    treasuryFee: formatSatoshi(item.treasuryFee),
    txMaxFee: formatSatoshi(item.txMaxFee),
    completedTxHash: convertFromLittleEndian(item.completedTxHash).replace(
      "0x",
      ""
    ),
    redemptionTimestamp: item.redemptionTimestamp * 1000,
    updateTime: item.updateTimestamp * 1000,
    transactions: item.transactions,
  }));
};

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
    stakedAt: item.stakedAt * 1000,
  }));

export const formatUserDetail = (user) => ({
  tokenBalance: user.tokenBalance,
  totalTokensHeld: user.totalTokensHeld,
  mintingDebt: user.mintingDebt,
  deposits: formatDepositsData(user.deposits),
  redemptions: formatRedeems(user.redemptions),
});

export const getDeposits = async (network, isSearch, searchInput) => {
  const emptyData = JSON.parse(`[]`);
  try {
    let data;
    if (!isSearch) {
      data = await client.execute(client.GetAllDepositsQueryDocument, {});
    } else {
      const fundingTxHashHex = convertToLittleEndian(searchInput.toLowerCase());
      data = await client.execute(client.GetDepositsQueryByUserDocument, {
        user: searchInput.toLowerCase(),
        id: searchInput.toLowerCase(),
        fundingTxHash: fundingTxHashHex,
      });
    }
    if (data.data !== undefined) {
      return data.data;
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
      const completedTxHashHex = convertToLittleEndian(
        searchInput.toLowerCase()
      );
      //search redemptionId
      if (searchInput.startsWith("0x") && searchInput.length > 42) {
        data = await client.execute(client.SearchRedemptionQueryByIdDocument, {
          id: searchInput.toLowerCase(),
        });
      } else {
        data = await client.execute(client.GetRedemptionQueryByUserDocument, {
          user: searchInput.toLowerCase(),
          id: searchInput.toLowerCase(),
          completedTxHash: completedTxHashHex,
        });
      }
    }
    if (data.data !== undefined) {
      return data.data;
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
        address: searchInput.toLowerCase(),
      });
    }
    return data.data;
  } catch (e) {
    console.log("error to fetch operators data " + e);
  }
  return emptyData;
};

export const getOperatorDetail = async (operator) => {
  const emptyData = JSON.parse(`[]`);
  try {
    const data = await client.execute(client.OperatorDetailDocument, {
      id: operator,
    });
    return data.data.operator;
  } catch (e) {
    console.log("error to fetch operators data " + e);
  }
  return emptyData;
};

export const getGroupDetail = async (groupId) => {
  const emptyData = JSON.parse(`[]`);
  try {
    const data = await client.execute(client.RandomBeaconGroupDetailDocument, {
      id: groupId,
    });
    return data.data.randomBeaconGroup;
  } catch (e) {
    console.log("error to fetch group data " + e);
  }
  return emptyData;
};

export const getUserDetail = async (userAddress) => {
  const emptyData = JSON.parse(`[]`);
  try {
    let data;
    data = await client.execute(client.GetUserDetailDocument, {
      id: userAddress,
    });
    return formatUserDetail(data.data.user);
  } catch (e) {
    console.log("error to fetch user data " + e);
  }
  return emptyData;
};

export const getListGroups = async () => {
  const emptyData = JSON.parse(`[]`);
  try {
    let data;
    data = await client.execute(client.ListRandomBeaconGroupDocument, {});
    return data.data;
  } catch (e) {
    console.log("error to fetch list group data " + e);
  }
  return emptyData;
};

export const getCurrentBlockNumber = async () => {
  try {
    const response = await fetch(
      Const.DEFAULT_NETWORK === Const.NETWORK_MAINNET
        ? Const.RPC_ETH_MAINNET
        : Const.RPC_ETH_GOERLI,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
      }
    );
    const dataJson = await response.json();
    return parseInt(dataJson.result, 16);
  } catch (e) {
    return "ERROR";
  }
};

export const getBalanceOfAddress = async (address) => {
  try {
    if (address === Const.ADDRESS_ZERO) {
      return 0;
    }
    let rpc = Const.MAINNET_AP_BALANCE;
    if (Const.DEFAULT_NETWORK === Const.NETWORK_TESTNET) {
      rpc = Const.GOERLI_API_BALANCE;
    }

    const response = await fetch(rpc + address);
    const data = await response.json();
    return parseFloat(parseFloat(data.result) / 1000000000000000000).toFixed(2);
  } catch (e) {
    console.log("fetch balance error : " + e.toString());
  }
  return 0;
};

export const getRewardClaimed = async (address) => {
  if (Const.DEFAULT_NETWORK === Const.NETWORK_TESTNET) return 0;

  const web3 = new Web3(Const.RPC_ETH_MAINNET);
  const cumulativeMerkleDrop = "0xeA7CA290c7811d1cC2e79f8d706bD05d8280BD37";
  const contractAbi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "cumulativeClaimed",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const contract = new web3.eth.Contract(contractAbi, cumulativeMerkleDrop);
  const claimedAmount = await contract.methods
    .cumulativeClaimed(address)
    .call();
  return parseFloat(formatGwei(claimedAmount)).toFixed(1);
};

export const getTotalMerkleDropReward = async (address) => {
  try {
    if (Const.DEFAULT_NETWORK === Const.NETWORK_TESTNET) return 0;

    let tags = await (
      await fetch(
        `https://api.github.com/repos/threshold-network/token-dashboard/tags`
      )
    ).json();
    const latestTag = tags[0].name;
    const rewardsJsonUrl = `https://raw.githubusercontent.com/threshold-network/token-dashboard/${latestTag}/src/merkle-drop/rewards.json`;
    const data = await (await fetch(rewardsJsonUrl)).json();
    if (data != undefined && data.claims != undefined) {
      const key = Object.keys(data.claims).find(
        (k) => k.toLowerCase() === address.toLowerCase()
      );
      const amount = data.claims[key].amount;
      if (amount === undefined || amount === 0) return 0;
      return parseFloat(formatGwei(amount)).toFixed(1);
    }
  } catch (e) {
    console.log("get merkle drop reward error " + e.toString());
  }
  return 0;
};
