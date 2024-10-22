export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="w-full flex flex-col items-start ml-4 p-4">
      <h1 className="mb-2 text-2xl font-semibold text-black md:text-7xl">
        {title}
      </h1>
      {subtitle && (
        <span className="text-sm font-light text-black md:text-2xl">
          {subtitle}
        </span>
      )}
    </div>
  );
}
