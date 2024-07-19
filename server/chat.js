import { PDFLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { ChatOpenAI } from "langchain/chat_models";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const chat = async (filePath = "./uploads/kessoku-band.pdf", query) => {
  // 1. Load data from PDF
  const loader = new PDFLoader(filePath);
  const data = await loader.load();

  // 2. Split the text
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });
  const splitDocs = await textSplitter.splitDocuments(data);

  // 3. Generate embeddings and vector store
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
  });
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
  );

  // 4. QA with customizing the prompt
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
  });

  const template = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.


{context}
Question: {question}
Helpful Answer:`;

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
    prompt: PromptTemplate.fromTemplate(template),
    // returnSourceDocuments: true
  });

  return await chain.call({
    query,
  });
};

export default chat;
