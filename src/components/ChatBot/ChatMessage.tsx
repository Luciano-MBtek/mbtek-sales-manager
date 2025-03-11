/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "../CopyButton";
import { DownloadButton } from "../DownloadButton";
import { ThinkingDots } from "./ThinkingDots";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  if (message === "..." && !isUser) {
    return <ThinkingDots />;
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="relative group">
        {/* Button to copy full message (optional in the Assistant role) */}
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
          {/* If it is the user, we display the text directly */}
          {isUser ? (
            <span className="block">{message}</span>
          ) : (
            <ReactMarkdown
              className="prose dark:prose-invert"
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <span className="block">{children}</span>,
                img({ node, ...props }) {
                  if (props.src && props.src.includes("quickchart.io")) {
                    return (
                      <span className="relative inline-block my-2">
                        <img
                          alt={props.alt || "Image"}
                          src={props.src}
                          className="max-w-[300px] max-h-[300px] object-contain rounded-lg"
                        />
                        <span className="absolute bottom-1 right-2 p-1 bg-opacity-75 rounded hover:bg-opacity-100 transition">
                          <CopyButton string={props.src} />
                        </span>
                        <span className="absolute bottom-1 right-14 p-1 bg-opacity-75 rounded hover:bg-opacity-100 transition">
                          <DownloadButton url={props.src} />
                        </span>
                      </span>
                    );
                  }

                  return (
                    <span className="relative inline-block my-2">
                      <Image
                        alt={props.alt || "Image"}
                        src={props.src || ""}
                        width={300}
                        height={300}
                        className="max-w-[300px] max-h-[300px] object-contain rounded-lg"
                      />
                      <span className="absolute bottom-1 right-2 p-1 bg-opacity-75 rounded hover:bg-opacity-100 transition">
                        <CopyButton string={props.src || ""} />
                      </span>
                      <span className="absolute bottom-1 right-14 p-1 bg-opacity-75 rounded hover:bg-opacity-100 transition">
                        <DownloadButton url={props.src || ""} />
                      </span>
                    </span>
                  );
                },
              }}
            >
              {message}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
