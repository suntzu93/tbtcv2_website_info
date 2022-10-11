import React, { useMemo } from "react";
import { useTable } from "react-table";
import Loader from "../loader";
import styles from "./styles.module.css";
import { ReactComponent as Copy } from '../../assets/copy.svg';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
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
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { ReactComponent as ShareLink } from '../../assets/link.svg';

import * as Data from "../../pages/data";
import * as Const from '../../utils/Cons';
import * as Utils from '../../utils/utils';

export const SubgraphTable = ({ columns, data, isLoading}) => {
  const columnData = useMemo(() => columns, [columns]);
  const rowData = useMemo(() => data, [data]);
  
  const { rows } = useTable({
    columns: columnData,
    data: rowData,
  });


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
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
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
    const { order, orderBy, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {columns.map((headCell) => (
            <TableCell
              className={styles.th}
              key={headCell.accessor}
              align={'left'}
              sortDirection={orderBy === headCell.accessor ? order : false}
            >
              {headCell.accessor == "proportion" || headCell.accessor == "signalledTokens" ? (
                <TableSortLabel
                  direction={orderBy === headCell.accessor ? order : 'asc'}
                  onClick={createSortHandler(headCell.accessor)}
                >
                  {headCell.header}
                </TableSortLabel>
              ) : headCell.header}

            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('proportion');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  
  const handleRequestSort = (event, property) => {
    console.log("property " + property);
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
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  return (
    <>
      {/* {
        alert.alertType.length > 0 ? <Alert severity={alert.alertType}>{alert.message}</Alert> : null
      } */}
      {isLoading ? (<Loader />) : (
        <>
          <Box >
            <Paper>
              <TableContainer>
                <Table
                  className={styles.table}
                  sx={{ minWidth: 750 }}
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
                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                    {stableSort(rowData, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            tabIndex={-1}
                            key={row.name}
                          >
                            <TableCell align="left">
                              {row.deniedAt > 0 ? (
                                <Tooltip
                                title={"Subgraph is denied to receive rewards."}>
                                <ReportOutlinedIcon style={{ color: "red" }} />
                              </Tooltip>
                                ) : null }
                              <Tooltip
                                title={row.originalName}>
                                <span>{Data.formatString(row.originalName)}</span>
                              </Tooltip>
                            </TableCell>
                            
                            <TableCell align="left">
                              <Link target="_blank" underline="hover" href={"https://thegraph.com/explorer/subgraph?id=" + row.subgraphId}
                                className={styles.link}>{Data.formatString(row.ipfsHash)}</Link>
                              <ShareLink />
                            </TableCell>
                            <TableCell align="left">{row.network}</TableCell>
                          
                            <TableCell align="left">
                              {row.signalledTokensFormat}
                            </TableCell>
                            <TableCell align="left" className={styles.proportion}>{row.proportion} %</TableCell>
                           
                            <TableCell align="left">{row.createdAt}</TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (35) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {
                  rowData.length == 0 ? (
                    <div className={styles.nodata}>
                      No data
                    </div>) : (<div></div>)
                }
              </TableContainer>
              {
                rowData.length > 0 ? (
                  <TablePagination
                    className={styles.pagination}
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                ) : (<div></div>)
              }

            </Paper>
          </Box>
        </>
      )}
    </>
  );
};

export default SubgraphTable;