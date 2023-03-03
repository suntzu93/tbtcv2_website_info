import React, {useState, useEffect} from "react";
import * as Data from "../data";
import OperatorTable from "../../components/table/operator";
import styles from './styles.module.css'

const OperatorPage = ({network, isSearch, searchInput}) => {
    const [pageData, setPageData] = useState({
        rowData: [],
        isLoading: false,
        pageNumber: 1,
        totalPassengers: 0,
    });

    const [stats, setStats] = useState({
        "numOperatorsRegisteredNode" : "loading...",
        "totalTBTCAuthorizedAmount" : 0,
        "totalRandomBeaconAuthorizedAmount" : 0,
        "totalStaked" : 0,
    });

    useEffect(() => {
        setPageData((prevState) => ({
            ...prevState,
            rowData: [],
            isLoading: true,
        }));

        Data.getOperators(isSearch, searchInput).then((info) => {
            const operators = Data.formatOperators(info.operators);
            const totalPassengers = operators.length;
            setPageData({
                isLoading: false,
                rowData: operators,
                totalPassengers: totalPassengers
            });

            setStats(info.statsRecord);
        });

    }, [isSearch]);


    return (
        <div>
            <div className={styles.operator_detail_header}>

                <div className={styles.operator_detail_header_address}>
                    {
                        isSearch ? (
                            <>
                                <h4>Search : {searchInput}</h4>
                                <span>{pageData.totalPassengers} operator</span>
                            </>
                        ) : (
                            <>
                                <h3>Operators</h3>
                                <span>{pageData.totalPassengers} operators</span></>
                        )
                    }
                </div>
                <div className={styles.operator_detail_header_value}>
                    <div className={styles.operator_detail_header_value_item}>
                        <div className={styles.operator_detail_header_value_item_lable}>total registered nodes
                        </div>
                        <div>
                            <div>{stats?.numOperatorsRegisteredNode}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.operator_detail_header_value}>
                    <div className={styles.operator_detail_header_value_item}>
                        <div className={styles.operator_detail_header_value_item_lable}>total authorized tbtc
                        </div>
                        <div>
                            <div>{Data.formatWeiDecimalNoSurplus(stats?.totalTBTCAuthorizedAmount)}<span
                                className={styles.span_t_token}>{" T"}</span></div>
                        </div>
                    </div>
                </div>
                <div className={styles.operator_detail_header_value}>
                    <div className={styles.operator_detail_header_value_item}>
                        <div className={styles.operator_detail_header_value_item_lable}>total authorized beacon
                        </div>
                        <div>
                            <div>{Data.formatWeiDecimalNoSurplus(stats?.totalRandomBeaconAuthorizedAmount)}<span
                                className={styles.span_t_token}>{" T"}</span></div>
                        </div>
                    </div>
                </div>
                <div className={styles.operator_detail_header_value}>
                    <div className={styles.operator_detail_header_value_item}>
                        <div className={styles.operator_detail_header_value_item_lable}>total staked
                        </div>
                        <div>
                            <div>{Data.formatWeiDecimalNoSurplus(stats?.totalStaked)}<span
                                className={styles.span_t_token}>{" T"}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.table_content}>
                <OperatorTable
                    columns={Data.operator_columns}
                    data={pageData.rowData}
                    isLoading={pageData.isLoading}
                    network={network}
                />
            </div>
        </div>
    );
}

export default OperatorPage;