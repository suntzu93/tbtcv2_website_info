import React, {useMemo} from "react";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Link from "@mui/material/Link";
import {ReactComponent as ShareLink} from "../../assets/link.svg";
import styles from "./styles.module.css";
import {getEtherTxHashLink, getEtherAddressLink} from "../../utils/utils"
import * as Data from "../../pages/data";

export default function TransactionTimeline(transactions, network) {
    const rowData = useMemo(() => transactions, [transactions]);
    const transactionLength = rowData.transactions.length;
    return (<React.Fragment>
        <Timeline>
            {rowData.transactions.map((transaction, index) => (<TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                    {Data.calculateTimeMoment(transaction.timestamp * 1000)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot/>
                    {index != transactionLength - 1 ? <TimelineConnector/> : ""}
                </TimelineSeparator>
                <TimelineContent>
                    <Link
                        target="_blank"
                        underline="hover"
                        href={getEtherTxHashLink() + transaction.txHash}
                        className={styles.link}
                    >
                        {transaction.description}
                    </Link>
                    <ShareLink/>

                    <span className={styles.bySpan}>by</span>
                    <Link
                        target="_blank"
                        underline="hover"
                        href={getEtherAddressLink() + transaction.from}
                        className={styles.by_link}
                    >
                        {Data.formatString(transaction.from)}
                    </Link>
                    <ShareLink/>
                </TimelineContent>
            </TimelineItem>))}
        </Timeline>
    </React.Fragment>);
}
