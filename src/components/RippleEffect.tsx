import Ripple from "@/components/magicui/ripple";
import Image from "next/image";
import Logo from "../../public/Logo_Vector.png";

export function RippleDemo() {
  return (
    <div className="relative flex h-[550px] w-[700px] flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
      <Image src={Logo} alt="MB-tek-Logo" priority={true} />
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-app">
        Sales Manager
      </p>
      <Ripple mainCircleSize={20} numCircles={10} mainCircleOpacity={0.3} />
    </div>
  );
}
