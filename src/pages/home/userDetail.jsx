import React, {useState, useEffect} from "react";
import * as Data from "../data";
import styles from './styles.module.css'
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from "@mui/lab/TabPanel";
import TabList from '@mui/lab/TabList';
import TabContext from "@mui/lab/TabContext";
import Loader from "../../components/loader";
import * as Const from "../../utils/Cons";
import DepositTable from "../../components/table/deposit";
import RedeemTable from "../../components/table/redeem";
import Link from "@mui/material/Link";
import * as Utils from "../../utils/utils";
import {ReactComponent as ShareLink} from "../../assets/link.svg";


function UserDetail({user}) {
    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab style={{textTransform: 'none', color: "black"}} label="Deposits" value="1"/>
                        <Tab style={{textTransform: 'none', color: "black"}} label="Redeems" value="2"/>

                    </TabList>
                </Box>
                <TabPanel value="1">{DepositPanel(user)}</TabPanel>
                <TabPanel value="2">{RedeemPanel(user)}</TabPanel>

            </TabContext>
        </Box>
    );
}

function DepositPanel(user){
    return (<DepositTable
        columns={Data.deposit_columns}
        data={user?.deposits}
        isLoading={false}
        network={Const.DEFAULT_NETWORK}
    />);
}

function RedeemPanel(user){
    return (<RedeemTable
        columns={Data.redeem_columns}
        data={user?.redemptions}
        isLoading={false}
        network={Const.DEFAULT_NETWORK}
    />);
}

const UserDetailPage = () => {
    const [pageData, setPageData] = useState({
        rowData: {},
        isLoading: true,
    });
    const [user, setUser] = useState();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const user = query.get("user");
        setUser(user);

        Data.getUserDetail(user).then((info) => {
            setPageData({
                isLoading: false,
                rowData: info,
            });
        });

    }, []);

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
                                    href={Utils.getEtherAddressLink() + user}
                                    className={styles.link}
                                >
                                    {Data.formatString(user)}
                                </Link>
                                    <ShareLink/>
                                </h3>
                                <span>user</span>
                            </div>
                            <div className={styles.operator_detail_header_value}>
                                <div className={styles.operator_detail_header_value_item}>
                                    <div className={styles.operator_detail_header_value_item_lable}>balance
                                    </div>
                                    <div>
                                        <div><span
                                            style={{fontSize: "25px"}}>{"tBTC "}</span>{Data.formatGwei(pageData.rowData.tokenBalance)}</div>
                                    </div>
                                </div>
                                <div className={styles.operator_detail_header_value_item}>
                                    <div className={styles.operator_detail_header_value_item_lable}> minting debt</div>
                                    <div>
                                        <div><span
                                            style={{fontSize: "25px"}}>{"tBTC "}</span>{Data.formatGwei(pageData.rowData.mintingDebt)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <UserDetail user={pageData.rowData}/>
                    </div>
                )
            }</>

    );
}

export default UserDetailPage;