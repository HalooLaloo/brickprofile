import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile
  const { data: profile } = await supabase
    .from("ps_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get site
  const { data: site } = await supabase
    .from("ps_sites")
    .select("slug, custom_domain")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-dark-400">
          Manage your account and subscription settings.
        </p>
      </div>

      <SettingsForm
        user={{ email: user.email!, id: user.id }}
        profile={profile}
        site={site}
      />
    </div>
  );
}
