'use client'

import { useContext, createContext, useState, useMemo } from "react"

export const UserAccountsContext = createContext(null);

export function UserAccountsProvider({ accounts, children }) {
    // accounts state
    const [accountList, setAccountList] = useState(accounts)

    //define selected Account
    const [selectedAccount, setSelectedAccount] = useState({})

   // compute admin boolean value from userPermissions state
   const isSuperAdmin = useMemo(() => {
    if (accounts?.is_super_admin) {
        return true;
    }
})

    const contextValue = {
        accountList,
        isSuperAdmin,
        selectedAccount,
        setSelectedAccount
    }

    return (
        <UserAccountsContext.Provider value={contextValue}>
            {children}
        </UserAccountsContext.Provider>
    )
};

export function useAccounts() {
    const context = useContext(UserAccountsContext);

    if (context === null) {
        throw new Error('useAccounts hook can only be used within a UserAccountsContext')
    }
    return context;
};