'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Separator } from '../ui/separator';

export function Breadcrumbs({
  homeLabel = 'Dashboard',
  separator = '/',
  transformLabel = (path) => {
    // Convert path segment to readable label
    // e.g., "product-category" becomes "Product Category"
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  // Optional custom routes mapping for prettier labels and dynamic params
  customRoutes = {
    // Example: 'dashboard': 'Home'
  },
  // Dynamic route patterns and their friendly names
  dynamicRoutes = {
    // Define patterns for dynamic routes and their display names
    // Format: 'parentPath/': { pattern: RegExp, label: 'Friendly Name', queryParam: 'param-name' }
    'campaigns/': { 
      pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 
      label: 'Review Details',
      queryParam: 'campaign-name' // Query parameter that contains the name
    },
    // Add more dynamic route patterns as needed
    // 'users/': { pattern: /^\d+$/, label: 'User Profile', queryParam: 'user-name' }
  },
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const breadcrumbs = useMemo(() => {
    // Skip processing if we're on the root of the authenticated layout
    if (pathname === '/') return [];
    
    // Remove the initial slash and split the path
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    
    // Skip processing if we're on the auth or other public routes
    if (pathSegments[0] === 'auth' || pathSegments[0] === 'login' || pathSegments[0] === 'sign-up') {
      return [];
    }
    
    // Create breadcrumb items
    const breadcrumbItems = [];
    
    // Always include home (dashboard in this case)
    breadcrumbItems.push({
      label: homeLabel,
      path: '/dashboard',
      isLast: pathSegments.length === 0 || 
              (pathSegments.length === 1 && pathSegments[0] === 'dashboard')
    });
    
    // Build up breadcrumb items based on path segments
    if (pathSegments.length > 0) {
      let currentPath = '';
      
      pathSegments.forEach((segment, index) => {
        // Skip adding dashboard twice if it's already included as home
        if (index === 0 && segment === 'dashboard') {
          return;
        }

        currentPath += `/${segment}`;
        const isLast = index === pathSegments.length - 1;
        
        // Check if this segment is a dynamic parameter (like a UUID)
        let isDynamic = false;
        let dynamicLabel = null;
        
        // Check if the previous segment has a dynamic route pattern defined
        if (index > 0) {
          const parentSegment = pathSegments[index - 1] + '/';
          const dynamicRouteConfig = dynamicRoutes[parentSegment];
          
          if (dynamicRouteConfig && dynamicRouteConfig.pattern.test(segment)) {
            isDynamic = true;
            dynamicLabel = dynamicRouteConfig.label;
          }
        }
        
        // Determine the label
        let label;
        if (isDynamic && dynamicLabel) {
          // Check if there's a query parameter containing a name
          const parentSegment = pathSegments[index - 1] + '/';
          const dynamicRouteConfig = dynamicRoutes[parentSegment];
          
          if (dynamicRouteConfig && dynamicRouteConfig.queryParam) {
            // Try to get the name from query parameters
            const nameFromQuery = searchParams.get(dynamicRouteConfig.queryParam);
            
            if (nameFromQuery) {
              // Use the name from query parameters
              label = decodeURIComponent(nameFromQuery);
            } else {
              // Fall back to the default dynamic label
              label = dynamicLabel;
            }
          } else {
            label = dynamicLabel;
          }
        } else {
          label = customRoutes[segment] || transformLabel(segment);
        }
        
        breadcrumbItems.push({
          label,
          path: currentPath,
          isLast,
          isDynamic
        });
      });
    }
    
    return breadcrumbItems;
  }, [pathname, searchParams, homeLabel, customRoutes, dynamicRoutes, transformLabel]);
  
  // Don't render anything if there are no breadcrumbs (e.g., on public routes)
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <>
    <nav aria-label="breadcrumb" className="w-full px-2 py-2">
      <ol className="flex flex-wrap items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li 
            key={breadcrumb.path} 
            className={`flex items-center`}
          >
            {breadcrumb.isLast ? (
              <span>{breadcrumb.label}</span>
            ) : (
              <>
                <Link href={breadcrumb.path} className="hover:underline">
                  {breadcrumb.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="ml-2 text-gray-400">{separator}</span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
    <Separator className={'w-full mb-2'} />
    </>
  );
}