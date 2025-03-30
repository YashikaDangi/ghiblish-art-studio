// src/lib/api-utils.ts

/**
 * Utility function to make authenticated API requests
 * Handles redirecting to home when authentication fails
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Always include cookies
      });
  
      if (response.status === 401) {
        // If unauthorized, redirect to home page
        window.location.href = '/?error=session-expired';
        throw new Error('Session expired. Please complete payment first.');
      }
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  
  /**
   * Function to check if the user has an active payment session
   */
  export async function checkPaymentSession() {
    try {
      const response = await fetch('/api/check-payment-session', {
        method: 'GET',
        credentials: 'include',
      });
  
      return response.status === 200;
    } catch (error) {
      console.error('Error checking payment session:', error);
      return false;
    }
  }