import React from "react";
import { Box, Skeleton, SkeletonText, Stack, Grid } from "@chakra-ui/react";

const LoadingSkeleton: React.FC = () => {
  return (
    <Box p={4} bg="gray.50" minHeight="100vh" className="no-copy-no-select">
      <Stack spacing={8}>
        <Skeleton height="40px" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <Skeleton height="250px" />
          <Skeleton height="250px" />
        </Grid>
      </Stack>
    </Box>
  );
};

export default LoadingSkeleton;
