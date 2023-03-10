import React, { useMemo } from "react";
import { useTable } from "react-table";
import Loader from "../loader";
import styles from "./styles.module.css";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { ReactComponent as ShareLink } from "../../assets/link.svg";
import * as Data from "../../pages/data";
import TransactionTimeline from "./timeline";
import * as Utils from "../../utils/utils";

export const RedeemTable = ({ columns, data, isLoading }) => {
  const columnData = useMemo(() => columns, [columns]);
  const rowData = useMemo(() => data, [data]);

  const { rows } = useTable({
    columns: columnData,
    data: rowData,
  });

  const copyToClipBoard = (data) => {
    try {
      navigator.clipboard.writeText(data);
    } catch (err) {}
  };

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
    return order === "desc"
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
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell />
          {columns.map((headCell) => (
            <TableCell
              className={styles.th}
              key={headCell.accessor}
              align={"left"}
              sortDirection={orderBy === headCell.accessor ? order : false}
            >
              {headCell.accessor == "updateTime" ||
              headCell.accessor == "amount" ||
              headCell.accessor == "status" ? (
                <TableSortLabel
                  direction={orderBy === headCell.accessor ? order : "asc"}
                  onClick={createSortHandler(headCell.accessor)}
                >
                  {headCell.header}
                </TableSortLabel>
              ) : (
                headCell.header
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("updateTime");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow
          hover
          tabIndex={-1}
          key={row.name}
          className={open ? styles.rowSeleted : null}
          onClick={() => setOpen(!open)}
        >
          <TableCell className={styles.td_selected}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="left">
            {Data.calculateTimeMoment(row.updateTime)}
          </TableCell>
          <TableCell align="left">
            <Link
              target="_blank"
              underline="hover"
              href={Utils.getDomain() + "?user=" + row.depositor}
              className={styles.link}
            >
              {Data.formatString(row.redeemer)}
            </Link>
            <ShareLink />
          </TableCell>
          <TableCell align="left">{Data.formatGwei(row.amount)}</TableCell>
          <TableCell align="left">{row.status}</TableCell>
          <TableCell align="left">
            {
              row.completedTxHash?.length > 0 ? (
                  <>
                    <Link
                        target="_blank"
                        underline="hover"
                        href={Utils.getBlockStreamInfo() + row.completedTxHash}
                        className={styles.link}
                    >
                      {Data.formatString(row.completedTxHash)}
                    </Link>
                    <ShareLink />
                  </>
              ) : (
                  "..."
              )
            }
          </TableCell>
        </TableRow>
        <TableRow className={styles.container_detail}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <div className={styles.detail_item}>
                  <TransactionTimeline
                    className={styles.timeline}
                    transactions={row.transactions}
                  />
                  <div className={styles.timeline}>
                    <Table
                      className={styles.table_detail}
                      sx={{ minWidth: 750 }}
                      aria-labelledby="tableTitle"
                      size={"small"}
                    >
                      <TableBody>
                        <TableRow>
                          <TableCell>Wallet Pub KeyHash</TableCell>
                          <TableCell>{row.walletPubKeyHash}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Output Script </TableCell>
                          <TableCell>
                            {Data.formatString(row.redeemerOutputScript)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>TxHash</TableCell>
                          <TableCell>
                            {Data.formatString(row.redemptionTxHash)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>TreasuryFee</TableCell>
                          <TableCell>
                            {row.treasuryFee}{" "}
                            <span className={styles.span_note}>%</span>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>TxMaxFee</TableCell>
                          <TableCell>
                            {row.txMaxFee}{" "}
                            <span className={styles.span_note}>BTC</span>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Redeem Timestamp</TableCell>
                          <TableCell>
                            {Data.calculateTimeMoment(row.redemptionTimestamp)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Box>
            <Paper>
              <TableContainer>
                <Table
                  className={styles.table}
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={"small"}
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rowData.length}
                  />
                  <TableBody>
                    {stableSort(rowData, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return <Row key={index} row={row} />;
                      })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 35 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {rowData.length == 0 ? (
                  <div className={styles.nodata}>No data</div>
                ) : (
                  <div></div>
                )}
              </TableContainer>
              {rowData.length > 0 ? (
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
              ) : (
                <div></div>
              )}
            </Paper>
          </Box>
        </>
      )}
    </>
  );
};

export default RedeemTable;
