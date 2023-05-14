import React, { useState } from "react";
import { Box, Button, Text, Input, Stack, Flex } from "@chakra-ui/react";
import Wallets from "../Wallets";

export default function Staking() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);

  const handleStake = () => {
    alert(`Staking ${amount} DOT!`);
  };

  return (
    <Flex direction={"column"} justifyContent="center" alignItems="center">
      <Box width="500px">
        <Box p={6} boxShadow="lg" rounded="lg" bg="white">
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Staked DOT:
            </Text>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Total DOT:
            </Text>
            <Input
              id="amount"
              type="number"
              placeholder="Amount"
              size="lg"
              mb={4}
              value={amount}
              focusBorderColor="teal.500"
              onChange={(e) => setAmount(e.target.value)}
            />

            <Stack spacing={2} color="gray.500">
              <Text>Exchange Rate:</Text>
              <Text>Expected Return:</Text>
              <Text>Transaction Costs:</Text>
            </Stack>
          </Box>
        </Box>
        {walletAddress ? (
          <Button
            colorScheme="teal"
            onClick={handleStake}
            size="lg"
            width="100%"
            mt={8}
          >
            Stake
          </Button>
        ) : (
          <Wallets btnWidth="100%" mt={8} />
        )}
      </Box>
    </Flex>
  );
}
