import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import * as Const from '../utils/Cons';
import moment from 'moment';

export var client = new ApolloClient({
  uri: Const.MAINNET_API_GRAPH,
  cache: new InMemoryCache()
});

const allocationsQuery = `
  query IndexerAllocations($id: String){
    indexer(first: 1000,id: $id){
      allocations(where:{status: Active}){
        id,
        allocatedTokens,
        createdAt
        subgraphDeployment{
          deniedAt,
          ipfsHash,
          stakedTokens,
          signalledTokens,
          network{
            id
          }
          versions{
            subgraph{
              displayName
            }
          }
        }
      }
    }
  }
`;

const queryIndexer = `
  query OperatorIndexer($id: String){
      indexers(first: 1000) {
        id
        account {
          operators(where: {id : $id}) {
            id
          }
        }
      }
  }
`
const querySubgraphs = `
query QuerySubgraphs($first: Int,$skip:Int, $orderBy: BigInt, $orderDirection: String){
  subgraphs(first: $first, skip: $skip,where:{active:true}, orderBy: $orderBy , orderDirection: $orderDirection){
        id,
        displayName,
        currentVersion{
          id,
          subgraphDeployment{
            deniedAt,
            ipfsHash,
            stakedTokens,
            signalledTokens,
            createdAt,
            network{
              id
            }
          }
        }
  }
}
`;

export const allocation_columns = [
  {
    header: "Name",
    accessor: "originalName",
    numeric: false,
  },
  {
    header: "Subgraph",
    accessor: "ipfsHash",
    numeric: false,
  },
  {
    header: "Network",
    accessor: "network",
    numeric: false,
  },
  {
    header: "Allocated",
    accessor: "allocatedTokens",
    numeric: false,
  },
  {
    header: "Current Signalled",
    accessor: "signalledTokens",
    numeric: false,
  },
  {
    header: "Proportion",
    accessor: "proportion",
    numeric: true,
  },
  {
    header: "Allocate ID",
    accessor: "allocateId",
    numeric: false,
  },
  {
    header: "Active Duration",
    accessor: "activeDuration",
    numeric: true,
  }
];


export const actions_columns = [
  {
    header: "Subgraph",
    accessor: "ipfsHash",
  },
  {
    header: "Allocated",
    accessor: "allocatedTokensFormat",
  },
  {
    header: "Allocate ID",
    accessor: "allocateId",
  },
  {
    header: "POI",
    accessor: "poiFormat",
  },
  {
    header: "Status",
    accessor: "status",
  }
];


