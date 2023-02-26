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

    useEffect(() => {
        setPageData((prevState) => ({
            ...prevState,
            rowData: [],
            isLoading: true,
        }));

        Data.getOperators(isSearch, searchInput).then((info) => {
            const totalPassengers = info.length;
            setPageData({
                isLoading: false,
                rowData: info,
                totalPassengers: totalPassengers
            });
        });

    }, [isSearch]);


    return (
        <div>
            <div className={styles.deposit_header}>
                <h3>Operators</h3>
                <span>{pageData.totalPassengers} operators</span>
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