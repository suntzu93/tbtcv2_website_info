import React, { useMemo } from "react";
import { useTable } from "react-table";
import Loader from "../loader";
import styles from "./styles.module.css";
import { ReactComponent as Copy } from "../../assets/copy.svg";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { ReactComponent as ShareLink } from "../../assets/link.svg";
import * as Data from "../../pages/data";
import * as Const from "../../utils/Cons";
import * as Utils from "../../utils/utils";
import {getColorByStatus} from "./view_utils"
import TransactionTimeline from "./timeline";

export const DepositTable = ({ columns, data, isLoading, network }) => {
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
              headCell.accessor == "actualAmountReceived" ||
              headCell.accessor == "status" ? (
                <TableSortLabel
                  direction={orderBy === headCell.accessor ? order : "desc"}
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

  const [order, setOrder] = React.useState("desc");
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
          <TableCell align="left" style={{ width: "10%" }}>
            <Tooltip title={Data.formatDate(row.updateTime)}>
              <span>{Data.calculateTimeMoment(row.updateTime)}</span>
            </Tooltip>
          </TableCell>
          <TableCell align="left">
            <Link
              target="_blank"
              underline="hover"
              href={Utils.getDomain() + "?user=" + row.depositor}
              className={styles.link}
            >
              {Data.formatString(row.depositor)}
            </Link>
            <ShareLink />
            <Tooltip title="Copied">
              <Copy
                style={{ cursor: "pointer" }}
                onClick={(e) => copyToClipBoard(row.depositor)}
              />
            </Tooltip>
          </TableCell>
          <TableCell align="left">
          <span className={styles.numbers} >{Data.formatSatoshi(row.amount)}</span></TableCell>
          <TableCell align="left">
            <span className={styles.numbers}>{Data.formatGwei(row.actualAmountReceived)}</span>
          </TableCell>
          <TableCell align="left" sx={{color:getColorByStatus(row.status)}}>{row.status}</TableCell>
        </TableRow>
        <TableRow className={styles.container_detail}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <div className={styles.detail_item}>
                  <div style={{ flex: "1 1 0%" }}>
                    <TransactionTimeline
                      className={styles.timeline}
                      transactions={row.transactions}
                      network={network}
                    />
                  </div>
                  <div style={{ flex: "1 1 0%" }}>
                    <TableContainer className={styles.timeline}>
                      <Table
                        className={styles.table_detail}
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={"small"}
                      >
                        <TableBody>
                          <TableRow>
                            <TableCell>Deposit key</TableCell>
                            <TableCell>
                              {Data.formatString(row.id)}
                              <Copy
                                style={{ cursor: "pointer" }}
                                onClick={(e) => copyToClipBoard(row.id)}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Wallet Pub KeyHash</TableCell>
                            <TableCell>
                              {Data.formatString(row.walletPubKeyHash)}
                              <Copy
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  copyToClipBoard(row.walletPubKeyHash)
                                }
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Funding TxHash </TableCell>
                            <TableCell>
                              <Link
                                target="_blank"
                                underline="hover"
                                href={
                                  Utils.getBlockStreamInfo() +
                                  row.fundingTxHash.replace("0x", "")
                                }
                                className={styles.link}
                              >
                                {Data.formatString(
                                  row.fundingTxHash.replace("0x", "")
                                )}
                              </Link>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Funding Output Index</TableCell>
                            <TableCell>{row.fundingOutputIndex}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Blinding Factor</TableCell>
                            <TableCell>
                              {row.blindingFactor}
                              <Copy
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  copyToClipBoard(row.blindingFactor)
                                }
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Refund Pub KeyHash</TableCell>
                            <TableCell>
                              {Data.formatString(row.refundPubKeyHash)}
                              <Copy
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  copyToClipBoard(row.refundPubKeyHash)
                                }
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Refund Locktime</TableCell>
                            <TableCell>{row.refundLocktime}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Vault</TableCell>
                            <TableCell>
                              <Link
                                target="_blank"
                                underline="hover"
                                href={Utils.getEtherAddressLink() + row.vault}
                                className={styles.link}
                              >
                                {Data.formatString(row.vault)}
                              </Link>
                              <ShareLink />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
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

export default DepositTable;
