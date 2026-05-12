import Image from "next/image";
import Logo from "@/public/images/logo_1.svg";
import { FiLinkedin } from "react-icons/fi";
import { LiaFacebookF } from "react-icons/lia";

const Footer = () => {
  return (
    <footer className="bg-[#f2f2f2] px-4 md:px-6 pt-6 pb-4 rounded-b-lg box-border w-full mobile:pt-4 mobile:pb-3">
      {/* Main footer content - stacked on mobile, multi-column grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-start">
        {/* Logo and badge section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Logo className="w-[162px] h-auto block overflow-visible mobile:w-[110px]" />
          </div>
          <Image
            src="/badge.svg"
            alt="Pipeda Certification Badge"
            height={40}
            width={140}
            className="mobile:h-[28px] mobile:w-auto"
            sizes="(max-width: 850px) 98px, 140px"
            loading="lazy"
          />
        </div>

        {/* Links section - stacked on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="font-open-sans text-sm md:text-base font-bold text-text mb-2 md:mb-1">
              Privacy & Policies
            </div>
            <a
              target="_blank"
              href="https://vetriconntandc.notion.site/VETRICONN-INC-TERMS-AND-CONDITIONS-22ac6380202c807fa63ef48c7ca69815"
              className="font-open-sans text-sm md:text-base text-text opacity-80 no-underline transition-colors duration-200 hover:text-primary py-2 md:py-0 md:min-h-[44px] flex items-center"
            >
              Terms & Conditions
            </a>
            <a
              target="_blank"
              href="https://vetriconntandc.notion.site/VETRICONN-INC-TERMS-AND-CONDITIONS-22ac6380202c807fa63ef48c7ca69815"
              className="font-open-sans text-sm md:text-base text-text opacity-80 no-underline transition-colors duration-200 hover:text-primary py-2 md:py-0 md:min-h-[44px] flex items-center"
            >
              Privacy Guide
            </a>
          </div>
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="font-open-sans text-sm md:text-base font-bold text-text mb-2 md:mb-1">
              Company
            </div>
            <a
              href="/about"
              className="font-open-sans text-sm md:text-base text-text opacity-80 no-underline transition-colors duration-200 hover:text-primary py-2 md:py-0 md:min-h-[44px] flex items-center"
            >
              About Us
            </a>
            <a
              href="/faq"
              className="font-open-sans text-sm md:text-base text-text opacity-80 no-underline transition-colors duration-200 hover:text-primary py-2 md:py-0 md:min-h-[44px] flex items-center"
            >
              FAQs
            </a>
          </div>
        </div>
      </div>

      {/* Copyright and social section */}
      <div className="mt-6 md:mt-8 bg-[#e8e8e8] rounded-lg py-3 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        <div className="font-open-sans text-xs md:text-sm font-normal text-primary">
          Vetriconn © 2025 All rights Reserved.
        </div>
        <div className="flex gap-4 md:gap-5">
          <a
            href="https://www.facebook.com/profile.php?id=61580233844003"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-2xl md:text-3xl transition-colors duration-200 hover:text-primary-hover min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <LiaFacebookF />
          </a>
          <a
            href="https://www.linkedin.com/company/vetriconn-inc/?viewAsMember=true"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-2xl md:text-3xl transition-colors duration-200 hover:text-primary-hover min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <FiLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
