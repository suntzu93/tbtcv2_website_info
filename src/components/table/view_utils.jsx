export function getColorByStatus(status) {
  if (
    status === "REVEALED" ||
    status === "REQUESTED" ||
    status === "Deposit Revealed" ||
    status === "Depositor request reveal information" ||
    status === "Redemption Requested"
  ) {
    return "#3498db";
  } else if (status === "MINTING REQUESTED" || status === "Minting Requested") {
    return "#f1c40f";
  } else if (
    status === "SWEPT" ||
    status === "TIMEDOUT" ||
    status === "Redemption TimedOut"
  ) {
    return "#e74c3c";
  } else if (
    status === "MINTING FINALIZED" ||
    status === "Active" ||
    status === "Minting Finalized"
  ) {
    return "#6050DC";
  } else if (
    status === "SWEPT COMPLETED" ||
    status === "COMPLETED" ||
    status === "Redemption success" ||
    status === "Swept deposit processed successfully." ||
    status === "Swept by wallet"
  ) {
    return "#2ecc71";
  } else {
    return "#95a5a6";
  }
}
