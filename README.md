# RedStone Price Feed DApp

A decentralized application that displays real-time cryptocurrency prices using RedStone's price feeds on the RSK Testnet. This DApp demonstrates how to integrate RedStone's oracle services with a React frontend and Solidity smart contracts.

![RedStone Price Feed Demo](screenshot.png)

## Features

- Real-time ETH, BTC, RBTC, and RIF price feeds
- Integration with RedStone oracles
- MetaMask wallet connection
- RSK Testnet compatibility
- Modern React UI with Chakra UI
- Fully responsive design

## Project Structure

```
redstone-dapp/
├── frontend/             # React frontend application
│   ├── src/             # Source files
│   ├── public/          # Public assets
│   └── package.json     # Frontend dependencies
├── contracts/           # Smart contract files
│   ├── contracts/       # Solidity contracts
│   ├── scripts/         # Deployment scripts
│   ├── test/           # Contract tests
│   └── hardhat.config.js # Hardhat configuration
└── README.md           # Project documentation
```

## Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- MetaMask wallet
- Some testnet RBTC for transactions

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd redstone-dapp
   ```

2. **Install Dependencies**

   Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

   Install contract dependencies:
   ```bash
   cd ../contracts
   npm install
   ```

3. **Configure Environment**

   Create a `.env` file in the contracts directory:
   ```env
   PRIVATE_KEY=your_private_key_here
   ```

4. **Deploy Smart Contracts**
   ```bash
   cd contracts
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network rsktestnet
   ```
   Save the deployed contract address for frontend configuration.

5. **Start Frontend Application**
   ```bash
   cd ../frontend
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Smart Contracts

### PriceFeed.sol
The main contract that integrates with RedStone's oracle services to provide cryptocurrency price feeds.

```solidity
contract PriceFeed is MainDemoConsumerBase {
    function getEthPrice() public view returns (uint256)
    function getBtcPrice() public view returns (uint256)
    function getRbtcPrice() public view returns (uint256)
    function getRifPrice() public view returns (uint256)
}
```

## Frontend Application

The frontend is built with:
- React + Vite
- ethers.js for blockchain interaction
- Chakra UI for styling
- RedStone SDK for price feeds

### Key Components

- `App.tsx`: Main application component
- MetaMask integration for wallet connection
- Real-time price updates for ETH, BTC, RBTC, and RIF
- Error handling and user feedback

## Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Smart Contracts
1. Configure your `.env` file with your private key
2. Run the deployment script:
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network rsktestnet
   ```

### Frontend
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service

## Networks

### RSK Testnet
- Network Name: RSK Testnet
- RPC URL: https://public-node.testnet.rsk.co
- Chain ID: 31
- Currency Symbol: tRBTC

## Security

- Environment variables are used for sensitive data
- Contract security measures implemented
- Input validation and error handling
- Secure API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**
   - Ensure you're on RSK Testnet
   - Check if you have sufficient tRBTC

2. **Price Feed Not Updating**
   - Verify contract deployment
   - Check console for error messages
   - Ensure RedStone service is available

## License


MIT License - see LICENSE file for details

## Acknowledgments


- RedStone Finance for oracle services
- RSK for the testnet infrastructure
- OpenZeppelin for contract libraries
- Chakra UI for the component library 
