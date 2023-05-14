import React from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaWallet } from "react-icons/fa";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

const wallets = [
  {
    name: "Polkadot.js",
    logo: "/polkadot-wallet.png",
  },
  {
    name: "Talisman",
    logo: "/talisman-wallet.jpg",
  },
  // Add more wallets as needed
];

interface WalletsProps {
  btnWidth?: string;
  mt?: number;
}
export default function Wallets({ btnWidth, mt }: WalletsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleWalletClick = async (walletName: string) => {
    if (walletName === "Polkadot.js") {
      const extension = await web3Enable("polkadot-client-app");
      if (extension.length === 0) {
        console.log("No extension Found");
        return;
      }
      let acc = await web3Accounts();
      if (acc.length > 0) {
        console.log(acc);
        alert("Account connected");
      } else {
        alert("Please install Polkadot{.js} browser extension.");
      }
    } else {
      // Handle other wallets
    }
  };

  return (
    <Box mt={mt}>
      <Button
        leftIcon={<FaWallet />}
        colorScheme="teal"
        onClick={onOpen}
        width={btnWidth}
        size="lg"
      >
        Connect Wallet
      </Button>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size="lg" />
          <DrawerHeader borderBottomWidth="1px">Connect Wallet</DrawerHeader>
          <DrawerBody>
            {wallets.map((wallet) => (
              <Flex
                justifyContent="space-between"
                alignItems="center"
                key={wallet.name}
                my={4}
                as={Button}
                width="100%"
                height="60px"
                onClick={() => handleWalletClick(wallet.name)}
              >
                <Text>{wallet.name}</Text>
                <Image
                  src={wallet.logo}
                  alt={wallet.name}
                  width="40px"
                  borderRadius="50%"
                />
              </Flex>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
