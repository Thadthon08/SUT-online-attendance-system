import { Layout, Typography, Card } from "antd";
import CreateRoomForm from "../layout/CreateRoomForm";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function CreateRoom() {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      {/* Header Section */}
      <Header
        style={{
          background: "#000000",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Title
          level={2}
          style={{ color: "white", lineHeight: "64px", margin: 0 }}
        >
          Create Check-In Room
        </Title>
      </Header>

      {/* Content Section */}
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <CreateRoomForm />
      </Content>
    </Layout>
  );
}
