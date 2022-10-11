import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import PaginationMui from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Pagination = ({
  pageChangeHandler,
  totalRows,
  rowsPerPage
}) => {
  // Calculating max number of pages
  const noOfPages = Math.ceil(totalRows / rowsPerPage);

  // Creating an array with length equal to no.of pages
  const pagesArr = [...new Array(noOfPages)];

  // Onclick handlers for the butons
  const onPageSelect =  (event, value) => {
    pageChangeHandler(value)
  };

  return (
    <>
      {noOfPages > 1 ? (
        <div className={styles.pagination}>
          <Stack spacing={2}>
          <PaginationMui count={pagesArr.length} onChange={onPageSelect}/>
        </Stack>
        </div>
      ) : null}
    </>
  );
};

export default Pagination;
