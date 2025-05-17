import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BalanceContext = createContext();

export const BalanceProvider = ({ token, children }) => {
    const [balance, setBalance] = useState(0);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/user/userdata", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userData = res.data;
            setUser(userData);
            setBalance(userData.balance || 0); // assuming response includes balance
        } catch (err) {
            console.error("Failed to fetch user", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token , user]);

    return (
        <BalanceContext.Provider value={{ balance, setBalance, user, setUser, fetchUserData, loading }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalance = () => useContext(BalanceContext);