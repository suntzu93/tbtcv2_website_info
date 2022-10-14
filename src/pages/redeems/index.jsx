import React, { useState, useEffect } from "react";
import * as Data from "../data";
import SubgraphTable from "../../components/table/redeem";
import { ApolloProvider } from '@apollo/client';
import styles from './styles.module.css'
import * as Const from '../../utils/Cons';

const RedeemsPage = ({ network }) => {
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

    Data.getRedeems(network, 1).then((info) => {
      const totalPassengers = info?.length;
      setPageData({
        isLoading: false,
        rowData:  info,
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
      <ApolloProvider client={Data.client}>
        <div className={styles.table_content}>
          <SubgraphTable
            columns={Data.redeem_columns}
            data={pageData.rowData}
            isLoading={pageData.isLoading}
            network={network}
          />
        </div>
      </ApolloProvider>
    </div>
  );
}

export default RedeemsPage;