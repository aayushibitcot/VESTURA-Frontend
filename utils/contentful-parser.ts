/**
 * Format Contentful API response to structured category data
 * Usage: const formattedCategories = formatContentfulResponse(contentfulData);
 */

export function formatContentfulResponse(contentfulData: any) {
  if (!contentfulData?.items || !Array.isArray(contentfulData.items)) {
    return [];
  }
  
  const assets = contentfulData.includes?.Asset || [];
  const productCount = contentfulData.items.length;

  const formattedData = contentfulData.items.map((item: any) => {
    // Extract name
    const name = item.fields?.name || "";
    const id = item.fields?.id || "";
    
    // Extract description from: description.content[0].content[0].value
    const description = item.fields?.description?.content?.[0]?.content?.[0]?.value || undefined;
    
    // Extract image: match image.sys.id with includes.Asset and get fields.file.url
    const imageId = item.fields?.image?.sys?.id;
    let imageUrl = "/placeholder.jpg";
    
    if (imageId) {
      const asset = assets.find((a: any) => a.sys.id === imageId);
      if (asset?.fields?.file?.url) {
        // Add https: protocol if URL starts with //
        imageUrl = asset.fields.file.url.startsWith("//") 
          ? `https:${asset.fields.file.url}` 
          : asset.fields.file.url;
      }
    }
    
    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replaceAll(/\s+/g, "-")
      .replaceAll(/[^\w-]+/g, "")
      .replaceAll(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    return {
      id: id,
      name,
      slug,
      description,
      image: imageUrl,
      productCount,
    };
  });

  // Sort by id in ascending order
  return formattedData.sort((a: any, b: any) => {
    // Convert to numbers if they are numeric strings
    const idA = Number.isNaN(Number(a.id)) ? a.id : Number(a.id);
    const idB = Number.isNaN(Number(b.id)) ? b.id : Number(b.id);
    
    if (typeof idA === 'number' && typeof idB === 'number') {
      return idA - idB;
    }
    // If not numbers, sort as strings
    return String(idA).localeCompare(String(idB));
  });
}

