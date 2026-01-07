import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-gray-300 py-10 mt-20 bg-blue-100">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* Logo Samaan */}
        <div>
          <img src="/gambar/logo/samaanlogo.png" alt="logo samaan" className="max-w-5/12"/>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="text-blue-950 hover:text-white transition">Home</a></li>
            <li><a href="/home" className="text-blue-950 hover:text-white transition">About Us</a></li>
            <li><a href="/browse-event" className="text-blue-950 hover:text-white transition">Event</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm text-blue-950 ">
            <li>Email: info@samaan.com</li>
            <li>Phone: +62 812-3456-7890</li>
            <li>Address: Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>

      <div className=" border-t border-gray-300 mt-8 pt-4 text-center text-sm text-blue-950 ">
        © {new Date().getFullYear()} Samuel x Hanan. All rights reserved.
      </div>
    </footer>
  )
}