import React, {useState, useEffect} from "react";
import * as Data from "../data";
import styles from './styles.module.css'
import GroupTable from "../../components/table/group";

const GroupsPage = ({network}) => {
    const [pageData, setPageData] = useState({
        rowData: [],
        isLoading: false,
        pageNumber: 1,
        totalPassengers: 0,
    });

    const [currentBlock, setCurrentBlock] = useState();

    useEffect(() => {
        setPageData((prevState) => ({
            ...prevState,
            rowData: [],
            isLoading: true,
        }));

        Data.getListGroups().then((info) => {
            const totalPassengers = info.length;
            setPageData({
                isLoading: false,
                rowData: info,
                totalPassengers: totalPassengers
            });
        });

        Data.getCurrentBlockNumber().then((info) => {
            setCurrentBlock(info);
        });

    }, []);


    return (
        <div>
            <div className={styles.deposit_header}>
                <h3>Groups</h3>
                <span>{pageData.totalPassengers} groups</span>
            </div>
            <div className={styles.table_content}>
                <GroupTable
                    columns={Data.groups_columns}
                    data={pageData.rowData}
                    isLoading={pageData.isLoading}
                    network={network}
                    currentBlock={currentBlock}
                />
            </div>
        </div>
    );
}

export default GroupsPage;