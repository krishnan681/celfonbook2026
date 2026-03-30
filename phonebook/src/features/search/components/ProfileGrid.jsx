import ProfileCard from "./ProfileCard";

const ProfileGrid = ({ profiles, isKeywordFocused }) => {
  return (
    <div className="profile-grid">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isKeywordFocused={isKeywordFocused}
        />
      ))}
    </div>
  );
};

export default ProfileGrid;
