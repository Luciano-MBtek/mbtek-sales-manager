import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { CopyButton } from "../CopyButton";
import { DownloadButton } from "../DownloadButton";
import { ThinkingDots } from "./ThinkingDots";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const imageMatches = Array.from(message.matchAll(imageRegex));
  const imageUrls = imageMatches.map((match) => match[1]);

  const textWithoutImages = message.replace(imageRegex, "");

  const ChatImage = (props: { src: string; alt?: string }) => {
    return (
      <div className="relative inline-block my-2">
        <Image
          alt={props.alt || "Image"}
          src={props.src}
          width={300}
          height={300}
          className="max-w-[300px] max-h-[300px] object-contain rounded-lg"
        />
        <div className="absolute bottom-1 right-2 p-1 bg-opacity-75 rounded hover:bg-opacity-100 transition">
          <CopyButton string={props.src} />
        </div>
        <div className="absolute bottom-1 right-14 p-1 bg-opacity-75 rounded hover:bg-opacity-100 transition">
          <DownloadButton url={props.src} />
        </div>
      </div>
    );
  };

  if (message === "..." && !isUser) {
    return <ThinkingDots />;
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="relative group">
        {!isUser && (
          <div className="absolute bottom-1 right-[11%] p-1 bg-opacity-75 rounded hover:bg-opacity-100 transition opacity-0 group-hover:opacity-100">
            <CopyButton string={message} />
          </div>
        )}
        <div
          className={`max-w-[90%] rounded-lg p-4 flex items-center flex-col justify-center ${
            isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          {isUser ? (
            <p>{message}</p>
          ) : (
            <>
              {/* Render markdown text without images */}
              <ReactMarkdown className="prose dark:prose-invert">
                {textWithoutImages}
              </ReactMarkdown>
              {/* Render images separately */}
              <div className="mt-4">
                {imageUrls.map((url, index) => (
                  <ChatImage key={index} src={url} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
