import {
  Box,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import SidebarContent from "./SidebarContent";
import MobileNav from "./MobileNav";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function DLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  const teacherId = user?.teacher_id || "";

  return (
    <Box>
      <Box display={{ base: "none", md: "block" }}>
        <SidebarContent onClose={onClose} teacherId={teacherId} />
      </Box>
      {/* Drawer for mobile view */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={onClose} teacherId={teacherId} />
        </DrawerContent>
      </Drawer>
      {/* Main content area */}
      <Box ml={{ base: 0, md: 60 }} p="9">
        <MobileNav onOpen={onOpen} />
        <Outlet />
      </Box>
    </Box>
  );
}
