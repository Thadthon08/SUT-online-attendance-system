import React from "react";
import { Box, CloseButton, Flex, Text, BoxProps } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { LinkItems } from "./LinkItems";
import NavItem from "./NavItem";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const location = useLocation();

  return (
    <Box
      transition="3s ease"
      bg={"white"}
      borderRight="1px"
      borderRightColor={"gray.200"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          SUT Attendence
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          href={link.href}
          active={location.pathname === link.href ? "active" : ""}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

export default SidebarContent;
