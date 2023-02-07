import React, {useState, useEffect} from "react";
import * as Data from "../data";
import About from "./about";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import {browserHistory} from "react-router";
import styles from "./styles.module.css";
import RedeemsPage from "./redeem";
import DepositPage from "./deposit";
import {ReactComponent as Logo} from "../../logo.svg";
import * as Const from "../../utils/Cons";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

const HomePage = () => {
    const [network, setNetwork] = useState("mainnet");
    const [tab, setTab] = React.useState("1");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [searchInput, setSearchInput] = React.useState("");
    const [isSearch, setIsSearch] = React.useState(false);

    const open = Boolean(anchorEl);

    useEffect(() => {
        const localNetwork = localStorage.getItem("network");
        if (localNetwork != null) setNetwork(localNetwork); else localStorage.setItem("network", "mainnet");

        if (window.location.pathname.startsWith("/subgraphs")) {
            setTab("redeems");
        } else if (window.location.pathname.startsWith("/about")) {
            setTab("about");
        } else {
            setTab("deposits");
        }
    }, [network]);

    const reload = () => {
        browserHistory.push("/");
        window.location.reload();
    };

    function deposits() {
        return (<div>
            <DepositPage network={localStorage.getItem("network")} isSearch={isSearch} searchInput={searchInput}/>
        </div>);
    }

    function redeems() {
        return (<div>
            <RedeemsPage network={localStorage.getItem("network")} isSearch={isSearch} searchInput={searchInput}/>
        </div>);
    }

    function about() {
        return <About/>;
    }

    function tabs() {
        const handleChange = (event, newValue) => {
            setTab(newValue);
            switch (newValue) {
                case "deposits":
                    return browserHistory.push("/deposits");
                case "redeems":
                    return browserHistory.push("/redeems");
                case "about":
                    return browserHistory.push("/about");
                default:
                    return browserHistory.push("/");
            }
        };

        function swichNetwork() {
            var newNetwork = network == Const.NETWORK_MAINNET ? Const.NETWORK_TESTNET : Const.NETWORK_MAINNET;
            setNetwork(newNetwork);
            setTab("deposits");
            localStorage.setItem("network", newNetwork);
            reload();
        }

        function isMainnet() {
            return network == Const.NETWORK_MAINNET;
        }

        const handleClickOpenSetting = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        };
        const handleCloseOpenSetting = () => {
            setAnchorEl(null);
        };

        const handleChangeSearchInput = (event) => {
            setSearchInput(event.target.value);
            if (event.target.value.trim().length == 0){
                setIsSearch(false)
            }
        };

        const submitSearch = () => {
            if (searchInput.length > 0) {
                setIsSearch(true)
            }
        };
        return (<Box sx={{width: "100%", typography: "body"}}>
                <TabContext value={tab}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            textAlign: "left",
                            marginLeft: "20px",
                            paddingTop: "20px",
                        }}
                    >
                        <div style={{width: "fit-content", float: "left"}}>
                            <a href="/">
                                <Logo height={60}/>
                            </a>
                        </div>
                        <TabList
                            onChange={handleChange}
                            aria-label=""
                            sx={{display: "inline-block", paddingLeft: "20px"}}
                        >
                            <Tab
                                sx={{fontFamily: '"Work Sans",sans-serif'}}
                                label="Deposits"
                                value="deposits"
                            />
                            <Tab
                                sx={{fontFamily: '"Work Sans",sans-serif'}}
                                label="Redeems"
                                value="redeems"
                            />
                        </TabList>
                        <div className={styles.about}>
                            <TabList
                                className={styles.tab}
                                onChange={handleChange}
                                aria-label=""
                            >
                                <Tab
                                    sx={{fontFamily: '"Work Sans",sans-serif'}}
                                    label="About"
                                    value="about"
                                />
                            </TabList>
                        </div>
                        <div className={styles.setting}>
                            <IconButton
                                color="primary"
                                component="label"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClickOpenSetting}
                            >
                                <SettingsIcon/>
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseOpenSetting}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                <MenuItem>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => swichNetwork()}
                                    >
                                        {isMainnet() ? "Switch to Testnet" : "Switch to Mainnet"}
                                    </Button>
                                </MenuItem>
                            </Menu>
                        </div>
                        <div className={styles.search}>
                            <TextField
                                id="outlined-basic"
                                label="Search by depositer / redeemer address"
                                variant="outlined"
                                fullWidth
                                value={searchInput}
                                onChange={handleChangeSearchInput}
                                onKeyUp={(event) => {
                                    if (event.key == "Enter") submitSearch();
                                }}
                                InputProps={{
                                    endAdornment: (<IconButton>
                                        <SearchIcon onClick={() => submitSearch()}/>
                                    </IconButton>),
                                }}
                            />
                        </div>
                    </Box>
                    <TabPanel value="deposits">{deposits()}</TabPanel>
                    <TabPanel value="redeems">{redeems()}</TabPanel>
                    <TabPanel value="about">{about()}</TabPanel>
                </TabContext>
                <div className={styles.div_bottom}>
                    The Graph (Mainnet : <a href={Const.MAINNET_API}>suntzu93/threshold-tbtc</a> - Testnet : <a
                    href={Const.TESTNET_API}>suntzu93/tbtcv2</a>)
                </div>
            </Box>

        );
    }

    return <div>{tabs()}</div>;
};

export default HomePage;
