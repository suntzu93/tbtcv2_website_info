import React, {useState, useEffect} from "react";
import * as Data from "../data";
import DepositTable from "../../components/table/deposit";
import styles from './styles.module.css'

const DepositPage = ({network, isSearch, searchInput}) => {
    const [pageData, setPageData] = useState({
        rowData: [],
        isLoading: false,
        pageNumber: 1,
        totalPassengers: 0,
        mintingStatus: "loading..."
    });

    useEffect(() => {
        setPageData((prevState) => ({
            ...prevState,
            rowData: [],
            isLoading: true,
        }));

        Data.getDeposits(network, isSearch, searchInput).then((info) => {
            const totalPassengers = info.length;
            if(info?.deposits === undefined){
                setPageData({
                    isLoading: false,
                    rowData: [],
                    mintingStatus: info.statsRecord?.mintingStatus,
                    tbtctoken: info.tbtctoken,
                    totalPassengers: 0
                });
            }else {
                setPageData({
                    isLoading: false,
                    rowData: Data.formatDepositsData(info?.deposits),
                    mintingStatus: info.statsRecord?.mintingStatus,
                    tbtctoken: info.tbtctoken,
                    totalPassengers: totalPassengers
                });
            }

        });

    }, [network, isSearch]);


    return (
        <div>
            <div className={styles.operator_detail_header}>
                <div className={styles.operator_detail_header_address}>
                    {
                        isSearch ? (
                            <>
                                <h4>Search : {searchInput}</h4>
                                <span>{pageData.totalPassengers} deposits</span>
                            </>
                        ) : (
                            <>
                                <h3>Deposits</h3>
                                <span>{pageData.totalPassengers} deposits</span></>
                        )
                    }
                </div>
                <div className={styles.operator_detail_header_value}>
                    <div className={styles.operator_detail_header_value_item}>
                        <div className={styles.operator_detail_header_value_item_lable}>total minted
                        </div>
                        <div>
                            <div>{pageData.tbtctoken === undefined ? "loading..." : Data.formatWeiDecimal(pageData.tbtctoken?.totalMint)}<span
                                className={styles.span_t_token}>{" tBTC"}</span></div>
                        </div>
                    </div>
                    <div className={styles.operator_detail_header_value_item}>
                        <div className={styles.operator_detail_header_value_item_lable}>minting state
                        </div>
                        <div>
                            <div>{pageData.mintingStatus === "loading..." ? pageData.mintingStatus : pageData.mintingStatus ? "running" : "pausing"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.table_content}>
                <DepositTable
                    columns={Data.deposit_columns}
                    data={pageData.rowData}
                    isLoading={pageData.isLoading}
                    network={network}
                />
            </div>
        </div>
    );
}

export default DepositPage;