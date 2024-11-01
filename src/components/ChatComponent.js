import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Speech from "speak-tts";
import { AudioOutlined } from "@ant-design/icons";

const { Search } = Input;

const DOMAIN = "http://localhost:5001";

const searchContainerStyle = {
  display: "flex",
  justifyContent: "center",
};

const ChatComponent = ({ isLoading, setIsLoading, handleResp }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isChatModeOn, setIsChatModeOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speech, setSpeech] = useState();

  // Speech recognition
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const speech = new Speech();
    speech
      .init({
        volume: 1,
        lang: "en-US",
        rate: 1,
        pitch: 1,
        voice: "Google US English",
        splitSentences: true,
      })
      .then((data) => {
        console.log(`speech is ready, voices are available: `, data);
        setSpeech(speech);
      })
      .catch((err) => {
        console.error(`An error occurred while initializing: ${err}`);
      });
  }, []);

  useEffect(() => {
    if (!listening && !!transcript) {
      (async () => await onSearch(transcript))();
      setIsRecording(false);
    }
  }, [listening, transcript]);

  const talk = (content) => {
    speech
      .speak({
        text: content,
        queue: false,
        listeners: {
          onstart: () => {
            console.log("start utterance");
          },
          onend: () => {
            console.log("end utterance");
          },
          onresume: () => {
            console.log("resume utterance");
          },
          onboundary: (event) => {
            console.log(
              `${event.name} boundary reached after ${event.elapsedTime} milliseconds`,
            );
          },
        },
      })
      .then(() => {
        console.log("Success!");
        userStartConvo();
      })
      .catch((err) => {
        console.log("An error occurred: ", err);
      });
  };

  const userStartConvo = () => {
    SpeechRecognition.startListening();
    setIsRecording(true);
    resetTranscript();
  };

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
      if (isChatModeOn) {
        talk(response.data);
      }
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

  const handleChatModeClick = () => {
    setIsChatModeOn(!isChatModeOn);
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  const handleRecordingClick = () => {
    if (isRecording) {
      setIsRecording(false);
      SpeechRecognition.stopListening();
    } else {
      setIsRecording(true);
      SpeechRecognition.startListening();
    }
  };

  return (
    <div style={searchContainerStyle}>
      {!isChatModeOn && (
        <Search
          placeholder="Ask me anything about the uploaded documents!"
          enterButton="Ask"
          size="large"
          onSearch={onSearch}
          loading={isLoading}
          value={searchValue}
          onChange={handleChange}
        />
      )}
      <Button
        type="primary"
        size="large"
        danger={isChatModeOn}
        onClick={handleChatModeClick}
        style={{ marginLeft: "5px" }}
      >
        Talk mode: {isChatModeOn ? "On" : "Off"}
      </Button>
      {isChatModeOn && (
        <Button
          type="primary"
          icon={<AudioOutlined />}
          size="large"
          danger={isRecording}
          onClick={handleRecordingClick}
          style={{ marginLeft: "5px" }}
        >
          {isRecording ? "Recording..." : "Click to record"}
        </Button>
      )}
    </div>
  );
};

export default ChatComponent;
