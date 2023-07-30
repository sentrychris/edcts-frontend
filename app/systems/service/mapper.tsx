import { SystemBody } from "@/app/interfaces/System";

class CelestialMapper
{
  public bodies: Array<any>
  public stars: Array<any>;
  public planets: Array<any>;

  constructor(bodies: SystemBody[]) {
    this.bodies = bodies;
    this.stars = bodies.filter(c => c.type === 'Star')
    this.planets = bodies.filter(c => c.type === 'Planet')
  }

  mapParents(parents: any) {
    return parents.map((c: any) => {
      let value;

      if (c['Star'] !== undefined) {
        value = c['Star']
      } else if (c['Planet'] !== undefined) {
        value = c['Planet']
      } else if (c['Null'] !== undefined) {
        value = c['Null']
      }
      return value 
    });
  }

  isOrbitingStar(celestial: any) {
    return celestial.parents[0]['Planet'] === undefined
  }

  isOrbitingPlanet(celestial: any) {
    return celestial.parents[0]['Planet'] !== undefined
  }

  getParent(parents: any, celestial: any) {
    return parents.children.find((c: SystemBody) => c.body_id === celestial.parents[0]['Planet'])
  }
}


export const mapSystemHeirarchy = (celestials: SystemBody[]) => {
  const mapped: Record<string, any> = {
    stars: []
  };

  const cm = new CelestialMapper(celestials);

  mapped.stars = cm.stars;

  for (const star of mapped.stars) {
    star.children = [];

    if (cm.planets) {
      for (const celestial of cm.planets) {

        if (cm.mapParents(celestial.parents).includes(star.body_id)
          && cm.isOrbitingStar(celestial)
        ) {
          star.children.push(celestial);
        } else if (cm.isOrbitingPlanet(celestial)) {
          const parentPlanet = cm.getParent(star, celestial);
          if (parentPlanet) {
            if (parentPlanet.children === undefined) {
              parentPlanet.children = [];
            }
            
            parentPlanet.children.push(celestial)
          }
        }
      }
    }
  }

  console.log(mapped);
}