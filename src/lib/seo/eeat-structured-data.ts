export function buildPersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Paweł Celiński",
    url: "https://www.convertbase.app/en/about",
    image: "https://www.convertbase.app/author-pawel-celinski.webp",
    sameAs: ["https://www.linkedin.com/in/pawe%C5%82-celi%C5%84ski-599ba6120"],
    jobTitle: "Power Platform Developer",
    worksFor: {
      "@type": "Organization",
      name: "Toyota Material Handling Poland"
    },
    description:
      "Developer and founder of ConvertBase.app. Power Platform Developer at Toyota Material Handling Poland."
  };
}

export function buildWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ConvertBase.app",
    url: "https://www.convertbase.app",
    description:
      "Free online converters, calculators, generators and utility tools with instant results.",
    author: {
      "@type": "Person",
      name: "Paweł Celiński"
    }
  };
}
