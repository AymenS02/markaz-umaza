import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background">
      <h1 className="text-5xl font-bold text-accent sm:text-6xl">
        Welcome to Our Platform
      </h1>

      <div className="bg-foreground w-[200px] h-[200px] mt-4 flex items-center justify-center rounded-2xl">
        <p className="text-primary">We are here!</p>
      </div>
    </div>
  );
}
