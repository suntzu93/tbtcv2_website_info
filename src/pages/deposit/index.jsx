import React, { useState, useEffect } from "react";
import * as Data from "../data";
import DepositTable from "../../components/table/deposit";
import { ApolloProvider } from '@apollo/client';
import styles from './styles.module.css'
import * as Const from '../../utils/Cons';

const DepositPage = ({network}) => {
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

    Data.getDeposits(network).then((info) => {
      const totalPassengers = info.length;
      setPageData({
        isLoading: false,
        rowData: info,
        totalPassengers: totalPassengers
      });
    });

  },[network]);


  return (
    <div>

      <div className={styles.allocation_header}>
        <h3>All Deposits</h3>
        <span>{pageData.totalPassengers} deposits</span>
      </div>
      <ApolloProvider client={Data.client}>
        <div className={styles.table_content}>
          <DepositTable
            columns={Data.allocation_columns}
            data={pageData.rowData}
            isLoading={pageData.isLoading}
            network={network}
          />
        </div>
      </ApolloProvider>
    </div>
  );
}

export default DepositPage;