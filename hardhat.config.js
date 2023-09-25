require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "localhost",
  networks: {
    localhost: {},
    /**mantletest: {
      url: 'https://mantle-testnet.rpc.thirdweb.com', 
      chainId: 5001, 
      accounts: [process.env.PRIVATE_KEY]
    }*/
    calibrationnet: {
      chainId: 314159,
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [process.env.REACT_APP_PRIVATE_KEY],
    },
    filecoinmainnet: {
        chainId: 314,
        url: "https://api.node.glif.io",
        accounts: [process.env.REACT_APP_PRIVATE_KEY],
    }
  }
};
