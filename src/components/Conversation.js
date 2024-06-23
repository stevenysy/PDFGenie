import { Spin } from "antd";

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  marginBottom: "20px",
};

const userContainerStyle = {
  textAlign: "right",
};

const agentContainerStyle = {
  textAlign: "left",
};

const userStyle = {
  maxWidth: "50%",
  textAlign: "left",
  backgroundColor: "#1677FF",
  color: "white",
  display: "inline-block",
  borderRadius: "10px",
  padding: "10px",
  marginBottom: "10px",
};

const agentStyle = {
  maxWidth: "50%",
  textAlign: "left",
  backgroundColor: "#F9F9FE",
  color: "black",
  display: "inline-block",
  borderRadius: "10px",
  padding: "10px",
  marginBottom: "10px",
};

const Conversation = ({ content, isLoading }) => {
  return (
    <>
      {content?.map((exchange, index) => (
        <div key={index} style={containerStyle}>
          <div style={userContainerStyle}>
            <div style={userStyle}>{exchange.question}</div>
          </div>
          <div style={agentContainerStyle}>
            <div style={agentStyle}>{exchange.answer}</div>
          </div>
        </div>
      ))}
      {isLoading && <Spin size="large" style={{ margin: "10px" }} />}
    </>
  );
};

export default Conversation;
