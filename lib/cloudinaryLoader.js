// lib/cloudinaryLoader.js

export default function cloudinaryLoader({ src, width, quality }) {
  // Cloudinary transformation parameters
  const params = [
    `w_${width}`,                    // width
    `q_${quality || 80}`,            // quality (80 is good balance)
    'f_auto',                        // automatic format (WebP/AVIF when supported)
    'c_limit',                       // limit to fit within dimensions
    'dpr_2'                          // high density for retina screens
  ];

  return `${src}?${params.join('&')}`;
}