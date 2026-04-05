"use client";

import type { FunctionComponent } from "react";
import type { SystemDispatcher } from "@/core/events/SystemDispatcher";
import type { SystemBodyRing, MappedSystemBody } from "@/core/interfaces/SystemBody";
import type SystemMap from "../../lib/system-map";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { SystemBodyType } from "@/core/constants/system";
import { formatDate, formatNumber } from "@/core/string-utils";
import Link from "next/link";

interface Props {
  body: MappedSystemBody | null;
  system: SystemMap;
  dispatcher: SystemDispatcher;
  close?: () => void;
}

const SystemBodyPopover: FunctionComponent<Props> = ({ body, system, dispatcher, close }) => {
  return (
    <div
      className="system-body-information__container galaxy-background fx-animated-text h-full max-h-screen w-full border-l border-orange-500/60 text-xs uppercase tracking-wider"
      style={{
        paddingTop: "60px",
      }}
    >
      {body && (
        <>
          <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-sky-900/50 via-black/20 to-black/20 backdrop-blur backdrop-filter">
            <div className="system-body-information__container--header px-3 py-2.5 text-sm font-bold">
              <h2 className="text mt-1">Cartographical Data</h2>
              <XMarkIcon
                className="hover:text-glow__orange hover:scale-125 hover:cursor-pointer"
                onClick={close}
                height={20}
                width={20}
              />
            </div>

            <div className="px-3">
              <div className="mb-3 mt-4 grid grid-cols-1 text-lg md:grid-cols-1">
                <p className="mb-1 flex items-center gap-x-2 border-b border-orange-900/20 pb-2 text-glow">
                  <i className="icarus-terminal-system-bodies text-glow__orange"></i>
                  <Link href={`/systems/system/${system.detail.slug}/body/${body.slug}`} className="hover:underline">
                    {body.name}
                  </Link>
                </p>

                {body._children && (
                  <p
                    className="text-glow__orange text-sm hover:cursor-pointer hover:underline pt-2"
                    onClick={() => {
                      dispatcher.selectBody({
                        body,
                        type: "select-body",
                      });
                      if (close) close();
                    }}
                  >
                    {body._children.length} orbital bodies
                  </p>
                )}
              </div>

              <p className="flex flex-col gap-x-2 border-b border-orange-900/20 pb-5 text-sm">
                <span className="mb-1">
                  Discovered by <span className="text-glow__orange">CMDR {body.discovered_by}</span>
                </span>
                <span className="text-xs">on {formatDate(body.discovered_at)}</span>
              </p>

              <p className="my-4 flex items-center gap-x-2 text-sm">
                <i
                  className={
                    "text-glow__orange icarus-terminal-" +
                    (body.type === SystemBodyType.Star ? "star" : "planet")
                  }
                ></i>
                <span>Body Information</span>
              </p>
              <p className={"mb-1 flex items-center gap-x-2"}>
                <span>{body.type}</span> - <span>{body.sub_type}</span>
              </p>

              {body.type === SystemBodyType.Star && (
                <div className="border-b border-orange-900/20 pb-4 text-xs">
                  <div className="flex items-center gap-2 pb-2.5">
                    <p>
                      Class: <span className="ms-1">{body.spectral_class}</span>
                    </p>
                    <p>({body.luminosity} luminosity)</p>
                  </div>
                  <p className="mb-1">
                    Is Main Star:{" "}
                    {body.is_main_star ? (
                      <span className="ms-1 text-green-300">Yes</span>
                    ) : (
                      <span className="ms-1 text-red-300">No</span>
                    )}
                  </p>
                  <p className="mb-2.5">
                    Is scoopable:{" "}
                    {body.is_scoopable ? (
                      <span className="ms-1 text-green-300">Yes</span>
                    ) : (
                      <span className="ms-1 text-red-300">No</span>
                    )}
                  </p>
                  <p className="mb-1">Solar masses: {body.solar_masses}</p>
                  <p>Solar radius: {body.solar_radius?.toFixed(6)}</p>
                </div>
              )}

              {body.type === SystemBodyType.Planet && (
                <>
                  <p className="pb-2.5">
                    Distance to Main Star:{" "}
                    <span className="ms-1">
                      {formatNumber(body.distance_to_arrival as number)} LS
                    </span>
                  </p>
                  <p className={"mb-1 flex items-center gap-x-2 text-xs"}>
                    <span>Is Landable:</span>{" "}
                    <span>
                      {body.is_landable ? (
                        <span className="text-green-300">Yes</span>
                      ) : (
                        <span className="text-red-300">No</span>
                      )}
                    </span>
                  </p>
                  <p className={"mb-1 flex items-center gap-x-2 text-xs"}>
                    <span>Gravity:</span> <span>{body.gravity?.toFixed(2)}</span>
                  </p>
                  <p className={"mb-2.5 flex items-center gap-x-2 text-xs"}>
                    <span>Surface temp:</span>{" "}
                    <span>{`${formatNumber(body.surface_temp as number)} K`}</span>
                  </p>

                  <p className={"mb-1 flex items-center gap-x-2 text-xs"}>
                    <span>Atmosphere:</span> <span>{body.atmosphere_type ?? "No Data"}</span>
                  </p>
                  <p className={"mb-2.5 flex items-center gap-x-2 text-xs"}>
                    <span>Volcanism:</span> <span>{body.volcanism_type ?? "No Data"}</span>
                  </p>

                  <p className="border-b border-orange-900/20 pb-5">
                    <span
                      className={
                        body.terraforming_state === "Candidate for terraforming"
                          ? "text-green-300"
                          : "text-red-300"
                      }
                    >
                      {body.terraforming_state}
                    </span>
                  </p>

                  {body._planetary_bases && body._planetary_bases.length > 0 && (
                    <>
                      <p className="mb-2 mt-4 flex items-center gap-x-2 text-sm">
                        <i className={"text-glow__orange icarus-terminal-settlement"}></i>
                        <span>Planetary Settlements</span>
                      </p>
                      <div className="grid grid-cols-2 border-b border-orange-900/20 pb-5">
                        {body._planetary_bases.map((s, i) => {
                          return (
                            <div key={s.id} className={i > 1 ? "mt-5" : "mt-2.5"}>
                              <p className="text-glow__blue">{s.name}</p>
                              <div className="text-label__small mt-1">
                                <p>{s.economy} economy</p>
                              </div>
                              <div className="mt-1 flex flex-row flex-wrap gap-x-2">
                                {s.has_market && (
                                  <div className="flex items-center gap-x-1">
                                    <CheckIcon className="text-glow__orange w-3" />
                                    <label className="text-label__small">Market</label>
                                  </div>
                                )}

                                {s.has_outfitting && (
                                  <div className="flex items-center gap-x-1">
                                    <CheckIcon className="text-glow__orange w-3" />
                                    <label className="text-label__small">Outfitting</label>
                                  </div>
                                )}

                                {s.has_shipyard && (
                                  <div className="flex items-center gap-x-1">
                                    <CheckIcon className="text-glow__orange w-3" />
                                    <label className="text-label__small">Shipyard</label>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="my-4 grid grid-cols-2 gap-y-4 border-b border-orange-900/20 pb-4">
                <div>
                  <p className="flex items-center gap-x-2 text-sm">
                    <i className="icarus-terminal-planet text-glow__orange"></i>
                    <span>Orbital Information</span>
                  </p>
                  <div className="mt-4">
                    <p className="mb-1">
                      Period:{" "}
                      <span className="ms-1">{body.orbital_period?.toFixed(6) ?? "No Data"}</span>
                    </p>
                    <p className="mb-1">
                      Inclination:{" "}
                      <span className="ms-1">
                        {body.orbital_inclination?.toFixed(6) ?? "No Data"}
                      </span>
                    </p>
                    <p>
                      Eccentricity:{" "}
                      <span className="ms-1">
                        {body.orbital_eccentricity?.toFixed(6) ?? "No Data"}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="flex items-center gap-x-2 text-sm">
                    <i className="icarus-terminal-planet text-glow__orange"></i>
                    <span>Axial Information</span>
                  </p>
                  <div className="mt-4">
                    <p className="mb-1">
                      Axial tilt: <span className="ms-1">{body.axial_tilt?.toFixed(6) ?? 0}</span>
                    </p>
                    <p className="mb-1">
                      Semi-major axis:{" "}
                      <span className="ms-1">{body.semi_major_axis?.toFixed(6) ?? 0}</span>
                    </p>
                    <p>
                      Arg of periapsis:{" "}
                      <span className="ms-1">{body.arg_of_periapsis?.toFixed(6) ?? 0}</span>
                    </p>
                    {body.type === SystemBodyType.Planet && (
                      <p className="mt-1">
                        Tidally locked:{" "}
                        <span>
                          {body.is_tidally_locked ? (
                            <span className="ms-1 text-green-300">Yes</span>
                          ) : (
                            <span className="ms-1 text-red-300">No</span>
                          )}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {body.rings && body.rings.length > 0 && (
                <div className="mt-2.5 flex items-center gap-x-20 border-b border-orange-900/20 pb-2.5">
                  <div>
                    <p className="flex items-center gap-x-2 text-sm">
                      <i className="icarus-terminal-planet-ringed text-glow__orange"></i>
                      <span>Ring Information</span>
                    </p>
                    <div className="mt-2">
                      {body.rings.map((ring: SystemBodyRing) => {
                        return (
                          <div key={ring.mass} className="my-4">
                            <p className="text-glow__orange mb-1">{ring.name}</p>
                            <p>Type: {ring.type}</p>
                            <p>Mass: {formatNumber(ring.mass)} KG</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemBodyPopover;
