export default function Footer() {
  return (
    <footer className="mt-20 bg-blue-100 py-10 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
        {/* Logo Samaan */}
        <div>
          <img
            src="/gambar/logo/samaanlogo.png"
            alt="logo samaan"
            className="max-w-5/12"
          />
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-blue-700">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="text-blue-950 transition hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a
                href="/home"
                className="text-blue-950 transition hover:text-white"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/browse-event"
                className="text-blue-950 transition hover:text-white"
              >
                Event
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-blue-700">
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm text-blue-950">
            <li>Email: info@samaan.com</li>
            <li>Phone: +62 812-3456-7890</li>
            <li>Address: Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm text-blue-950">
        © {new Date().getFullYear()} Samuel x Hanan. All rights reserved.
      </div>
    </footer>
  );
}
