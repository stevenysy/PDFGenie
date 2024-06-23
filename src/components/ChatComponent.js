import { Input } from "antd";
import { useState } from "react";
import axios from "axios";

const { Search } = Input;

const DOMAIN = "http://localhost:5001";

const searchContainerStyle = {
  display: "flex",
  justifyContent: "center",
};

const ChatComponent = ({ isLoading, setIsLoading, handleResp }) => {
  const [searchValue, setSearchValue] = useState("");

  const onSearch = async (question) => {
    setSearchValue("");
    setIsLoading(true);

    try {
      const response = await axios.get(`${DOMAIN}/chat`, {
        params: {
          question,
        },
      });
      handleResp(question, response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
      handleResp(question, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={searchContainerStyle}>
      <Search
        placeholder="Ask me anything about the uploaded documents!"
        enterButton="Ask"
        size="large"
        onSearch={onSearch}
        loading={isLoading}
        value={searchValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default ChatComponent;
