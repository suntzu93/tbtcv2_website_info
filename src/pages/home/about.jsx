import React from "react";
import styles from "./styles.module.css";
import * as Const from "../../utils/Cons";

const About = () => {
    return (
        <div className={styles.about_content}>
            <h3>The Idea</h3>
            <p>Provide insight into the workings of the Keep and tBTC systems - deposits, redemptions, who bonds for
                what, governance actions, etc.</p>
            <div className={styles.div_bottom}>
                <a target="_blank" href={"https://github.com/suntzu93/threshold-tBTC"}>[Subgraph code] - </a>
                <a target="_blank" href={"https://github.com/suntzu93/tbtcv2_website_info"}>[Website code] </a>
                API (Mainnet : <a target="_blank" href={Const.MAINNET_API}>suntzu93/threshold-tbtc</a> -
                Testnet : <a target="_blank"
                             href={Const.TESTNET_API}>suntzu93/tbtcv2</a>)
            </div>
        </div>

    )
};

export default About;
