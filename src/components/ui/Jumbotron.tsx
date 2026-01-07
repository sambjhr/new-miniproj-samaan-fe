export default function Jumbotron() {
  return (
    <div
      className="relative flex h-100 w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/thumbnail.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Konten */}
      <div className="relative z-10 mx-auto max-w-4xl items-center px-6 text-center text-white">
        <img src="/gambar/logo/samaanwhite.png" alt="logo samaan" className="max-w-md" />
        <h2 className="mt-1 text-base text-white opacity-100 md:text-lg">
          Find events. Book tickets. Show up together
        </h2>
      </div>
    </div>
  );
}
