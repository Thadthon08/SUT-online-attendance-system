import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import SidebarContent from "./SidebarContent";
import MobileNav from "./MobileNav";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function DLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  const teacherId: string = user?.teacher_id ?? "";

  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
        teacherId={teacherId}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose} // Correct event handler for Drawer close
        returnFocusOnClose={false}
        onOverlayClick={onClose} // Correct event handler for overlay click
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} teacherId={teacherId} />
        </DrawerContent>
      </Drawer>
      {/* Mobile navigation */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: "350px" }} p={{ base: 0, md: "10px" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
