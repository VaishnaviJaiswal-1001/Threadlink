import logo from "@/assets/threadlink-logo.png";

export const Footer = () => (
  <footer className="border-t border-border bg-surface mt-24">
    <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
      <div>
        <img src={logo} alt="Threadlink" className="h-12 w-auto mb-3" />
        <p className="text-[13px] text-text-secondary leading-relaxed">
          Connect. Automate. Focus. Achieve.
        </p>
      </div>
      {[
        { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
        { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
        { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="text-[13px] font-semibold mb-3">{col.title}</h4>
          <ul className="space-y-2 text-[13px] text-text-secondary">
            {col.links.map((l) => (
              <li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-5 text-[12px] text-text-muted">
        © {new Date().getFullYear()} Threadlink. All rights reserved.
      </div>
    </div>
  </footer>
);