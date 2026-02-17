import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profile-data";
import { ProfileCard } from "@/components/ProfileCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) return { title: "Not Found" };
  return {
    title: `${profile.displayName} | Link-in-Bio`,
    description: `${profile.displayName}'s links`,
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-16">
      <div className="fixed right-4 top-4 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <ProfileCard profile={profile} />
    </main>
  );
}
