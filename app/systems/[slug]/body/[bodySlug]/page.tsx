import type { Metadata, ResolvingMetadata } from "next";
import type { SystemBodyResource, SystemBodyRing } from "@/core/interfaces/SystemBody";
import { settings } from "@/core/config";
import { getResource } from "@/core/api";
import { formatDate, formatNumber } from "@/core/string-utils";
import { SystemBodyType } from "@/core/constants/system";
import Link from "next/link";
import Panel from "@/components/panel";
import BodySvg from "./components/body-svg";
import SectionHeader from "@/components/section-header";

interface Props {
  params: { slug: string; bodySlug: string };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { data: body } = await getResource<SystemBodyResource>(`bodies/${params.bodySlug}`);
  return {
    title: `${body.name} | Survey Report | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/systems/${params.slug}/body/${params.bodySlug}`,
      title: `${body.name} | ${(await parent).title?.absolute}`,
      description: `Survey report for ${body.name}: ${body.sub_type} in ${body.system?.name}.`,
    },
    description: `Survey report for ${body.name}: ${body.sub_type} in ${body.system?.name}.`,
  };
}

/* ── Shared sub-components ─────────────────────────────── */

const StatRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b border-neutral-900 py-2">
    <span className="text-xs uppercase tracking-widest text-neutral-600">{label}</span>
    <span className="text-right text-xs uppercase tracking-wider text-neutral-300">{value}</span>
  </div>
);

const Yes = () => <span className="text-green-400">Yes</span>;
const No  = () => <span className="text-red-400/80">No</span>;


/* ── Page ──────────────────────────────────────────────── */

