import { useEffect } from "react";

export const useSyncUserAfterSubscription = (setUser: (user: any) => void) => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const subscribed = url.searchParams.get("subscribed");

    if (subscribed === "true") {
      const token = localStorage.getItem("token");
      if (!token) return;

      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:8000/api/me/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error("Не вдалось оновити користувача");

          const user = await res.json();
          localStorage.setItem("currentUser", JSON.stringify(user));
          setUser(user);

          url.searchParams.delete("subscribed");
          window.history.replaceState({}, "", url.toString());
        } catch (err) {
          console.error("❌ Помилка при оновленні користувача після підписки", err);
        }
      };

      fetchUser();
    }
  }, [setUser]);
};
