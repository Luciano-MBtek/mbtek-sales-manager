import BugModal from "./BugModal";

export default function FloatingBugReport() {
  return (
    <div className={"fixed top-10 right-4 z-40"}>
      <BugModal isSideBar={false} />
    </div>
  );
}
