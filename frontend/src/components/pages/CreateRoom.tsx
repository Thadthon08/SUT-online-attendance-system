import { Layout, Typography, Card } from "antd";
import CheckInRoomForm from "../layout/FormCreate";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function CreateRoom() {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Header style={{ background: "#002766", padding: "0 20px" }}>
        <Title
          level={2}
          style={{ color: "white", lineHeight: "64px", margin: 0 }}
        >
          Create Check-In Room
        </Title>
      </Header>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <Card
          title="Check-In Room Details"
          bordered={false}
          styles={{ header: { color: "red" } }}
          style={{
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "white",
          }}
        >
          <CheckInRoomForm />
        </Card>
      </Content>
    </Layout>
  );
}
