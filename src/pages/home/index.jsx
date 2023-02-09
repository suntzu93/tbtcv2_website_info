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
import TokenPage from "./token";

const HomePage = () => {
    const [network, setNetwork] = useState(Const.DEFAULT_NETWORK);
    const [tab, setTab] = React.useState("1");
    const [anchorElSetting, setAnchorElSetting] = React.useState(null);
    const [searchInput, setSearchInput] = React.useState("");
    const [isSearch, setIsSearch] = React.useState(false);

    const openSetting = Boolean(anchorElSetting);

    useEffect(() => {
        if (window.location.pathname.startsWith("/redeems")) {
            setTab("redeems");
        } else if (window.location.pathname.startsWith("/about")) {
            setTab("about");
        } else if (window.location.pathname.startsWith("/token")) {
            setTab("token");
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
            <DepositPage network={network} isSearch={isSearch} searchInput={searchInput}/>
        </div>);
    }

    function redeems() {
        return (<div>
            <RedeemsPage network={network} isSearch={isSearch} searchInput={searchInput}/>
        </div>);
    }

    function token() {
        return (<div>
            <TokenPage network={network}/>
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
                case "token":
                    return browserHistory.push("/token");
                case "about":
                    return browserHistory.push("/about");
                default:
                    return browserHistory.push("/");
            }
        };

        function swichNetwork() {
            setTab("deposits");
            if (Const.DEFAULT_NETWORK == Const.NETWORK_MAINNET){
                window.location.href = "https://testnet.tbtcscan.com/"
            }else {
                window.location.href = "https://tbtcscan.com/"
            }
        }

        function isMainnet() {
            return Const.DEFAULT_NETWORK == Const.NETWORK_MAINNET;
        }

        const handleClickOpenSetting = (event) => {
            setAnchorElSetting(event.currentTarget);
        };
        const handleCloseOpenSetting = () => {
            setAnchorElSetting(null);
        };

        const handleChangeSearchInput = (event) => {
            setSearchInput(event.target.value);
            if (event.target.value.trim().length == 0) {
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
                        <div className={styles.logo_header}>
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
                                sx={{padding: 0}}
                                label="Deposits"
                                value="deposits"
                            />
                            <Tab
                                sx={{padding: 0}}
                                label="Redeems"
                                value="redeems"
                            />
                            <Tab
                                sx={{padding: 0}}
                                label="Token"
                                value="token"
                            />
                        </TabList>
                        <div className={styles.about}>
                            <TabList
                                className={styles.tab}
                                onChange={handleChange}
                                aria-label=""
                            >
                                <Tab
                                    sx={{padding: 0}}
                                    label="About"
                                    value="about"
                                />
                            </TabList>
                        </div>
                        <div className={styles.setting}>
                            <IconButton
                                color="primary"
                                component="label"
                                aria-controls={openSetting ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={openSetting ? "true" : undefined}
                                onClick={handleClickOpenSetting}
                            >
                                <SettingsIcon/>
                            </IconButton>
                            <Menu
                                style={{marginTop: "20px"}}
                                anchorEl={anchorElSetting}
                                open={openSetting}
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
                                label="depositer / redeemer address"
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
                    <TabPanel value="token">{token()}</TabPanel>
                    <TabPanel value="about">{about()}</TabPanel>
                </TabContext>
            </Box>

        );
    }

    return <div>{tabs()}</div>;
};

export default HomePage;
