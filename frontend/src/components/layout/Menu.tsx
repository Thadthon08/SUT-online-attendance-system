import React from "react";
import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import SidebarContent from "./SidebarContent";
import MobileNav from "./MobileNav";
import { Outlet } from "react-router-dom";
import CarouselComponent from "./Carousel";

export default function DLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function removeQuotes(str: any) {
    return str ? str.replace(/"/g, "") : "";
  }

  const teacherId =
    removeQuotes(localStorage.getItem("teacher_id")) ?? undefined;
  return (
    <Box minH="100vh" bg={"rgb(242, 101, 34)"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        teacherId={teacherId.toString()}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} teacherId={teacherId} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: "260px" }} bg={"rgb(243, 246, 255)"} h={"100vh"}>
        <Outlet />
      </Box>
    </Box>
  );
}
