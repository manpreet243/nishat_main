// Domain Protection Configuration
// This file contains the configuration for domain-based access control

export interface DomainConfig {
  authorizedDomains: string[];
  allowLocalhost: boolean;
  allowDevelopment: boolean;
  logAccessAttempts: boolean;
  redirectUrl?: string;
}

// Default configuration for Nishat Beverages application
export const domainConfig: DomainConfig = {
  // List of authorized domains that can access this application
  authorizedDomains: [
  'nishatbeverages.com',
  'www.nishatbeverages.com',
  'localhost',
  '127.0.0.1',
  'nishatmain-q2mu67mnc-manpreet243s-projects.vercel.app'
],

  
  // Allow access from localhost and local IP addresses during development
  allowLocalhost: true,
  
  // Allow access from development environments (staging, etc.)
  allowDevelopment: true,
  
  // Log unauthorized access attempts to console
  logAccessAttempts: true,
  
  // Optional: Redirect unauthorized users to a specific URL
  // redirectUrl: 'https://nishatbeverages.com',
};

// Environment-specific configurations
export const getEnvironmentConfig = (): DomainConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isDevelopment) {
    return {
      ...domainConfig,
      allowLocalhost: true,
      allowDevelopment: true,
      logAccessAttempts: false, // Reduce console noise in development
    };
  }
  
  if (isProduction) {
    return {
      ...domainConfig,
      allowLocalhost: false, // Disable localhost in production
      allowDevelopment: false,
      logAccessAttempts: true,
    };
  }
  
  return domainConfig;
};

// Utility function to check if a domain is authorized
export const isDomainAuthorized = (hostname: string, config: DomainConfig = domainConfig): boolean => {
  // Check exact matches
  if (config.authorizedDomains.includes(hostname)) {
    return true;
  }
  
  // Check wildcard matches
  const hasWildcardMatch = config.authorizedDomains.some(domain => {
    if (domain.startsWith('*.')) {
      const baseDomain = domain.substring(2);
      return hostname.endsWith(baseDomain);
    }
    return false;
  });
  
  if (hasWildcardMatch) {
    return true;
  }
  
  // Check localhost/development access
  const isLocalhost = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     hostname.startsWith('192.168.') ||
                     hostname.startsWith('10.') ||
                     hostname.startsWith('172.');
  
  if (isLocalhost && config.allowLocalhost) {
    return true;
  }
  
  // Check development domains
  const isDevelopmentDomain = hostname.includes('staging') || 
                             hostname.includes('dev') || 
                             hostname.includes('test');
  
  if (isDevelopmentDomain && config.allowDevelopment) {
    return true;
  }
  
  return false;
};

// Security headers configuration
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
};

export default domainConfig;

