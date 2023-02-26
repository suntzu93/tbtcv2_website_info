import React, {useMemo} from "react";
import {useTable} from "react-table";
import Loader from "../loader";
import styles from "./styles.module.css";
import {ReactComponent as Copy} from '../../assets/copy.svg';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Link from "@mui/material/Link";
import {ReactComponent as ShareLink} from "../../assets/link.svg";
import * as Data from "../../pages/data";
import * as Utils from '../../utils/utils';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';

export const OperatorTable = ({columns, data, isLoading, network}) => {
    const columnData = useMemo(() => columns, [columns]);
    const rowData = useMemo(() => data, [data]);

    const {rows} = useTable({
        columns: columnData, data: rowData,
    });


    const copyToClipBoard = (data) => {
        try {
            navigator.clipboard.writeText(data);
        } catch (err) {
        }
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
    }

    // This method is created for cross-browser compatibility, if you don't
    // need to support IE11, you can use Array.prototype.sort() directly
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function EnhancedTableHead(props) {
        const {order, orderBy, onRequestSort} = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (<TableHead>
            <TableRow>
                {columns.map((headCell) => (<TableCell
                    className={styles.th}
                    key={headCell.accessor}
                    align={'left'}
                    sortDirection={orderBy === headCell.accessor ? order : false}
                >
                    {headCell.accessor == "tBTCAuthorizedAmount" || headCell.accessor == "randomBeaconAuthorizedAmount" || headCell.accessor == "stakedAmount" || headCell.accessor == "availableReward" || headCell.accessor == "stakedAt" || headCell.accessor == "isRegisteredOperatorAddress" ? (
                        <TableSortLabel
                            direction={orderBy === headCell.accessor ? order : 'desc'}
                            onClick={createSortHandler(headCell.accessor)}
                        >
                            {headCell.header}
                        </TableSortLabel>) : headCell.header}

                </TableCell>))}
            </TableRow>
        </TableHead>);
    }

    EnhancedTableHead.propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('tBTCAuthorizedAmount');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    function Row(props) {
        const {row} = props;
        const [open, setOpen] = React.useState(false);

        return (<React.Fragment>
            <TableRow
                hover
                tabIndex={-1}
                key={row.name}
                className={open ? styles.rowSeleted : null}
            >
                <TableCell align="left">
                    <Link
                        target="_blank"
                        underline="hover"
                        href={Utils.getDomain() + "?operator=" + row.id}
                        className={styles.link}
                    >
                        {Data.formatString(row.id)}
                    </Link>
                    <ShareLink/>
                    <Tooltip title="Copied">
                        <Copy
                            style={{cursor: "pointer"}}
                            onClick={(e) => copyToClipBoard(row.id)}
                        />
                    </Tooltip>
                </TableCell>
                <TableCell align="left">
                    {Data.formatWeiDecimal(row.tBTCAuthorizedAmount)}
                </TableCell>
                <TableCell align="left">
                    {Data.formatWeiDecimal(row.randomBeaconAuthorizedAmount)}
                </TableCell>
                <TableCell align="left">
                    {Data.formatWeiDecimal(row.stakedAmount)}
                </TableCell>
                <TableCell align="left">
                    {Data.formatWeiDecimal(row.availableReward)}
                </TableCell>
                <TableCell align="left">
                    {row.misbehavedCount}
                </TableCell>
                <TableCell align="left">
                    {
                        row.isRegisteredOperatorAddress ? (
                            <Tooltip title={"operator address is registered"}>
                                <CheckSharpIcon style={{color: "green"}}/>
                            </Tooltip>
                        ) : (
                            <Tooltip title={"operator address is not registered"}>
                                <CloseSharpIcon style={{color: "red"}}/>
                            </Tooltip>
                        )
                    }
                </TableCell>
                <TableCell align="left">
                    {Data.formatTimeToText(row.stakedAt)}
                </TableCell>
            </TableRow>
        </React.Fragment>);
    }


    return (<>
        {isLoading ? (<Loader/>) : (<>
            <Box>
                <Paper>
                    <TableContainer>
                        <Table
                            className={styles.table}
                            sx={{minWidth: 750}}
                            aria-labelledby="tableTitle"
                            size={'small'}
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rowData.length}
                            />
                            <TableBody>
                                {stableSort(rowData, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (<Row key={index} row={row}/>);
                                    })}
                                {emptyRows > 0 && (<TableRow
                                    style={{
                                        height: (35) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                        {rowData.length == 0 ? (<div className={styles.nodata}>
                            No data
                        </div>) : (<div></div>)}
                    </TableContainer>
                    {rowData.length > 0 ? (<TablePagination
                        className={styles.pagination}
                        rowsPerPageOptions={[25, 50, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />) : (<div></div>)}

                </Paper>
            </Box>
        </>)}
    </>);
};

export default OperatorTable;