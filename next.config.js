  /** @type {import('next').NextConfig} */
  const nextConfig = {
    experimental: {},
    compiler: {
      // Enables the styled-components SWC transform
      styledComponents: true  
    },
  }

  module.exports = nextConfig
