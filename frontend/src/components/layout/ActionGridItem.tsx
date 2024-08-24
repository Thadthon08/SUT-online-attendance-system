import React from "react";
import { GridItem, Text } from "@chakra-ui/react";

interface ActionGridItemProps {
  onClick: () => void;
  text: string;
  icon: JSX.Element;
}

const ActionGridItem: React.FC<ActionGridItemProps> = ({
  onClick,
  text,
  icon,
}) => (
  <GridItem
    w="100%"
    h="250px"
    bg="rgb(51, 51, 51)"
    borderRadius="md"
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    fontSize="2xl"
    _hover={{
      bg: "rgba(51, 51, 51,0.9)",
      cursor: "pointer",
      boxShadow: "lg",
      fontSize: "2rem",
    }}
    boxShadow="md"
    onClick={onClick}
    transition="all 0.3s ease"
  >
    {icon}
    <Text color="white" fontWeight="bold" textAlign="center" mt={4}>
      {text}
    </Text>
  </GridItem>
);

export default ActionGridItem;