export const subgraphs_columns = [
  {
    header: "Name",
    accessor: "originalName",
    numeric: false,
  },
  {
    header: "Subgraph",
    accessor: "ipfsHash",
    numeric: false,
  },
  {
    header: "Network",
    accessor: "network",
    numeric: false,
  },
  {
    header: "Current Signalled",
    accessor: "signalledTokens",
    numeric: true,
  },
  {
    header: "Proportion",
    accessor: "proportion",
    numeric: true,
  },
  {
    header: "Create time",
    accessor: "createdAt",
    numeric: true,
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

export const formatGwei = (value) => {
  return value / Const.DECIMAL
}

export const formatNumberDecimal = (value) => {
  return new Intl.NumberFormat().format(formatGwei(value));
}

export const formatNumber = (value) => {
  let newValue = value / Const.DECIMAL;
  const format = COUNT_FORMATS.find(format => (newValue < format.limit));
  newValue = (1000 * newValue / format.limit);
  newValue = Math.round(newValue * 10) / 10;
  return (newValue + format.letter);
}

function calculateDuationActive(date) {
  const day = date.days();
  const hours = date.hours();
  const minutes = date.minutes();
  return `${day < 10 ? "0" + day : day}d ${hours < 10 ? "0" + hours : hours}h ${minutes < 10 ? "0" + minutes : minutes}m`;
}

function formatDate(date) {
  return new Date(date).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

function removeDupplicateIpfs(arr, index) {
  const unique = arr
    .map(e => e[index])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);

  return unique;
}

export const formatRowData = (rawData) =>
  rawData.map((item) => ({
    allocateId: item.id,
    allocatedTokens: item.allocatedTokens,
    originalName: item.subgraphDeployment.versions[0].subgraph.displayName,
    ipfsHash: item.subgraphDeployment.ipfsHash,
    stakedTokens: item.subgraphDeployment.stakedTokens,
    signalledTokens: item.subgraphDeployment.signalledTokens,
    proportion: item.subgraphDeployment.signalledTokens == "0" ? "0" : item.subgraphDeployment.stakedTokens == "0" ? "0" :
      parseFloat((item.subgraphDeployment.signalledTokens / item.subgraphDeployment.stakedTokens * 100).toFixed(4)),
    activeDuration: calculateDuationActive(moment.duration(moment(new Date().getTime()).diff(moment(item.createdAt * 1000)))),
    createdAt: item.createdAt * 1000,
    network: item.subgraphDeployment.network == null ? "mainnet" : item.subgraphDeployment.network?.id,
    deniedAt: item.subgraphDeployment.deniedAt
  }));


export const formatSubgraphData = (subgraphs) =>
  subgraphs.map((item) => ({
    ipfsHash: item.currentVersion.subgraphDeployment.ipfsHash,
    stakedTokens: item.currentVersion.subgraphDeployment.stakedTokens,
    signalledTokens: new Number(formatGwei(item.currentVersion.subgraphDeployment.signalledTokens)),
    signalledTokensFormat: formatNumber(item.currentVersion.subgraphDeployment.signalledTokens),
    proportion: item.currentVersion.subgraphDeployment.signalledTokens == "0" ? "0" : item.currentVersion.subgraphDeployment.stakedTokens == "0" ? "0" :
      parseFloat((item.currentVersion.subgraphDeployment.signalledTokens / item.currentVersion.subgraphDeployment.stakedTokens * 100).toFixed(4)),
    createdAt: formatDate(item.currentVersion.subgraphDeployment.createdAt * 1000),
    network: item.currentVersion.subgraphDeployment.network == null ? "mainnet" : item.currentVersion.subgraphDeployment.network?.id,
    originalName: item.displayName,
    currentVersionId: item.currentVersion.id,
    subgraphId: item.id,
    deniedAt: item.currentVersion.subgraphDeployment.deniedAt
  }));


export const formatActions = (actions) =>
  actions.map((item) => ({
    id: item.id,
    poiFormat: item.poi == "NULL" ? "..." : formatString(item.poi),
    poiFull: item.poi,
    allocateId: formatString(item.allocateId),
    allocateIdFull: item.allocateId,
    allocatedTokens: item.allocatedTokens,
    allocatedTokensFormat: new Intl.NumberFormat().format(item.allocatedTokens),
    ipfsHash: formatString(item.ipfsHash),
    ipfsHashFull: item.ipfsHash,
    status: item.status
  }));

const switchNetworkClient = (network) => {
  if (network === Const.NETWORK_MAINNET) {
    if (client.uri !== Const.MAINNET_API_GRAPH) {
      client = new ApolloClient({
        uri: Const.MAINNET_API_GRAPH,
        cache: new InMemoryCache()
      });
    }
  } else {
    if (client.uri !== Const.TESTNET_API_GRAPH) {
      client = new ApolloClient({
        uri: Const.TESTNET_API_GRAPH,
        cache: new InMemoryCache()
      });
    }
  }
}

const getIndexerAddr = async (network, account) => {
  const emptyData = "";
  try {
    switchNetworkClient(network);
    const data = await client.query({
      query: gql(queryIndexer),
      variables: {
        id: account.toLowerCase()
      }
    });

    const indexers = data.data.indexers;
    var indexerAddress = "";
    indexers.forEach((indexer) => {
      const operators = indexer.account.operators;
      if (operators.length != 0) {
        operators.forEach((operator) => {
          const operatorId = operator.id;
          if (operator.id.toLowerCase() === account.toLowerCase()) {
            indexerAddress = indexer.id;

          }
        })
      }
    })

    return indexerAddress
  } catch (e) {
    console.log("error to fetch data " + e);
    return emptyData;
  }
}

export const getDeposits = async (network) => {
  const emptyData = JSON.parse(`[]`);
  try {
    switchNetworkClient(network);
    const indexerAddress = "0x4167eb613d784c910f5dc0f3f0515d61ec6ec8df";
    if (indexerAddress.length > 0) {
      const data = await client.query({
        query: gql(allocationsQuery),
        variables: {
          id: indexerAddress.toLowerCase()
        }
      });
      if (data.data.indexer.allocations == undefined || data.data.indexer.allocations == 'undefined') {
        return emptyData;
      }
      return formatRowData(data.data.indexer.allocations);
    }
    return emptyData;
  } catch (e) {
    // console.log("error to fetch data " + e);
    return emptyData;
  }
};

export const getRedeems = async (network, page) => {

  const emptyData = JSON.parse(`[]`);
  try {
    switchNetworkClient(network);
    const skip = page - 1;
    const data = await client.query({
      query: gql(querySubgraphs),
      variables: {
        first: 1000,
        skip: 0,
        orderBy: 'signalAmount',
        orderDirection: "desc"
      }
    });
    const formatSubgraphs = formatSubgraphData(data.data.subgraphs);
    const formatSubgraphDupplicate = removeDupplicateIpfs(formatSubgraphs,"ipfsHash");
    return formatSubgraphDupplicate;
  } catch (e) {
    console.log("error to fetch data " + e);
    return emptyData;
  }
};
