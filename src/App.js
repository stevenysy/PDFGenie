import "./App.css";
import ChatComponent from "./components/ChatComponent";
import { useState } from "react";
import { Layout, Typography } from "antd";
import PdfUploader from "./components/PdfUploader";
import Conversation from "./components/Conversation";

const chatComponentStyle = {
  position: "fixed",
  bottom: "0",
  width: "80%",
  left: "10%",
  marginBottom: "20px",
};

const pdfUploaderStyle = {
  margin: "auto",
  paddingTop: "80px",
  paddingLeft: "20%",
};

const conversationStyle = {
  height: "50%",
  overflowY: "auto",
};

function App() {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { Header, Content } = Layout;
  const { Title } = Typography;

  const handleResp = (question, answer) => {
    setConversation([...conversation, { question, answer }]);
  };

  return (
    <>
      <Layout style={{ height: "100vh", backgroundColor: "white" }}>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <Title style={{ color: "white" }}>Next AI</Title>
        </Header>
        <Content style={{ width: "80%" }}>
          <div style={pdfUploaderStyle}>
            <PdfUploader />
          </div>

          <br />
          <br />
          <div style={conversationStyle}>
            <Conversation content={conversation} isLoading={isLoading} />
          </div>
          <br />
          <br />
        </Content>
        <div style={chatComponentStyle}>
          <ChatComponent
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleResp={handleResp}
          />
        </div>
      </Layout>
    </>
  );
}

export default App;
