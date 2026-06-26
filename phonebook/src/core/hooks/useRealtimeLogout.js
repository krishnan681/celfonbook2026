import { useEffect } from "react";
import { supabase } from "../config/supabaseClient";

export const useRealtimeLogout = () => {
  useEffect(() => {
    let channel = null;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      channel = supabase
        .channel(`logout-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "s_profiles",
          },
          async (payload) => {
            console.log("DELETE DETECTED:", payload);

            if (payload.old.id === user.id) {
              await supabase.auth.signOut();

              localStorage.clear();
              sessionStorage.clear();

              window.location.replace("/login");
            }
          }
        )
        .subscribe((status) => {
          console.log("Realtime Status:", status);
        });
    };

    init();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);
};