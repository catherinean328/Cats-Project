'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types';

// Custom hook for managing user session
export const useUser = (role?: 'listener' | 'venter') => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create or retrieve user session
    const initializeUser = () => {
      try {
        // Check if user already exists in session storage
        const existingUser = sessionStorage.getItem('ventishh_user');
        
        if (existingUser) {
          const parsedUser = JSON.parse(existingUser);
          // Update role if provided
          if (role && parsedUser.role !== role) {
            parsedUser.role = role;
            sessionStorage.setItem('ventishh_user', JSON.stringify(parsedUser));
          }
          setUser(parsedUser);
        } else if (role) {
          // Create new user
          const newUser: User = {
            id: uuidv4(),
            role,
            isOnline: true,
            createdAt: new Date(),
          };
          
          sessionStorage.setItem('ventishh_user', JSON.stringify(newUser));
          setUser(newUser);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        
        // Fallback: create new user if role is provided
        if (role) {
          const fallbackUser: User = {
            id: uuidv4(),
            role,
            isOnline: true,
            createdAt: new Date(),
          };
          setUser(fallbackUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [role]);

  // Update user status
  const updateUserStatus = (isOnline: boolean) => {
    if (user) {
      const updatedUser = { ...user, isOnline };
      setUser(updatedUser);
      
      try {
        sessionStorage.setItem('ventishh_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  };

  // Update user telegram username
  const updateUserTelegramUsername = (telegramUsername: string) => {
    if (user) {
      const updatedUser = { ...user, telegramUsername };
      setUser(updatedUser);
      
      try {
        sessionStorage.setItem('ventishh_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user telegram username:', error);
      }
    }
  };

  // Clear user session
  const clearUser = () => {
    setUser(null);
    try {
      sessionStorage.removeItem('ventishh_user');
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  };

  return {
    user,
    isLoading,
    updateUserStatus,
    updateUserTelegramUsername,
    clearUser,
  };
};