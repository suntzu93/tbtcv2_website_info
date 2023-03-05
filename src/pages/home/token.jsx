import React, {useState, useEffect} from "react";
import * as Data from "../data";
import styles from './styles.module.css'
import * as Const from '../../utils/Cons';
import Loader from "../../components/loader";
import {ReactComponent as TBTCTokenLogo} from '../../assets/ttoken.svg';
import * as Utils from "../../utils/utils";
import Link from "@mui/material/Link";
import {ReactComponent as ShareLink} from "../../assets/link.svg";

const TokenPage = ({network}) => {
    const [token, setToken] = useState({
        tokenData: {}, isLoading: false,
    });

    useEffect(() => {
        setToken((prevState) => ({
            ...prevState, isLoading: true,
        }));

        Data.getTokenInfo(network).then((info) => {
            setToken({
                tokenData: info, isLoading: false,
            })
        });

    }, [network]);

    return (<div style={{textAlign: "center"}}>
        {token.isLoading ? (<Loader/>) : (
            <div className={styles.div_token}>
                <div className={styles.div_token_info}>
                    <div direction="row" className={styles.div_token_info_row}>
                        <div className={styles.div_token_info_logo}>
                            <TBTCTokenLogo/>
                        </div>
                        <div className={styles.div_token_info_supply}>
                            <div className={styles.div_token_info_supply_title}>tBTC Supply</div>
                            <div className={styles.div_token_info_supply_data}>
                                <div
                                    className={styles.div_token_info_supply_value}>{Data.formatWeiDecimal(token.tokenData.totalSupply)}</div>
                                <div className={styles.div_token_info_supply_sub_title}>tBTC</div>
                            </div>

                            <div className={styles.div_underlined}></div>
                        </div>
                    </div>
                </div>
                <div className={styles.div_token_info}>
                    <div direction="column" className={styles.div_token_info_column}>
                        <div className={styles.div_token_info_stats_title}>tBTC System Stats
                        </div>
                        <div className={styles.div_token_info_stats_item}>
                            <div className={styles.div_token_info_stats_item_title}>Address</div>
                            <div className={styles.div_token_info_stats_item_data}>
                            <div className={styles.div_token_info_stats_item_data_value_address}>
                                <Link
                                    target="_blank"
                                    underline="hover"
                                    href={Utils.getEtherAddressLink() + token.tokenData.address}
                                    className={styles.link}
                                >
                                    {Data.formatStringEnd(token.tokenData.address)}
                                </Link>
                                <ShareLink/>
                            </div>
                            </div>
                        </div>

                        <div className={styles.div_token_info_stats_item}>
                            <div className={styles.div_token_info_stats_item_title}>tBTC Minted</div>
                            <div className={styles.div_token_info_stats_item_data}>
                                <div
                                    className={styles.div_token_info_stats_item_data_value}>{Data.formatWeiDecimal(token.tokenData.totalMint)}</div>
                                <div className={styles.div_underlined}></div>
                            </div>
                        </div>
                        <div className={styles.div_token_info_stats_item}>
                            <div className={styles.div_token_info_stats_item_title}>tBTC Burned</div>
                            <div className={styles.div_token_info_stats_item_data}>
                                <div
                                    className={styles.div_token_info_stats_item_data_value}>{Data.formatWeiDecimal(token.tokenData.totalBurn)}</div>
                                <div className={styles.div_underlined}></div>
                            </div>
                        </div>
                        <div className={styles.div_token_info_stats_item}>
                            <div className={styles.div_token_info_stats_item_title}>tBTC Holders</div>
                            <div className={styles.div_token_info_stats_item_data}>
                                <div
                                    className={styles.div_token_info_stats_item_data_value}>{token.tokenData.currentTokenHolders}</div>
                                <div className={styles.div_underlined}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
        }

    </div>)
        ;
}

export default TokenPage;