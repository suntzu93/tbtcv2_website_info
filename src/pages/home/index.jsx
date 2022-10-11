import React, { useState, useEffect } from "react";
import * as Data from "../data";
import About from "../../components/about";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from '@mui/material/Button';
import { browserHistory } from 'react-router';
import { ReactComponent as Logo } from '../../logo.svg';
import styles from './styles.module.css'
import SubgraphPage from "../redeems/index";
import DepositPage from "../deposit/index"
const HomePage = () => {

  const [network, setNetwork] = useState("mainnet");
  const [tab, setTab] = React.useState("1");
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    if (window.location.pathname.startsWith("/subgraphs")) {
      setTab("redeems");
    } else if (window.location.pathname.startsWith("/about")) {
      setTab("about");
    } else {
      setTab("deposits");
    }
  }, [network]);

  const reload = () => {
    browserHistory.push('/');
    window.location.reload();
  }

  function deposits() {
    return (
      <div>
        <DepositPage
          network={network}
        />
      </div>
    );
  }

  function redeems() {
    return (
      <div>
        <SubgraphPage
          network={network}
        />
      </div>
    )
  }

  function about() {
    return <About />
  }

  function tabs() {
    const handleChange = (event, newValue) => {
      setTab(newValue);
      switch (newValue) {
        case "deposits":
          return browserHistory.push('/deposits');
        case "redeems":
          return browserHistory.push('/redeems');
        case "about":
          return browserHistory.push('/about');
        default:
          return browserHistory.push('/');
      }
    };

    function swichNetwork() {
      var newNetwork = network == "mainnet" ? "testnet" : "mainnet";
      setNetwork(newNetwork);
      setTab("deposits");
      localStorage.setItem("network", newNetwork);
      reload();
    }

    function isMainnet() {
      return network == "mainnet";
    }

    const open = Boolean(anchorEl);

    return (
      <Box sx={{ width: "100%", typography: "body" }}>
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", textAlign: "left", marginLeft: "20px", paddingTop: "20px" }}>
            <a href="/"><Logo height={60} /></a>
            <TabList onChange={handleChange} aria-label="" sx={{ display: "inline-block", paddingLeft: "20px" }} >
              <Tab sx={{ fontFamily: "\"Work Sans\",sans-serif" }} label="Deposits" value="deposits" />
              <Tab sx={{ fontFamily: "\"Work Sans\",sans-serif" }} label="Redeems" value="redeems" />
            </TabList>
            <div className={styles.about}>
              <TabList className={styles.tab} onChange={handleChange} aria-label="">
                <Tab sx={{ fontFamily: "\"Work Sans\",sans-serif" }} label="About" value="about" />
              </TabList>
            </div>
            <div className={styles.network}>
              <Button size="small" variant="contained" onClick={() => swichNetwork()}>
                {isMainnet() ? "Mainnet" : "Testnet"}
              </Button>
            </div>
          </Box>
          <TabPanel value="deposits">{deposits()}</TabPanel>
          <TabPanel value="redeems">{redeems()}</TabPanel>
          <TabPanel value="about">{about()}</TabPanel>
        </TabContext>
      </Box>
    );
  }

  return (
    <div>{tabs()}</div>
  );
};

export default HomePage;
