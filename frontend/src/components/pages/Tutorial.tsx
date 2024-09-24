import React, { useState, useEffect } from "react";
import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Spin, Alert } from "antd";

// URL สำหรับรูปภาพที่อัปโหลด
const image1 = "https://img5.pic.in.th/file/secure-sv1/16a7962521da0d67a.md.jpg";
const image2 = "https://img2.pic.in.th/pic/21e762813b958d232.md.jpg";
const image3 = "https://img5.pic.in.th/file/secure-sv1/344e3e7a173ed5e38.md.jpg";
const image4 = "https://img5.pic.in.th/file/secure-sv1/344e3e7a173ed5e38.md.jpg";
const imageIOS1 = "https://img5.pic.in.th/file/secure-sv1/5d0a6cb4c7165320a.md.jpg";
const imageIOS2 = "https://img5.pic.in.th/file/secure-sv1/661a75e17ad9138b3.md.jpg";
const imageIOS3 = "https://img2.pic.in.th/pic/73380746d66de8228.md.jpg";
const imageIOS4 = "https://img2.pic.in.th/pic/8134074dc422068e4.md.jpg";

// Updated tutorial content
const tutorialStepsAndroid = [
  { text: "เปิด การตั้งค่า บนอุปกรณ์ Android ของคุณ", image: image1 },
  { text: "ไปที่ตำแหน่งที่ตั้ง", image: image2 },
  { text: "เลือกเบราเซอร์ที่ใช้งาน", image: image3 },
  { text: "ขออนุญาตตำแหน่ง", image: image4 }
];

const tutorialStepsIOS = [
  { text: "เปิด การตั้งค่า", image: imageIOS1 },
  { text: "เลือกไปที่ความเป็นส่วนตัวและความปลอดภัย", image: imageIOS2 },
  { text: "บริการหาตำแหน่งที่ตั้งและทำการเลือกเบราเซอร์ที่เราทำการใช้งาน", image: imageIOS3 },
  { text: "อนุญาตในระหว่างแอปหรือถามทุกครั้ง", image: imageIOS4 }
];

const Tutorial: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading of tutorial content
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box p={4}>
      <Container maxW={{ base: "100%", md: "container.lg" }} mt={6}>
        <Box
          border={"1px solid rgba(69, 69, 71,0.2)"}
          bg={"white"}
          mb={5}
          display={"flex"}
          alignItems={"center"}
          p={5}
        >
          <Text fontWeight={"bold"} fontSize={"2xl"}>
            Tutorial - วิธีการใช้งานผ่าน IOS และ Android
          </Text>
        </Box>
        <Box
          border={"1px solid rgba(69, 69, 71,0.2)"}
          p={0}
          bg={"white"}
          mt={5}
        >
          {loading ? (
            <Spin tip="Loading tutorial..." />
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <Tabs isFitted variant='enclosed'>
              <TabList mb='1em'>
                <Tab fontSize={"lg"}>Android</Tab>
                <Tab fontSize={"lg"}>iOS</Tab>
              </TabList>
              <TabPanels>
                {/* Tab สำหรับ Android */}
                <TabPanel>
                  <Text fontWeight="bold" fontSize="xl" mb={3}>
                    สำหรับ Android
                  </Text>
                  {tutorialStepsAndroid.map((step, index) => (
                    <Box key={index} display="flex" flexDirection="column" mb={4}>
                      <Box display="flex" alignItems="center">
                        <Box
                          width="10px"
                          height="10px"
                          borderRadius="50%"
                          bg="black"
                          marginRight="8px"
                        />
                        <Text fontSize={"lg"}>{step.text}</Text>
                      </Box>
                      {step.image && (
                        <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                          <img
                            src={step.image}
                            alt={`Step Android ${index + 1}`}
                            style={{ maxWidth: "30%", height: "auto" }}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                </TabPanel>

                {/* Tab สำหรับ iOS */}
                <TabPanel>
                  <Text fontWeight="bold" fontSize="xl" mb={3}>
                    สำหรับ iOS
                  </Text>
                  {tutorialStepsIOS.map((step, index) => (
                    <Box key={index} display="flex" flexDirection="column" mb={4}>
                      <Box display="flex" alignItems="center">
                        <Box
                          width="10px"
                          height="10px"
                          borderRadius="50%"
                          bg="black"
                          marginRight="8px"
                        />
                        <Text fontSize={"lg"}>{step.text}</Text>
                      </Box>
                      {step.image && (
                        <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                          <img
                            src={step.image}
                            alt={`Step iOS ${index + 1}`}
                            style={{ maxWidth: "30%", height: "auto" }}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Tutorial;
