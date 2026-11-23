import { IconButton } from "@misty/ui";

import { socialLinks } from "@/components/layout/Footer/footer_links";

export default function NavbarSocials() {
  return (
    <div
      aria-label="Misty social links"
      className="hidden items-center gap-0.5 md:flex"
    >
      {socialLinks.map(({ label, href, icon: Icon, placeholder }) => (
        <IconButton
          key={label}
          asChild
          label={placeholder ? `Add Misty's ${label} URL` : `Misty on ${label}`}
        >
          <a
            href={href}
            target={placeholder ? undefined : "_blank"}
            rel={placeholder ? undefined : "noopener noreferrer"}
          >
            <Icon aria-hidden="true" />
          </a>
        </IconButton>
      ))}
    </div>
  );
}
