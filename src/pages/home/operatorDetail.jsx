import React, {useState, useEffect} from "react";
import * as Data from "../data";
import styles from './styles.module.css'
import * as Const from '../../utils/Cons';
import {ReactComponent as ShareLink} from "../../assets/link.svg";
import Link from "@mui/material/Link";
import * as Utils from "../../utils/utils";
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from "@mui/lab/TabPanel";
import TabList from '@mui/lab/TabList';
import TabContext from "@mui/lab/TabContext";
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import {TIME_LOCK_DEAUTHORIZATION} from "../../utils/Cons";
import Loader from "../../components/loader";
import Tooltip from "@mui/material/Tooltip";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";


function OperatorDetail({operator, currentBlock, nodeBalance}) {
    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab style={{textTransform: 'none', color: "black"}} label="Overview" value="1"/>
                        <Tab style={{textTransform: 'none', color: "black"}} label="Beacon Groups" value="2"/>
                    </TabList>
                </Box>
                <TabPanel value="1" className={styles.operator_detail}>{Overview(operator, nodeBalance)}</TabPanel>
                <TabPanel value="2" className={styles.operator_detail}>{BeaconGroup(operator, currentBlock)}</TabPanel>
            </TabContext>
        </Box>
    );
}

function Overview(operator, nodeBalance) {

    function getDeAuthorization(isTBTC) {
        if (operator == undefined || operator.events == undefined)
            return
        const events = operator.events;
        const now = Math.floor(Date.now() / 1000);
        let timeLock = 0;
        let amount = 0;
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            if (isTBTC && event.event === "DECREASE_AUTHORIZED_TBTC") {
                const timeStamp = event.timestamp;
                if (timeStamp + TIME_LOCK_DEAUTHORIZATION > now) {
                    timeLock = parseFloat(timeStamp) + TIME_LOCK_DEAUTHORIZATION
                    amount = event.amount
                }
            } else if (!isTBTC && event.event === "DECREASE_AUTHORIZED_RANDOM_BEACON") {
                const timeStamp = event.timestamp;
                if (timeStamp + TIME_LOCK_DEAUTHORIZATION > now) {
                    timeLock = parseFloat(timeStamp) + TIME_LOCK_DEAUTHORIZATION
                    amount = event.amount
                }
            }
        }
        if (timeLock > 0) {
            if (timeLock * 1000 > new Date().getTime()) {
                return Data.formatWeiDecimal(amount) + " - Locked Until : " + Data.formatDate(timeLock * 1000);
            } else {
                return Data.formatWeiDecimal(amount);
            }
        }

        return "..."
    }

    function formatEvent(event, isRandomBeaconEvent, amount) {
        if (event == undefined)
            return

        switch (event) {
            case "STAKED":
                return "Operator staked " + amount + " token."
            case "TOPUP":
                return "Operator stake more " + amount + " token."
            case "UNSTAKE":
                return "Operator has unstaked " + amount + " token."
            case "AUTHORIZED_RANDOM_BEACON":
                return "The RandomBeacon contract has been authorized " + amount + " token."
            case "AUTHORIZED_TBTC":
                return "The WalletRegistry contract has been authorized " + amount + " token."
            case "DECREASE_AUTHORIZED_RANDOM_BEACON":
                return "Operator has reduced " + amount + " token from RandomBeacon contract."
            case "DECREASE_AUTHORIZED_TBTC":
                return "Operator has reduced " + amount + " token from WalletRegistry contract."
            case "REGISTERED_OPERATOR":
                return isRandomBeaconEvent ?
                    "Operator has registered operator address with RandomBeacon contract."
                    : "Operator has registered operator address with WalletRegistry contract."
            case "BOND_OPERATOR":
                return "Operator has registered operator address on SimplePREApplication contract."
            case "JOINED_SORTITION_POOL":
                return isRandomBeaconEvent ?
                    "Operator has been joined the Sortition pool with RandomBeacon contract."
                    : "Operator been joined the Sortition pool with WalletRegistry contract."
            case "SLASHED":
                return "Operator has been penalized " + amount + " token for bad behavior."
            case "WITHDRAW_REWARD":
                return "Operator withdraws " + amount + " reward token to wallet."
        }
    }

    return (
        <div className={styles.operator_detail_overview}>

            <div style={{flex: "1 1 0%"}}>
                <table className={styles.operator_detail_overview_table}>
                    {/* --------- Stake---------*/}
                    <tbody>
                    <tr>
                        <th colSpan="2" style={{fontWeight: "bold"}}>Stake</th>
                    </tr>
                    </tbody>
                    <tbody className={styles.operator_detail_overview_table_tbody}>
                    <tr>
                        <th>Stake</th>
                        <td>
                            {"T " + Data.formatWeiDecimal(operator.stakedAmount)}
                        </td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>
                            {Data.formatDate(operator.stakedAt * 1000)}
                        </td>
                    </tr>
                    </tbody>
                    {/* --------- Roles---------*/}
                    <tbody>
                    <tr>
                        <th colSpan="2" style={{fontWeight: "bold"}}>Roles</th>
                    </tr>
                    </tbody>
                    <tbody className={styles.operator_detail_overview_table_tbody}>
                    <tr>
                        <th>Node</th>
                        <td style={{display: "flow-root"}}>
                            <Link
                                target="_blank"
                                underline="hover"
                                href={Utils.getEtherAddressLink() + operator.address}
                                className={styles.link}
                            >
                                {Data.formatString(operator.address)}
                            </Link>
                            <ShareLink/>
                            <p style={{fontSize: "0.875rem"}}>balance: {nodeBalance} eth</p>
                        </td>
                    </tr>
                    <tr>
                        <th>Owner</th>
                        <td>
                            <Link
                                target="_blank"
                                underline="hover"
                                href={Utils.getEtherAddressLink() + operator.owner}
                                className={styles.link}
                            >
                                {Data.formatString(operator.owner)}
                            </Link>
                            <ShareLink/>
                        </td>
                    </tr>
                    <tr>
                        <th>Beneficiary</th>
                        <td>
                            <Link
                                target="_blank"
                                underline="hover"
                                href={Utils.getEtherAddressLink() + operator.beneficiary}
                                className={styles.link}
                            >
                                {Data.formatString(operator.beneficiary)}
                            </Link>
                            <ShareLink/>
                        </td>
                    </tr>
                    <tr>
                        <th>Authorizer</th>
                        <td>
                            <Link
                                target="_blank"
                                underline="hover"
                                href={Utils.getEtherAddressLink() + operator.authorizer}
                                className={styles.link}
                            >
                                {Data.formatString(operator.authorizer)}
                            </Link>
                            <ShareLink/>
                        </td>
                    </tr>
                    </tbody>

                    {/* --------- Authorizations---------*/}
                    <tbody>
                    <tr>
                        <th colSpan="2" style={{fontWeight: "bold"}}>Authorizations</th>
                    </tr>
                    </tbody>
                    <tbody className={styles.operator_detail_overview_table_tbody}>
                    <tr>
                        <th>TBTC</th>
                        <td>
                            {
                                Data.formatWeiDecimal(operator.tBTCAuthorizedAmount)
                            }
                            {
                                operator.tBTCAuthorized ? (
                                    <CheckSharpIcon style={{color: "green"}}/>
                                ) : (
                                    <CloseSharpIcon style={{color: "red"}}/>
                                )
                            }

                        </td>
                    </tr>
                    <tr>
                        <th>Random Beacon</th>
                        <td>
                            {
                                Data.formatWeiDecimal(operator.randomBeaconAuthorizedAmount)
                            }
                            {
                                operator.randomBeaconAuthorized ? (
                                    <CheckSharpIcon style={{color: "green"}}/>
                                ) : (
                                    <CloseSharpIcon style={{color: "red"}}/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>PRE App</th>
                        <td>
                            <CheckSharpIcon style={{color: "green"}}/>
                        </td>
                    </tr>
                    </tbody>
                    {/* --------- Deauthorization ---------*/}
                    <tbody>
                    <tr>
                        <th colSpan="2" style={{fontWeight: "bold"}}>Deauthorization</th>
                    </tr>
                    </tbody>
                    <tbody className={styles.operator_detail_overview_table_tbody}>
                    <tr>
                        <th>TBTC</th>
                        <td>
                            {getDeAuthorization(true)}
                        </td>
                    </tr>
                    <tr>
                        <th>Random Beacon</th>
                        <td>
                            {getDeAuthorization(false)}
                        </td>
                    </tr>
                    </tbody>
                    {/* --------- Slashed ---------*/}
                    <tbody>
                    <tr>
                        <th colSpan="2" style={{fontWeight: "bold"}}>Misbehaved</th>
                    </tr>
                    </tbody>
                    <tbody className={styles.operator_detail_overview_table_tbody}>
                    <tr>
                        <th>Total slashed amount</th>
                        <td>
                            {Data.formatWeiDecimal(operator.totalSlashedAmount)}
                        </td>
                    </tr>
                    <tr>
                        <th>Rewards Ban Duration</th>
                        <td>
                            {operator.poolRewardBanDuration > 0 ?
                                Data.formatDate(operator.poolRewardBanDuration * 1000) : "No ban"}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style={{flex: "1 1 0%"}}>
                <h4><strong>Log</strong></h4>
                {operator?.events?.map(eventEntity => {
                    const txHash = eventEntity.txHash;
                    const from = eventEntity.from;
                    const to = eventEntity.to;
                    const event = eventEntity.event;
                    const timestamp = eventEntity.timestamp;
                    const amount = eventEntity.amount;
                    return (
                        <div className={styles.log_item}>
                            <div className={styles.log_item_lable}>
                                <span>{Data.formatTimeToText(timestamp * 1000)}</span> @
                                <span><a target="_blank"
                                         href={Utils.getEtherTxHashLink() + txHash}>{Data.formatString(txHash)}</a></span> {" by "}
                                <a target="_blank"
                                   href={Utils.getEtherAddressLink() + from}>{Data.formatString(from)} </a>
                            </div>
                            <div>
                                <strong>{event.replaceAll("_", " ")}</strong>
                                <div>
                                    {formatEvent(event, eventEntity.isRandomBeaconEvent, Data.formatWeiDecimal(amount))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

function BeaconGroup(operator, currentBlock) {

    function checkGroupState(group) {
        //259_200 is group life time, ~30 days assuming 15s block time
        if (group.terminated || parseInt(group.createdAtBlock) + 259200 < currentBlock) {
            return "Inactive"
        } else {
            return "Active"
        }
    }

    return (<div>
            <h4>
                <strong>Random Beacon Groups</strong>
            </h4>
            <Paper sx={{backgroundColor: "transparent", boxShadow: "0"}}>
                <TableContainer>
                    <table className={styles.beacon_groups_table}>
                        <thead>
                        <tr>
                            <th>Group</th>
                            <th>Total Slot</th>
                            <th>Unique Member</th>
                            <th><Tooltip
                                title={"An operator can fill multiple membership slots in a group, and will then earn a multiple of rewards."}><span>{"Weight"}</span></Tooltip>
                            </th>
                            <th>Total Faults</th>
                            <th>Total Slashed Amount</th>
                            <th>Create At</th>
                            <th>State</th>
                        </tr>
                        </thead>

                        <tbody>
                        {operator?.randomBeaconGroupMemberships?.map(memberShip => {
                            const weight = memberShip.count;
                            const group = memberShip.group;
                            const id = group.id;
                            const size = group.size;
                            const uniqueMemberCount = group.uniqueMemberCount;
                            const faults = group.misbehavedCount;
                            const slashAmount = group.totalSlashedAmount;
                            const createAt = group.createdAt;
                            return (
                                <tr>
                                    <td><Link
                                        target="_blank"
                                        underline="hover"
                                        href={Utils.getDomain() + "?group=" + id}
                                        className={styles.link}
                                    >
                                        {Data.formatString(id)}
                                    </Link></td>
                                    <td>{size}</td>
                                    <td>{uniqueMemberCount}</td>
                                    <td>{weight}</td>
                                    <td>{faults}</td>
                                    <td>{Data.formatWeiDecimal(slashAmount)}</td>
                                    <td>{Data.formatTimeToText(createAt * 1000)}</td>
                                    <td>{checkGroupState(group)}</td>

                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </TableContainer>
            </Paper>
        </div>
    );
}

const OperatorDetailPage = () => {
    const [pageData, setPageData] = useState({
        rowData: {},
        isLoading: true,
    });
    const [operator, setOperator] = useState();
    const [currentBlock, setCurrentBlock] = useState();
    const [nodeBalance, setNodeBalance] = useState("loading...");
    const [merkleDropReward, setMerkleDropReward] = useState("loading...");

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const operator = query.get("operator");
        setOperator(operator);

        Data.getOperatorDetail(operator).then((info) => {
            setPageData({
                isLoading: false,
                rowData: info,
            });

            let nodeAddress = info.address;
            Data.getBalanceOfAddress(nodeAddress).then((balance) => {
                setNodeBalance(balance);
            })

            Data.getAvailableMerkleDropReward(info.id).then((reward) => {
                setMerkleDropReward(reward)
            })
        });

        Data.getCurrentBlockNumber().then((info) => {
            setCurrentBlock(info);
        });

    }, []);

    function calculatePercentAuthorizedOfStake(authorizedAmount, stakedAmount) {
        if (stakedAmount == 0 || authorizedAmount == 0)
            return 0
        return parseFloat((authorizedAmount / stakedAmount) * 100).toFixed(2);
    }

    return (<>
            {
                pageData.isLoading ? (
                    <div style={{textAlign: "center"}}>
                        <Loader/>
                    </div>
                ) : (
                    <div>
                        <div className={styles.operator_detail_header}>
                            <div className={styles.operator_detail_header_address}>
                                <h3><Link
                                    target="_blank"
                                    underline="hover"
                                    href={Utils.getEtherAddressLink() + operator}
                                    className={styles.link}
                                >
                                    {Data.formatString(operator)}
                                </Link>
                                    <ShareLink/>
                                </h3>
                                <span>Operator</span>
                            </div>
                            <div className={styles.operator_detail_header_value}>
                                <div className={styles.operator_detail_header_value_item}>
                                    <div className={styles.operator_detail_header_value_item_lable}>TBTC authorized
                                    </div>
                                    <div>
                                        <div>{Data.formatWeiDecimal(pageData.rowData.tBTCAuthorizedAmount)}<span
                                            className={styles.span_t_token}>{" T"}</span></div>
                                        <div
                                            className={styles.operator_detail_header_value_item_percent}>
                                            {calculatePercentAuthorizedOfStake(pageData.rowData.tBTCAuthorizedAmount, pageData.rowData.stakedAmount)}%
                                            of staked
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.operator_detail_header_value_item}>
                                    <div className={styles.operator_detail_header_value_item_lable}>random beacon
                                        authorized
                                    </div>
                                    <div>
                                        <div>{Data.formatWeiDecimal(pageData.rowData.randomBeaconAuthorizedAmount)}<span
                                            className={styles.span_t_token}>{" T"}</span></div>
                                        <div
                                            className={styles.operator_detail_header_value_item_percent}>
                                            {calculatePercentAuthorizedOfStake(pageData.rowData.randomBeaconAuthorizedAmount, pageData.rowData.stakedAmount)}%
                                            of staked
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.operator_detail_header_value_item}>
                                    <div className={styles.operator_detail_header_value_item_lable}>staked</div>
                                    <div>
                                        <div>{Data.formatWeiDecimal(pageData.rowData.stakedAmount)}<span
                                            className={styles.span_t_token}>{" T"}</span></div>
                                    </div>
                                </div>
                                <div className={styles.operator_detail_header_value_item}>
                                    <div className={styles.operator_detail_header_value_item_lable}> faults</div>
                                    <div>
                                        <div>{pageData.rowData.misbehavedCount}</div>
                                    </div>
                                </div>
                                <div className={styles.operator_detail_header_value_item}>
                                    <div className={styles.operator_detail_header_value_item_lable}>available reward
                                    </div>
                                    <div>
                                        {/*<div>{Data.formatWeiDecimal(pageData.rowData.availableReward)}<span*/}
                                        {/*    className={styles.span_t_token}>{" T"}</span></div>*/}
                                        {/*TODO: Have to include SortitionPool reward here*/}
                                        <Tooltip title={"Does not include reward from SortitionPool"}>
                                            <div>{merkleDropReward !== "loading..." ? Data.formatNumberToDecimal(merkleDropReward) : merkleDropReward}<span
                                                className={styles.span_t_token}>{" T"}</span></div>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className={styles.operator_detail_header_value_item}>
                                    <div className={styles.operator_detail_header_value_item_lable}>rewards dispensed
                                    </div>
                                    <div>
                                        <div>{Data.formatWeiDecimal(pageData.rowData.rewardDispensed)}<span
                                            className={styles.span_t_token}>{" T"}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <OperatorDetail operator={pageData.rowData} currentBlock={currentBlock}
                                        nodeBalance={nodeBalance}/>
                    </div>
                )
            }</>

    );
}

export default OperatorDetailPage;