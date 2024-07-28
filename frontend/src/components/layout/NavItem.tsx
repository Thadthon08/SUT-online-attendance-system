import React, { ReactNode } from "react";
import { Flex, Icon, Link, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  href: string;
  active?: string;
}

const NavItem = ({ icon, children, href, active, ...rest }: NavItemProps) => {
  return (
    <Link
      as={NavLink}
      to={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        className={active}
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
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