export default async function Page({ params }: Props) {
  const { data: body } = await getResource<SystemBodyResource>(`bodies/${params.bodySlug}`);

  const isStar   = body.type === SystemBodyType.Star || body.sub_type?.includes("Star");
  const bodyIcon = isStar ? "icarus-terminal-star" : "icarus-terminal-planet";

  return (
    <>
      {/* ── Survey Terminal header ── */}
      <div className="fx-chamfer relative mb-5 border border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:SURVEY</span>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">DATABASE:{isStar ? "STELLAR" : "PLANETARY"}</span>
            <span className="hidden md:inline text-neutral-800">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5" />
            <span>SCAN: COMPLETE</span>
          </div>
        </div>
      </div>

      {/* ── Hero panel ── */}
      <div className="fx-chamfer fx-border-breathe fx-panel-scan relative mb-5 border border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter">
        <div className="flex flex-col items-center gap-8 p-8 md:flex-row">

          {/* SVG body */}
          <div className="flex shrink-0 items-center justify-center">
            <BodySvg body={body} size={220} />
          </div>

          {/* Identity */}
          <div className="flex-1 space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
              <Link href="/systems" className="transition-colors hover:text-orange-400">Systems</Link>
              <span>/</span>
              <Link href={`/systems/${params.slug}`} className="transition-colors hover:text-orange-400">
                {body.system?.name}
              </Link>
              <span>/</span>
              <span className="text-neutral-500">{body.name}</span>
            </div>

            {/* Name + type */}
            <div>
              <div className="mb-1 flex items-center gap-3">
                <i className={`${bodyIcon} text-glow__orange`} style={{ fontSize: "2rem" }} />
                <h1 className="fx-glitch text-glow__white text-2xl font-bold uppercase tracking-wide md:text-3xl">
                  {body.name}
                </h1>
              </div>
              <p className="text-glow__orange text-sm font-bold uppercase tracking-widest">
                {body.sub_type}
                {body.terraforming_state === "Candidate for terraforming" && (
                  <span className="ml-3 text-green-400">— Terraforming Candidate</span>
                )}
              </p>
            </div>

            {/* Quick-stats row */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-orange-900/20 pt-4 text-xs uppercase tracking-widest">
              {body.distance_to_arrival ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Dist. to Arrival</p>
                  <p className="font-bold text-neutral-300">{formatNumber(body.distance_to_arrival)} LS</p>
                </div>
              ) : null}
              {body.surface_temp ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Surface Temp</p>
                  <p className="font-bold text-neutral-300">{formatNumber(body.surface_temp)} K</p>
                </div>
              ) : null}
              {body.gravity ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Gravity</p>
                  <p className="font-bold text-neutral-300">{body.gravity.toFixed(2)} G</p>
                </div>
              ) : null}
              {body.earth_masses ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Earth Masses</p>
                  <p className="font-bold text-neutral-300">{body.earth_masses.toFixed(4)}</p>
                </div>
              ) : null}
              {isStar && body.solar_masses ? (
                <div>
                  <p className="mb-0.5 text-neutral-600">Solar Masses</p>
                  <p className="font-bold text-neutral-300">{body.solar_masses}</p>
                </div>
              ) : null}
              {body.is_landable !== undefined && !isStar && (
                <div>
                  <p className="mb-0.5 text-neutral-600">Landable</p>
                  <p className="font-bold">{body.is_landable ? <Yes /> : <No />}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* ── Left column ── */}
        <div className="space-y-5">

          {/* Discovery */}
          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Discovery Record" />
            <StatRow label="Discovered By" value={<span className="text-glow__orange">CMDR {body.discovery?.commander ?? "Unknown"}</span>} />
            <StatRow label="Discovery Date" value={formatDate(body.discovery?.date)} />
          </Panel>

          {/* Star data */}
          {isStar && (
            <Panel variant="muted" className="fx-chamfer p-5">
              <SectionHeader icon="icarus-terminal-star" title="Stellar Data" />
              <StatRow label="Spectral Class"  value={body.spectral_class  ?? "—"} />
              <StatRow label="Luminosity"      value={body.luminosity      ?? "—"} />
              <StatRow label="Solar Masses"    value={body.solar_masses    ?? "—"} />
              <StatRow label="Solar Radius"    value={body.solar_radius != null ? body.solar_radius.toFixed(4) : "—"} />
              <StatRow label="Main Star"       value={body.is_main_star  ? <Yes /> : <No />} />
              <StatRow label="Scoopable"       value={body.is_scoopable  ? <Yes /> : <No />} />
            </Panel>
          )}

          {/* Surface data */}
          {!isStar && (
            <Panel variant="muted" className="fx-chamfer p-5">
              <SectionHeader icon="icarus-terminal-planet" title="Surface Data" />
              <StatRow label="Atmosphere"    value={body.atmosphere_type  || "None"} />
              <StatRow label="Volcanism"     value={body.volcanism_type   || "None"} />
              <StatRow label="Terraforming"  value={
                body.terraforming_state === "Candidate for terraforming"
                  ? <span className="text-green-400">{body.terraforming_state}</span>
                  : <span className="text-neutral-500">{body.terraforming_state ?? "Not Applicable"}</span>
              } />
              <StatRow label="Landable"      value={body.is_landable ? <Yes /> : <No />} />
              <StatRow label="Radius"        value={body.radius != null ? `${formatNumber(body.radius)} KM` : "—"} />
            </Panel>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Orbital mechanics */}
          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-system-orbits" title="Orbital Mechanics" />
            <StatRow label="Orbital Period"    value={body.orbital?.orbital_period     != null ? `${body.orbital.orbital_period.toFixed(4)} D`     : "—"} />
            <StatRow label="Inclination"       value={body.orbital?.orbital_inclination != null ? `${body.orbital.orbital_inclination.toFixed(4)}°` : "—"} />
            <StatRow label="Eccentricity"      value={body.orbital?.orbital_eccentricity != null ? body.orbital.orbital_eccentricity.toFixed(6)     : "—"} />
            <StatRow label="Arg of Periapsis"  value={body.orbital?.arg_of_periapsis    != null ? body.orbital.arg_of_periapsis.toFixed(4)          : "—"} />
            <StatRow label="Semi-Major Axis"   value={body.axial?.semi_major_axis       != null ? body.axial.semi_major_axis.toFixed(6)             : "—"} />
            <StatRow label="Axial Tilt"        value={body.axial?.axial_tilt            != null ? `${body.axial.axial_tilt.toFixed(4)}°`            : "—"} />
            {!isStar && (
              <StatRow label="Tidally Locked"  value={body.axial?.is_tidally_locked ? <Yes /> : <No />} />
            )}
          </Panel>

          {/* Ring system */}
          {body.rings && body.rings.length > 0 && (
            <Panel variant="muted" className="fx-chamfer p-5">
              <SectionHeader icon="icarus-terminal-planet-ringed" title="Ring System" />
              <div className="space-y-4">
                {body.rings.map((ring: SystemBodyRing) => (
                  <div key={ring.name} className="border-b border-neutral-900 pb-4 last:border-0 last:pb-0">
                    <p className="text-glow__orange mb-2 text-xs font-bold uppercase tracking-widest">{ring.name}</p>
                    <StatRow label="Type"         value={ring.type} />
                    <StatRow label="Mass"         value={`${formatNumber(ring.mass)} KG`} />
                    <StatRow label="Inner Radius" value={`${formatNumber(ring.innerRadius)} KM`} />
                    <StatRow label="Outer Radius" value={`${formatNumber(ring.outerRadius)} KM`} />
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-6 border-t border-orange-900/20 pt-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-neutral-700">
          <Link
            href={`/systems/${params.slug}`}
            className="flex items-center gap-2 transition-colors hover:text-orange-400"
          >
            <i className="icarus-terminal-chevron-left text-xs" />
            Back to {body.system?.name}
          </Link>
          <span className="flex items-center gap-2 text-neutral-800">
            <i className="icarus-terminal-scan text-orange-500/20" />
            SURVEY REPORT — {body.name}
          </span>
        </div>
      </div>
    </>
  );
}
