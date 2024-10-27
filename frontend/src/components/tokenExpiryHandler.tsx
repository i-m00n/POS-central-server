import  { useEffect, useState } from 'react';

interface tokenProp{
  onLogout():void
}
const TokenExpiryHandler = ({onLogout}:tokenProp) => {
  const [remainingTime, setRemainingTime] = useState<number>(() => {
    const storedTime = localStorage.getItem("expiryTime");
    const storedTimestamp = localStorage.getItem("expiryTimestamp");
    
    // If no timestamp exists but we have expiryTime, create timestamp
    if (!storedTimestamp && storedTime) {
      const newExpiryTimestamp = Date.now() + JSON.parse(storedTime) * 1000;
      localStorage.setItem("expiryTimestamp", newExpiryTimestamp.toString());
    }
    
    // Calculate remaining time based on stored timestamp
    if (storedTimestamp) {
      const remaining = Math.round((parseInt(storedTimestamp) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    
    return JSON.parse(storedTime ?? "0");
  });

  useEffect(() => {
    if (remainingTime <= 0) {
      localStorage.removeItem("expiryTimestamp");
      localStorage.removeItem("expiryTime");
      onLogout();
      return;
    }

    // Show warning 5 minutes before expiration
    const warningTimeout = setTimeout(() => {
      if (remainingTime === 300) {
        alert("تبقي من الزمن 5 دقائق");
      }
    }, (remainingTime - 60) * 1000);

    // Logout on expiry
    const logoutTimeout = setTimeout(() => {
      localStorage.removeItem("expiryTimestamp");
      localStorage.removeItem("expiryTime");
      onLogout();
    }, remainingTime * 1000);

    // Update remaining time every second
    const interval = setInterval(() => {
      const storedTimestamp = localStorage.getItem("expiryTimestamp");
      if (storedTimestamp) {
        const newRemainingTime = Math.round((parseInt(storedTimestamp) - Date.now()) / 1000);
        setRemainingTime(newRemainingTime > 0 ? newRemainingTime : 0);
        // Update expiryTime in localStorage to maintain compatibility
        localStorage.setItem("expiryTime", JSON.stringify(newRemainingTime));
      } else {
        setRemainingTime(prev => prev - 1);
      }
      console.log(remainingTime);
    }, 1000);

    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(logoutTimeout);
      clearInterval(interval);
    };
  }, [remainingTime, onLogout]);

  return (
    <div>
    </div>
  );
};

export default TokenExpiryHandler;