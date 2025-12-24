'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PanelContextType {
    settingsPanelOpen: boolean;
    notificationsPanelOpen: boolean;
    setSettingsPanelOpen: (open: boolean) => void;
    setNotificationsPanelOpen: (open: boolean) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
    const [settingsPanelOpen, setSettingsPanelOpenState] = useState(false);
    const [notificationsPanelOpen, setNotificationsPanelOpenState] = useState(false);

    const setSettingsPanelOpen = (open: boolean) => {
        setSettingsPanelOpenState(open);
        if (open) {
            setNotificationsPanelOpenState(false);
        }
    };

    const setNotificationsPanelOpen = (open: boolean) => {
        setNotificationsPanelOpenState(open);
        if (open) {
            setSettingsPanelOpenState(false);
        }
    };

    return (
        <PanelContext.Provider
            value={{
                settingsPanelOpen,
                notificationsPanelOpen,
                setSettingsPanelOpen,
                setNotificationsPanelOpen,
            }}
        >
            {children}
        </PanelContext.Provider>
    );
}

export function usePanelContext() {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error('usePanelContext must be used within PanelProvider');
    }
    return context;
}
