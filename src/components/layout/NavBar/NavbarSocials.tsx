import { socialLinks } from "@/components/layout/Footer/footerLinks";

export default function NavbarSocials() {
  return (
    <div
      aria-label="Misty social links"
      className="hidden items-center gap-0.5 md:flex"
    >
      {socialLinks.map(({ label, href, icon: Icon, placeholder }) => (
        <a
          key={label}
          href={href}
          target={placeholder ? undefined : "_blank"}
          rel={placeholder ? undefined : "noopener noreferrer"}
          aria-label={placeholder ? `${label} link placeholder` : label}
          title={placeholder ? `Add Misty's ${label} URL` : `Misty on ${label}`}
          className={`${label === "GitHub" ? "inline-flex" : "hidden lg:inline-flex"} size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground focus-visible:bg-control-hover focus-visible:text-foreground focus-visible:outline-none`}
        >
          <Icon aria-hidden="true" className="size-3.5" />
        </a>
      ))}
    </div>
  );
}
