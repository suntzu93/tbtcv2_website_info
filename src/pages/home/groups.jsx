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
    const [state, setState] = useState();

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
                rowData: info.randomBeaconGroups,
                totalPassengers: totalPassengers
            });
            setState(info.statusRecord.groupState)
        });

        Data.getCurrentBlockNumber().then((info) => {
            setCurrentBlock(info);
        });

    }, []);


    return (
        <div>
            <div>
                <div className={styles.operator_detail_header}>
                    <div className={styles.operator_detail_header_address}>
                        <h3>Groups
                        </h3>
                    </div>
                    <div className={styles.operator_detail_header_value}>
                        <div className={styles.operator_detail_header_value_item}>
                            <div className={styles.operator_detail_header_value_item_lable}>state
                            </div>
                            <div>
                                <div>{state}</div>
                            </div>
                        </div>
                    </div>
                </div>
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