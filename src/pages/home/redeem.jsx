import React, {useState, useEffect} from "react";
import * as Data from "../data";
import SubgraphTable from "../../components/table/redeem";
import styles from './styles.module.css'

const RedeemsPage = ({network, isSearch, searchInput}) => {
    const [pageData, setPageData] = useState({
        rowData: [],
        isLoading: false,
        totalPassengers: 0,
    });

    useEffect(() => {
        setPageData((prevState) => ({
            ...prevState,
            isLoading: true,
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

            <div className={styles.allocation_header}>
                <h3>All Redeems</h3>
                <span>{pageData.totalPassengers} redeems</span>
            </div>
            <div className={styles.table_content}>
                <SubgraphTable
                    columns={Data.redeem_columns}
                    data={pageData.rowData}
                    isLoading={pageData.isLoading}
                    network={network}
                />
            </div>
        </div>
    );
}

export default RedeemsPage;