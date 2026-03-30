import { useNavigate } from "react-router-dom";
import { supabase } from "../../../core/config/supabaseClient";

export default function LogoutButton() {

  const navigate = useNavigate();

  const handleLogout = async () => {

    await supabase.auth.signOut();

    navigate("/");

  };

  return (

    <div
      className="settings-card logout-card"
      onClick={handleLogout}
    >
      <h3>Logout</h3>
      <p>Sign out of your account</p>
    </div>

  );
}