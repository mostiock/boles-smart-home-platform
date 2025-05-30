export function Footer() {
  return (
    <footer className="bg-[#112137] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Products Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <div className="space-y-2">
              <a
                href="#smart-lighting"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                SMART HOME AUTOMATION LIGHTING
              </a>
              <a
                href="#security-cameras"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                SECURITY CAMERAS
              </a>
              <a
                href="#smart-speakers"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                SMART SPEAKERS
              </a>
              <a
                href="#smart-locks"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                SMART LOCKS
              </a>
              <a
                href="#sensors-detectors"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                SENSORS & DETECTORS
              </a>
              <a
                href="#control-panels"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                CONTROL PANELS
              </a>
            </div>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <a
                href="/support/customer-service"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Customer Service
              </a>
              <a
                href="/support/installation-guide"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Installation Guide
              </a>
              <a
                href="/support/warranty"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Warranty Information
              </a>
              <a
                href="/support/technical"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Technical Support
              </a>
              <a
                href="mailto:support@bolesenterprise.io"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                support@bolesenterprise.io
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <div className="space-y-2">
              <a
                href="/about"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                About us
              </a>
              <a
                href="/about/mission"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Our Mission
              </a>
              <a
                href="/careers"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Careers
              </a>
              <a
                href="/press"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Press
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#43abc3] text-white hover:bg-[#3a9bb5] h-10 px-4 py-2"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Shopping & Account Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shopping</h4>
            <div className="space-y-2">
              <button
                type="button"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors text-left"
              >
                Shopping Cart
              </button>
              <a
                href="/shipping"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Shipping Information
              </a>
              <a
                href="/returns"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Return Policy
              </a>
              <a
                href="/payment-options"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Payment Options
              </a>
              <a
                href="/track-order"
                className="block text-sm text-gray-300 hover:text-[#43abc3] transition-colors"
              >
                Track Your Order
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <a
                href="https://linkedin.com/company/boles-enterprise"
                className="text-gray-400 hover:text-[#43abc3]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@bolessmartshop"
                className="text-gray-400 hover:text-[#43abc3]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/bolessmartshop"
                className="text-gray-400 hover:text-[#43abc3]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/bolessmartshop"
                className="text-gray-400 hover:text-[#43abc3]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <a href="/terms" className="hover:text-[#43abc3]">
                Terms of Use
              </a>
              <span>|</span>
              <a href="/privacy" className="hover:text-[#43abc3]">
                Privacy
              </a>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            Copyright © 2025 Tech key Inc. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
