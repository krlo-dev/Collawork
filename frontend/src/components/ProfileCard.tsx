import Link from "next/link";
import type { User } from "@/lib/types";
import { SkillChip } from "@/components/SkillChip";

export function ProfileCard({ user }: { user: User }) {
  return (
    <div className="h-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all flex flex-col group">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-surface-container-high bg-surface-container flex items-center justify-center text-headline-md text-on-surface-variant shrink-0">
          {user.profile_media?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.profile_media.avatar_url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
            {user.name}
          </h3>
          {user.title && <p className="text-label-md text-on-surface-variant">{user.title}</p>}
          {user.location && (
            <p className="text-label-sm text-outline flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]!">location_on</span>
              {user.location}
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 mb-3">
        {user.bio && <p className="text-body-md text-on-surface-variant line-clamp-2">{user.bio}</p>}
      </div>
      {user.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {user.skills.slice(0, 3).map((skill) => (
            <SkillChip key={skill} label={skill} />
          ))}
        </div>
      )}
      <Link
        href={`/profile/${user.id}`}
        className="w-full py-2 border border-outline-variant text-on-surface text-label-md text-center rounded hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
      >
        View Profile
      </Link>
    </div>
  );
}
