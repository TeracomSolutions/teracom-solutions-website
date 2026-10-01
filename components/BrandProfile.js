import Image from 'next/image';

// The longer brand page, built from a profile in lib/brandProfiles: the
// manufacturer's platforms, what its analytics do, the range, how a system
// fits together and Teracom's part in it. The graphics are drawings of what
// the technology does, not product photos.
export default function BrandProfile({ brand, profile }) {
  return (
    <>
      {profile.stats && (
        <section className="brand-profile-stats-band">
          <div className="container brand-profile-stats">
            {profile.stats.map((stat) => (
              <div className="brand-profile-stat" key={stat.label}>
                <span className="brand-profile-stat-value">{stat.value}</span>
                <span className="brand-profile-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.platforms && (
        <section className="section section-spacious">
          <div className="container">
            <div className="section-heading left brand-profile-heading">
              <span className="eyebrow">{profile.platformsEyebrow}</span>
              <h2>{profile.platformsHeading}</h2>
              {profile.platformsIntro && <p>{profile.platformsIntro}</p>}
            </div>
            <div className="brand-profile-platforms">
              {profile.platforms.map((platform) => (
                <article className="brand-profile-card brand-profile-platform" key={platform.name}>
                  <Image className="brand-profile-art" src={platform.image} alt={platform.imageAlt} width={600} height={320} />
                  <div className="brand-profile-card-body">
                    <span className="brand-profile-kicker">{platform.kicker}</span>
                    <h3>{platform.name}</h3>
                    <p>{platform.body}</p>
                    <ul className="brand-profile-points">
                      {platform.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {profile.capabilities && (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left brand-profile-heading">
              <span className="eyebrow">{profile.capabilitiesEyebrow}</span>
              <h2>{profile.capabilitiesHeading}</h2>
              {profile.capabilitiesIntro && <p>{profile.capabilitiesIntro}</p>}
            </div>
            <div className="brand-profile-capabilities">
              {profile.capabilities.map((capability) => (
                <article className="brand-profile-card" key={capability.title}>
                  <Image className="brand-profile-art" src={capability.image} alt={capability.imageAlt} width={600} height={360} />
                  <div className="brand-profile-card-body">
                    <h3>{capability.title}</h3>
                    <p>{capability.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {profile.range && (
        <section className="section section-spacious">
          <div className="container">
            <div className="section-heading left brand-profile-heading">
              <span className="eyebrow">{profile.rangeEyebrow}</span>
              <h2>{profile.rangeHeading}</h2>
            </div>
            <div className="brand-profile-range">
              {profile.range.map((group) => (
                <article className="brand-profile-card brand-profile-range-card" key={group.title}>
                  <h3>{group.title}</h3>
                  <ul className="brand-profile-points">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {profile.architectureImage && (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left brand-profile-heading">
              <span className="eyebrow">{profile.architectureEyebrow}</span>
              <h2>{profile.architectureHeading}</h2>
            </div>
            <Image
              className="brand-profile-art brand-profile-architecture"
              src={profile.architectureImage}
              alt={profile.architectureAlt}
              width={1200}
              height={560}
            />
            {profile.architectureCaption && <p className="brand-profile-caption">{profile.architectureCaption}</p>}
          </div>
        </section>
      )}

      {(profile.industries || profile.teracom) && (
        <section className="section section-spacious">
          <div className="container">
            {profile.industries && (
              <div className="brand-profile-industries">
                <h2>{profile.industriesHeading}</h2>
                <ul>
                  {profile.industries.map((industry) => (
                    <li key={industry}>{industry}</li>
                  ))}
                </ul>
              </div>
            )}
            {profile.teracom && (
              <>
                <div className="section-heading left brand-profile-heading">
                  <span className="eyebrow">Teracom and {brand.name}</span>
                  <h2>{profile.teracomHeading}</h2>
                </div>
                <ol className="brand-profile-steps">
                  {profile.teracom.map((step) => (
                    <li key={step.title}>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {profile.links && (
              <p className="brand-profile-links">
                From {brand.name}:{' '}
                {profile.links.map((link, index) => (
                  <span key={link.href}>
                    {index > 0 ? ' · ' : ''}
                    <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                  </span>
                ))}
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}