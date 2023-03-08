import React, {useState, useEffect} from "react";
import * as Data from "../data";
import styles from './styles.module.css'
import RedeemTable from "../../components/table/redeem";

const RedeemsPage = ({network, isSearch, searchInput}) => {
    const [pageData, setPageData] = useState({
        rowData: [],
        isLoading: false,
        totalPassengers: 0,
    });

    useEffect(() => {
        setPageData((prevState) => ({
            ...prevState,
            isLoading: true
        }));

        Data.getRedeems(network, isSearch, searchInput).then((info) => {
            const totalPassengers = info?.length;
            setPageData({
                isLoading: false,
                rowData: info,
                totalPassengers: totalPassengers
            });
        });

    }, [network]);

    return (
        <div>
            <div className={styles.operator_detail_header}>
                <div className={styles.operator_detail_header_address}>
                    {
                        isSearch ? (
                            <>
                                <h4>Search : {searchInput}</h4>
                                <span>{pageData.totalPassengers} redeems</span>
                            </>
                        ) : (
                            <>
                                <h3>Redeems</h3>
                                <span>{pageData.totalPassengers} redeems</span></>
                        )
                    }
                </div>
                {/*<div className={styles.operator_detail_header_value}>*/}
                {/*    <div className={styles.operator_detail_header_value_item}>*/}
                {/*        <div className={styles.operator_detail_header_value_item_lable}>redeem state*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <div>{pageData.redeemStatus === "loading..." ? pageData.redeemStatus : pageData.redeemStatus ? "running" : "pausing"}</div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <div style={{textAlign:"center"}}>
                <h6>This function is currently being implemented.</h6>
            </div>
            {/*<div className={styles.table_content}>*/}
            {/*    <RedeemTable*/}
            {/*        columns={Data.redeem_columns}*/}
            {/*        data={pageData.rowData}*/}
            {/*        isLoading={pageData.isLoading}*/}
            {/*        network={network}*/}
            {/*    />*/}
            {/*</div>*/}
        </div>
    );
}

export default RedeemsPage;