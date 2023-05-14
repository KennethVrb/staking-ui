import React from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Button,
  Text,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import Wallets from "../Wallets";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Flex
        as="header"
        align="center"
        justify="space-between"
        bg="teal"
        py={4}
        px={6}
        color="white"
      >
        <Heading as="h1" size="md">
          Polkadot Staking Dashboard
        </Heading>
        <Wallets />
      </Flex>
      <Box flex="1" p={6}>
        {children}
      </Box>
      <Flex as="footer" align="center" justify="center" py={2}>
        <Text fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} OkAlice. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default Layout;
