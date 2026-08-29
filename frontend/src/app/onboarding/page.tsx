"use client";

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { updateMyProfile, ApiError } from "@/lib/api";
import { TopNavBar } from "@/components/TopNavBar";

const SUGGESTED_SKILLS = ["Design", "Development", "Marketing", "Product Management", "Data Analysis"];

export default function OnboardingPage() {
  const { user, token, loading, refreshUser } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !token) router.replace("/login");
  }, [loading, token, router]);

  function toggleSkill(skill: string) {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      toggleSkill(skillInput.trim());
      setSkillInput("");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setSubmitting(true);
    try {
      await updateMyProfile(token, {
        title: title || undefined,
        location: location || undefined,
        bio: bio || undefined,
        skills,
        avatar_url: avatarUrl || undefined,
        banner_url: bannerUrl || undefined,
      });
      await refreshUser();
      router.push(user ? `/profile/${user.id}` : "/discover");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ha ocurrido un error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !token) return null;

  return (
    <>
      <TopNavBar />
      <main className="flex-1 pt-16 md:pt-24 pb-16 px-4 md:px-16 max-w-3xl w-full mx-auto">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <div className="w-full h-32 md:h-48 bg-surface-container flex flex-col items-center justify-center border-b border-outline-variant">
            <span className="material-symbols-outlined text-outline text-4xl mb-2">add_photo_alternate</span>
            <span className="text-label-md text-on-surface-variant">Banner (URL) — file upload arrives in Phase 2 with S3</span>
          </div>
          <div className="p-6 pt-0 relative">
            <div className="absolute -top-12 md:-top-16 left-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-surface-container-lowest bg-surface-container flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-outline text-3xl">person_add</span>
              </div>
            </div>
            <div className="pt-16 md:pt-20 mt-3">
              <h1 className="text-headline-lg text-on-background mb-2">Complete Your Profile</h1>
              <p className="text-body-md text-on-surface-variant mb-6">
                Let your professional network know who you are and what you excel at.
              </p>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface" htmlFor="title">
                      Professional Title
                    </label>
                    <input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-body-md text-on-surface"
                      placeholder="Senior UX Designer"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface" htmlFor="location">
                      Location
                    </label>
                    <input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-body-md text-on-surface"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface" htmlFor="bio">
                    Short Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    maxLength={300}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-body-md text-on-surface resize-y"
                    placeholder="Briefly describe your professional background and goals..."
                  />
                  <div className="text-right text-label-sm text-on-surface-variant">{bio.length} / 300</div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface">Core Skills</label>
                  <p className="text-label-sm text-on-surface-variant mb-1">
                    Select areas of expertise to help collaborators find you.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set([...SUGGESTED_SKILLS, ...skills])).map((skill) => {
                      const selected = skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1 rounded text-label-md transition-colors ${
                            selected
                              ? "bg-primary-container text-on-primary-container"
                              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="+ Add skill"
                      className="px-3 py-1 border border-outline-variant rounded bg-surface-container-lowest text-label-md text-on-surface w-32 h-[28px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface" htmlFor="avatarUrl">
                      Avatar URL (optional)
                    </label>
                    <input
                      id="avatarUrl"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-body-md text-on-surface"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface" htmlFor="bannerUrl">
                      Banner URL (optional)
                    </label>
                    <input
                      id="bannerUrl"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      className="px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-body-md text-on-surface"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {error && <p className="text-label-md text-error">{error}</p>}

                <div className="pt-6 border-t border-outline-variant flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-primary text-on-primary rounded text-label-md font-medium hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60"
                  >
                    Complete Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
