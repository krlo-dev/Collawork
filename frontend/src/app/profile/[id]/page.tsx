import { notFound } from "next/navigation";
import { getPublicProfile, ApiError } from "@/lib/api";
import { TopNavBar } from "@/components/TopNavBar";
import { SkillChip } from "@/components/SkillChip";
import { ContactButton } from "@/components/ContactButton";

export default async function PublicProfilePage(props: PageProps<"/profile/[id]">) {
  const { id } = await props.params;

  const user = await getPublicProfile(id).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });

  if (!user) notFound();

  return (
    <>
      <TopNavBar />
      <main className="flex-1 pt-16 pb-16">
        <div className="w-full h-48 md:h-64 relative bg-surface-container-low overflow-hidden">
          {user.profile_media?.banner_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.profile_media.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-16 relative">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl -mt-16 md:-mt-20 relative z-10 p-6 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 pb-6 border-b border-surface-variant">
              <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-surface-variant shrink-0 -mt-14 md:-mt-20 shadow-md flex items-center justify-center text-headline-lg text-on-surface-variant">
                {user.profile_media?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.profile_media.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-grow pt-4 md:pt-0">
                <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">{user.name}</h1>
                {user.title && <p className="text-body-lg text-on-surface-variant mb-1">{user.title}</p>}
                {user.location && (
                  <div className="flex items-center text-label-md text-outline gap-1">
                    <span className="material-symbols-outlined text-[18px]!">location_on</span>
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
              <div className="w-full md:w-auto pt-3 md:pt-0 shrink-0">
                <ContactButton email={user.email} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2 space-y-6">
                {user.bio && (
                  <section>
                    <h2 className="text-headline-md text-on-surface mb-3">About</h2>
                    <p className="text-body-md text-on-surface-variant leading-relaxed">{user.bio}</p>
                  </section>
                )}
              </div>
              {user.skills.length > 0 && (
                <div className="space-y-6">
                  <section className="bg-surface-container-low p-3 rounded-lg border border-surface-variant">
                    <h2 className="text-headline-md text-on-surface mb-3">Core Competencies</h2>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <SkillChip key={skill} label={skill} />
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
