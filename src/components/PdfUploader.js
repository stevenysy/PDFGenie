import { message, Upload } from "antd";
import axios from "axios";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const DOMAIN = "http://localhost:5001";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${DOMAIN}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    return null;
  }
};

const PdfUploader = () => {
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    const response = await uploadFile(file);
    if (response && response.status === 200) {
      onSuccess(response);
    } else {
      onError(new Error("Upload failed"));
    }
  };

  const handleChange = (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} uploaded successfully`);
    } else if (status === "error") {
      message.error(`failed to upload ${info.file.name}`);
    }
  };

  const handleDrop = (e) => {
    console.log(`Dropped files: ${e.dataTransfer.files}`);
  };

  return (
    <Dragger
      name="file"
      multiple={true}
      customRequest={handleCustomRequest}
      onChange={handleChange}
      onDrop={handleDrop}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">Supports single or bulk upload.</p>
    </Dragger>
  );
};

export default PdfUploader;
