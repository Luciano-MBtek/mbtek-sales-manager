interface ThinkingDotsProps {
  className?: string;
  dotColor?: string;
  backgroundColor?: string;
}

export const ThinkingDots = ({
  className = "",
  dotColor = "bg-gray-500",
  backgroundColor = "bg-gray-100",
}: ThinkingDotsProps) => {
  return (
    <div className={`flex justify-start ${className}`}>
      <div className="relative group">
        <div
          className={`max-w-[100%] rounded-lg p-3 ${backgroundColor} text-gray-800`}
          role="status"
          aria-label="AI is thinking"
        >
          <div className="flex items-center space-x-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`w-3 h-3 ${dotColor} rounded-full animate-bounce`}
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
