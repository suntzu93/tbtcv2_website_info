export function getColorByStatus(status) {
    if (status == "REVEALED" || status == "REQUESTED") {
        return "#3498db";
    } else if (status == "MINTING_REQUESTED") {
        return "#f1c40f";
    } else if (status == "SWEPT") {
        return "#e74c3c";
    } else if (status == "COMPLETED" || status == "Active") {
        return "#2ecc71";
    } else {
        return "#95a5a6";
    }
}