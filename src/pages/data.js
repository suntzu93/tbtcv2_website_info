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

const queryDeposits = `
  query Depists($id: String){
  }
`;

const queryRedeems = `
query Redeems($first: Int,$skip:Int, $orderBy: BigInt, $orderDirection: String){

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
  return parseFloat(data / Const.SATOSHI_BITCOIN).toFixed(2);
};

export const formatGwei = (value) => {
  return parseFloat(value / Const.DECIMAL_ETH).toFixed(2);
}

export const formatNumberDecimal = (value) => {
  return new Intl.NumberFormat().format(formatGwei(value));
}

export const formatNumber = (value) => {
  let newValue = value / Const.DECIMAL_ETH;
  const format = COUNT_FORMATS.find(format => (newValue < format.limit));
  newValue = (1000 * newValue / format.limit);
  newValue = Math.round(newValue * 10) / 10;
  return (newValue + format.letter);
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

export const calculateTimeMoment = (timestamp) => {
  return calculateDuationActive(
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


export const formatDepositsData = (rawData) =>
  rawData.map((item) => ({
    id: item.id,
    status: item.status,
    depositor: item.depositor,
    amount: item.amount,
    walletPubKeyHash: item.walletPubKeyHash,
    fundingTxHash: item.fundingTxHash,
    fundingOutputIndex: item.fundingOutputIndex,
    blindingFactor: item.blindingFactor,
    refundPubKeyHash: item.refundPubKeyHash,
    refundLocktime: item.refundLocktime,
    vault: item.vault,
    depositTimestamp: item.depositTimestamp,
    updateTime: item.updateTimestamp,
    transactions: item.transactions
  }));


export const formatRedeems = (rawData) =>
  rawData.map((item) => ({
    id: item.id,
    status: item.status,
    redeemer: item.redeemer,
    amount: item.amount,
    walletPubKeyHash: item.walletPubKeyHash,
    redeemerOutputScript: item.redeemerOutputScript,
    redemptionTxHash: item.redemptionTxHash,
    treasuryFee: calculateTreasuryFee(item.treasuryFee),
    txMaxFee: calculateTxMaxFee(item.txMaxFee),
    completedTxHash: item.completedTxHash,
    redemptionTimestamp: item.redemptionTimestamp,
    updateTime: item.updateTimestamp,
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

export const getDeposits = async (network) => {
  const emptyData = JSON.parse(`[]`);
  try {
    // switchNetworkClient(network);
    // const indexerAddress = "0x4167eb613d784c910f5dc0f3f0515d61ec6ec8df";
    // if (indexerAddress.length > 0) {
    //   const data = await client.query({
    //     query: gql(allocationsQuery),
    //     variables: {
    //       id: indexerAddress.toLowerCase()
    //     }
    //   });
    //   if (data.data.indexer.allocations == undefined || data.data.indexer.allocations == 'undefined') {
    //     return emptyData;
    //   }
    const mockData = MockDeposits;

    return formatDepositsData(mockData);
    // }

  } catch (e) {
    // console.log("error to fetch data " + e);
    return emptyData;
  }
};

export const getRedeems = async (network, page) => {
  // const emptyData = JSON.parse(`[]`);
  // try {
  //   switchNetworkClient(network);
  //   const skip = page - 1;
  //   const data = await client.query({
  //     query: gql(querySubgraphs),
  //     variables: {
  //       first: 1000,
  //       skip: 0,
  //       orderBy: 'signalAmount',
  //       orderDirection: "desc"
  //     }
  //   });
  //   const formatSubgraphs = formatSubgraphData(data.data.subgraphs);
  //   const formatSubgraphDupplicate = removeDupplicateIpfs(formatSubgraphs,"ipfsHash");
  //   return formatSubgraphDupplicate;
  // } catch (e) {
  //   console.log("error to fetch data " + e);
  //   return emptyData;
  // }
  const mockData = MockRedeems;

  return formatRedeems(mockData);
};
