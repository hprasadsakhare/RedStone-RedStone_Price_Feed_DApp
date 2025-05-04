import { useState } from 'react';
import { 
  Contract,
  providers,
  utils,
  Signer
} from 'ethers';
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  useToast,
  Card,
  CardBody,
  Container,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { CONTRACT_ADDRESS } from './config';

// Define window.ethereum type
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
  }
}

// Define custom theme
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

interface RSKTestnet {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

const RSK_TESTNET: RSKTestnet = {
  chainId: '0x1f',
  chainName: 'RSK Testnet',
  nativeCurrency: {
    name: 'tRBTC',
    symbol: 'tRBTC',
    decimals: 18
  },
  rpcUrls: ['https://public-node.testnet.rsk.co'],
  blockExplorerUrls: ['https://explorer.testnet.rsk.co']
};

// Define contract interface
const contractABI = [
  "function getEthPrice() view returns (uint256)",
  "function getBtcPrice() view returns (uint256)",
  "function getRbtcPrice() view returns (uint256)",
  "function getRifPrice() view returns (uint256)"
];

function App() {
  const [ethPrice, setEthPrice] = useState<string>('0');
  const [btcPrice, setBtcPrice] = useState<string>('0');
  const [rbtcPrice, setRbtcPrice] = useState<string>('0');
  const [rifPrice, setRifPrice] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>(CONTRACT_ADDRESS);
  const [account, setAccount] = useState<string>('');
  const toast = useToast();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== RSK_TESTNET.chainId) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [RSK_TESTNET]
        });
      }

      setIsConnected(true);
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to RSK Testnet',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError('');

      if (!contractAddress) {
        throw new Error('Please enter a contract address');
      }

      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      console.log('Connecting to provider...');
      const provider = new providers.Web3Provider(window.ethereum);
      const signer: Signer = provider.getSigner();
      
      console.log('Creating contract instance...');
      const contract = new Contract(contractAddress, contractABI, signer) as any;

      try {
        console.log('Fetching prices from RedStone...');
        const [ethPriceResponse, btcPriceResponse, rbtcPriceResponse, rifPriceResponse] = await Promise.all([
          fetch('https://api.redstone.finance/prices?symbol=ETH&provider=redstone&limit=1'),
          fetch('https://api.redstone.finance/prices?symbol=BTC&provider=redstone&limit=1'),
          fetch('https://api.redstone.finance/prices?symbol=RBTC&provider=redstone&limit=1'),
          fetch('https://api.redstone.finance/prices?symbol=RIF&provider=redstone&limit=1')
        ]);

        const [ethPriceData, btcPriceData, rbtcPriceData, rifPriceData] = await Promise.all([
          ethPriceResponse.json(),
          btcPriceResponse.json(),
          rbtcPriceResponse.json(),
          rifPriceResponse.json()
        ]);

        console.log('Price responses:', {
          ETH: ethPriceData,
          BTC: btcPriceData,
          RBTC: rbtcPriceData,
          RIF: rifPriceData
        });

        if (!ethPriceData?.[0]?.value || !btcPriceData?.[0]?.value || !rbtcPriceData?.[0]?.value || !rifPriceData?.[0]?.value) {
          throw new Error('Failed to fetch prices from RedStone');
        }

        // Format prices to 2 decimal places
        const formattedEthPrice = ethPriceData[0].value.toFixed(2);
        const formattedBtcPrice = btcPriceData[0].value.toFixed(2);
        const formattedRbtcPrice = rbtcPriceData[0].value.toFixed(2);
        const formattedRifPrice = rifPriceData[0].value.toFixed(2);

        console.log('Formatted prices:', {
          ETH: formattedEthPrice,
          BTC: formattedBtcPrice,
          RBTC: formattedRbtcPrice,
          RIF: formattedRifPrice
        });

        setEthPrice(formattedEthPrice);
        setBtcPrice(formattedBtcPrice);
        setRbtcPrice(formattedRbtcPrice);
        setRifPrice(formattedRifPrice);

        toast({
          title: 'Prices Updated',
          description: 'Successfully fetched latest prices',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (priceError: any) {
        console.error('Price fetching error:', {
          message: priceError.message,
          code: priceError.code,
          data: priceError.data,
          stack: priceError.stack
        });
        throw new Error(`Failed to fetch prices: ${priceError.message}`);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Main error:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" py={10}>
        <Container maxW="container.md">
          <VStack spacing={8}>
            <Heading as="h1" size="xl" bgGradient="linear(to-r, cyan.400, blue.500, purple.600)" bgClip="text">
              RedStone Price Feed Demo
            </Heading>
            <Text color="gray.400" fontSize="lg">RSK Testnet Integration</Text>

            {!isConnected ? (
              <Button
                colorScheme="purple"
                size="lg"
                onClick={connectWallet}
                _hover={{ bg: 'purple.500' }}
                w="200px"
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <Card w="full" bg="gray.800" borderColor="gray.700">
                  <CardBody>
                    <VStack spacing={6}>
                      <Text fontSize="sm" color="gray.400">
                        Connected Account: {account}
                      </Text>
                      
                      <Input
                        placeholder="Enter contract address"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        size="lg"
                        bg="gray.700"
                        borderColor="gray.600"
                        _hover={{ borderColor: 'blue.400' }}
                        _focus={{ borderColor: 'blue.400', boxShadow: 'none' }}
                      />

                      <HStack spacing={4} w="full" flexWrap="wrap">
                        <Card flex={1} minW="200px" bg="gray.700" borderColor="gray.600">
                          <CardBody>
                            <VStack>
                              <Text fontSize="lg" color="gray.300">ETH Price</Text>
                              <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
                                ${Number(ethPrice).toLocaleString()}
                              </Text>
                            </VStack>
                          </CardBody>
                        </Card>

                        <Card flex={1} minW="200px" bg="gray.700" borderColor="gray.600">
                          <CardBody>
                            <VStack>
                              <Text fontSize="lg" color="gray.300">BTC Price</Text>
                              <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.500, purple.600)" bgClip="text">
                                ${Number(btcPrice).toLocaleString()}
                              </Text>
                            </VStack>
                          </CardBody>
                        </Card>

                        <Card flex={1} minW="200px" bg="gray.700" borderColor="gray.600">
                          <CardBody>
                            <VStack>
                              <Text fontSize="lg" color="gray.300">RBTC Price</Text>
                              <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, purple.500, pink.600)" bgClip="text">
                                ${Number(rbtcPrice).toLocaleString()}
                              </Text>
                            </VStack>
                          </CardBody>
                        </Card>

                        <Card flex={1} minW="200px" bg="gray.700" borderColor="gray.600">
                          <CardBody>
                            <VStack>
                              <Text fontSize="lg" color="gray.300">RIF Price</Text>
                              <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, pink.500, red.600)" bgClip="text">
                                ${Number(rifPrice).toLocaleString()}
                              </Text>
                            </VStack>
                          </CardBody>
                        </Card>
                      </HStack>

                      <Button
                        colorScheme="purple"
                        size="lg"
                        onClick={fetchPrices}
                        isLoading={loading}
                        loadingText="Fetching Prices..."
                        w="full"
                        _hover={{ bg: 'purple.500' }}
                        isDisabled={!contractAddress}
                      >
                        Fetch Prices
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {error && (
                  <Alert status="error" bg="red.900" color="white">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
              </>
            )}
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
