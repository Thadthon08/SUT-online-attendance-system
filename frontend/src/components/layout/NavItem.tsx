import React, { ReactNode } from "react";
import { Flex, Icon, FlexProps, Link } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { NavLink, useLocation, useParams } from "react-router-dom";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  href: string;
}

const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      as={NavLink}
      to={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="15px"
        mx="1"
        borderRadius="md"
        role="group"
        cursor="pointer"
        bg={isActive ? "black" : "transparent"}
        color={isActive ? "white" : "inherit"}
        _hover={{
          bg: "black",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

export default NavItem;
