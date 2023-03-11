export function getColorByStatus(status) {
  if (
    status == "REVEALED" ||
    status == "REQUESTED" ||
    status == "Deposit Revealed" ||
    status == "Depositor request reveal information" ||
    status == "Redemption Requested"
  ) {
    return "#3498db";
  } else if (status == "MINTING_REQUESTED" || status == "Minting Requested") {
    return "#f1c40f";
  } else if (
    status == "SWEPT" ||
    status == "TIMEDOUT" ||
    status == "Redemption TimedOut"
  ) {
    return "#e74c3c";
  } else if (
    status == "COMPLETED" ||
    status == "Active" ||
    status == "Minting Finalized" ||
    status == "Redemption success" ||
    status.startWith("Swept deposit processed successfully")
  ) {
    return "#2ecc71";
  } else {
    return "#95a5a6";
  }
}
