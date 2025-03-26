'use client'

import { useContext, createContext, useState, useMemo } from "react"

export const UserPermissionsContext = createContext(null);

export function UserPermissionsProvider({ permissions, children }) {
    // define permissions model state
    const [userPermissions, setUserPermissions] = useState(permissions)

   // compute admin boolean value from userPermissions state
   const isAdmin = useMemo(() => {
    if (userPermissions?.is_super_admin) {
        return true;
    }
    
    // Check if user_roles exists and has items
    if (!userPermissions?.user_roles || !userPermissions.user_roles.length) {
        return false;
    }
    
    // Check role structure and look for admin
    const roles = userPermissions.user_roles.flatMap(userRole => 
        userRole.roles ? (Array.isArray(userRole.roles) ? userRole.roles : [userRole.roles]) : []
    );
    
    return roles.some(role => role?.name === 'admin');
}, [userPermissions]);


    const contextValue = {
        userPermissions,
        isAdmin
    }

    return (
        <UserPermissionsContext.Provider value={contextValue}>
            {children}
        </UserPermissionsContext.Provider>
    )
};

export function useUserPermissions() {
    const context = useContext(UserPermissionsContext);

    if (context === null) {
        throw new Error('useUserRoles hook can only be used within a UserPermissionsContext')
    }
    return context;
};