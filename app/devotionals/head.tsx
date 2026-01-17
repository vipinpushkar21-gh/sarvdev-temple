export default function Head() {
  const description = "Explore sacred mantras, bhajans, stotras and more.";
  const title = "Devotionals";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: "Sarvdev Temple"
    }
  };

  return (
    <>
      <title>{title} | Sarvdev</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
