import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import * as Const from '../utils/Cons';
import moment from 'moment';
import MockDeposits from "../assets/mock_deposit.json"
import MockRedeems from "../assets/mock_redeem.json"
import { SATOSHI_BITCOIN } from "../utils/Cons";

export var client = new ApolloClient({
  uri: Const.MAINNET_API,
  cache: new InMemoryCache()
});

const queryDepositsSearch = `
  query Deposit($user: String){
    deposits(first: 1000,where:{user :$user},orderBy: updateTimestamp,orderDirection: desc) {
      id
      status
      user{
        id
      }
      amount
      newDebt
      actualAmountReceived
      treasuryFee
      walletPubKeyHash
      fundingTxHash
      fundingOutputIndex
      blindingFactor
      refundPubKeyHash
      refundLocktime
      vault
      depositTimestamp
      updateTimestamp
      transactions(orderBy: timestamp,orderDirection:desc){
        timestamp
        txHash
        from
        to
        description
      }
    }
  }
`;

const queryDeposits = `
  query {
    deposits(first: 1000,orderBy: updateTimestamp,orderDirection: desc) {
      id
      status
      user{
        id
      }
      amount
      newDebt
      actualAmountReceived
      treasuryFee
      walletPubKeyHash
      fundingTxHash
      fundingOutputIndex
      blindingFactor
      refundPubKeyHash
      refundLocktime
      vault
      depositTimestamp
      updateTimestamp
      transactions(orderBy: timestamp,orderDirection:desc){
        timestamp
        txHash
        from
        to
        description
      }
    }
  }
`;

const queryRedeems = `
query {
  redemptions{
    id,
    status,
    user{
      id
    },
    amount,
    walletPubKeyHash,
    redeemerOutputScript,
    redemptionTxHash,
    treasuryFee,
    txMaxFee,
    completedTxHash
    redemptionTimestamp
    updateTimestamp
    transactions(orderBy: timestamp,orderDirection:desc){
      timestamp
      txHash
      from
      to
      description
    }
  }
}
`;

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

export const formatString = (data) => {
  if (data == null) {
    return "...";
  }
  const fistSymbol = data.substr(0, 7);
  const endSymbol = data.substr(data.length - 7);
  return fistSymbol + " ... " + endSymbol;
};

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

function formatTimestampToText(date) {
  const month = date.months();
  let day = date.days();
  const hours = date.hours();
  const minutes = date.minutes();
  if (month > 0) {
    day = day + month * 30;
  }
  if (day > 0) {
    return `${day < 10 ? "0" + day : day}d ${hours < 10 ? "0" + hours : hours}h ago`;
  }else{
    return `${hours < 10 ? "0" + hours : hours}h ${
      minutes < 10 ? "0" + minutes : minutes
    }m ago`;
  }
}

function calculateDuationActive(date) {
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
  hex = hex.replace("0x", "");
  hex = hex.padStart(8, "0");
  let littleEndianHex = "";
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    littleEndianHex += hex.slice(i, i + 2);
  }
  return "0x" + littleEndianHex;
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
    refundLocktime: formatDate(parseInt(convertToLittleEndian(item.refundLocktime), 16) * 1000),
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


const switchNetworkClient = (network) => {
  if (network === Const.NETWORK_MAINNET) {
    if (client.uri !== Const.MAINNET_API) {
      client = new ApolloClient({
        uri: Const.MAINNET_API,
        cache: new InMemoryCache()
      });
    }
  } else {
    if (client.uri !== Const.TESTNET_API) {
      client = new ApolloClient({
        uri: Const.TESTNET_API,
        cache: new InMemoryCache()
      });
    }
  }
}

export const getDeposits = async (network,isSearch,searchInput) => {
  const emptyData = JSON.parse(`[]`);
  try {
    switchNetworkClient(network);
    const data = await client.query({
      query: gql(isSearch ? queryDepositsSearch : queryDeposits),
      variables: {
        user: searchInput,
      },
    });
    // console.log(JSON.stringify(data.data.deposits));
    if (data.data.deposits !== undefined) {
      return formatDepositsData(data.data.deposits);
    }
  } catch (e) {
    // console.log("error to fetch data " + e);
    return emptyData;
  }
  return emptyData;
};

export const getRedeems = async (network, page) => {
  const emptyData = JSON.parse(`[]`);
  try {
    switchNetworkClient(network);
    const data = await client.query({
      query: gql(queryRedeems)
    });
    // console.log(JSON.stringify(data.data.deposits));
    if (data.data.redemptions !== undefined) {
      return formatRedeems(data.data.redemptions);
    }
  } catch (e) {
    // console.log("error to fetch data " + e);
    return emptyData;
  }
  return emptyData;
};
