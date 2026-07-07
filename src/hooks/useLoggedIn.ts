import { useEffect, useState } from 'react';

export function useLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => setLoggedIn(data.loggedIn));
  }, []);

  return loggedIn;
}
