import React, {useState, useEffect} from "react";
import * as Data from "../data";
import DepositTable from "../../components/table/deposit";
import styles from './styles.module.css'
import * as Const from '../../utils/Cons';

const DepositPage = ({network, isSearch, searchInput}) => {
    const [pageData, setPageData] = useState({
        rowData: [],
        isLoading: false,
        pageNumber: 1,
        totalPassengers: 0,
    });

    useEffect(() => {
        setPageData((prevState) => ({
            ...prevState,
            rowData: [],
            isLoading: true,
        }));

        Data.getDeposits(network, isSearch, searchInput).then((info) => {
            const totalPassengers = info.length;
            setPageData({
                isLoading: false,
                rowData: info,
                totalPassengers: totalPassengers
            });
        });

    }, [network, isSearch]);


    return (
        <div>
            <div className={styles.deposit_header}>
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