import Image from "next/image";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-ice">
      <Image
        src="/logo-vitafarma.png"
        alt="VitaFarma Antas"
        width={170}
        height={90}
        priority
        className="h-auto w-40 animate-pulse"
      />
    </div>
  );
}
