import { FunctionComponent, memo } from 'react';

const SvgFilters: FunctionComponent = () =>{
  return (
    <div dangerouslySetInnerHTML={{__html: `
      <svg style="position: absolute; height: 0; margin: 0; padding: 0; top: -100px;">
        <defs>
          <!-- For planet icons in system map -->
          <clipPath id="svg-clip-path__planet">
            <rect x="400" y="0" width="500" height="1000" />
          </clipPath>

          
          <!-- Unknown system objects (eg stations, megaships)-->
          <linearGradient id="svg-gradient__unknown">
            <stop offset="0%" stop-color="#ccc" />
            <stop offset="100%" stop-color="#aaa" />
          </linearGradient>
          

          <!-- Planets -->
          <linearGradient id="system-map-svg-gradient__planet-ring" gradientTransform="rotate(90)" gradientUnits="userSpaceOnUse">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet" gradientTransform="rotate(10)">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--gas-giant">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--gas-giant-ammonia">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--rocky">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--rocky-icy">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--icy">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--high-metal">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--metal-rich">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--earth-like">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <linearGradient id="system-map-svg-gradient__planet--landable">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
          <radialGradient id="system-map-svg-gradient__planet--atmosphere--radial">
            <stop offset="25%" />
            <stop offset="50%" />
            <stop offset="100%" />
          </radialGradient>
          <linearGradient id="system-map-svg-gradient__planet--atmosphere" gradientTransform="rotate(10)">
            <stop offset="50%" />
            <stop offset="100%" />
          </linearGradient>

          <!-- Shadows on planets  -->
          <filter id="svg-filter__planet-shadow">
            <feOffset dx="-500" dy="-500"/>
            <feGaussianBlur stdDeviation="200" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood flood-color="black" flood-opacity="1" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComponentTransfer in="shadow" result="shadow"><feFuncA type="linear" slope=".7"/></feComponentTransfer>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          <filter id="svg-filter__planet-shadow--small">
            <feOffset dx="-200" dy="-200"/>
            <feGaussianBlur stdDeviation="100" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood flood-color="black" flood-opacity="1" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComponentTransfer in="shadow" result="shadow"><feFuncA type="linear" slope=".7"/></feComponentTransfer>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          <filter id="svg-filter__star-glow">
            <feMorphology id="morph" operator="dilate" radius="2000" />
            <feOffset dx="0" dy="0"/>
            <feGaussianBlur stdDeviation="500" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood flood-color="rgba(255,0,0,.5)" flood-opacity="1" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComponentTransfer in="shadow" result="shadow"><feFuncA type="linear" slope="1"/></feComponentTransfer>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          <filter id="svg-filter__star-glow--light">
            <feMorphology id="morph" operator="dilate" radius="2000" />
            <feOffset dx="0" dy="0"/>
            <feGaussianBlur stdDeviation="500" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood flood-color="rgba(255,0,0,.25)" flood-opacity="1" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComponentTransfer in="shadow" result="shadow"><feFuncA type="linear" slope="1"/></feComponentTransfer>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          <animate 
            xlink:href="#morph"
            id="anim-dialiate" 
            attributeName="radius"
            from="40"
            to="0"
            dur="3s"
            fill="freeze"
          />
        </defs>
      </svg>
      <script>
        document.write(\`
          <svg style="position: absolute; height: 0; margin: 0; padding: 0; top: -100px;">
            <defs>
              <pattern id="svg-pattern__star-surface" patternUnits="userSpaceOnUse" preserveAspectRatio="none" width="4096" height="4096">
                <image href="/images/textures/star.jpg" x="0" y="0" width="4096" height="4096"/>
                <animate attributeName="x" values="0;4096" dur="30s" repeatCount="indefinite"/>
              </pattern>
              <pattern id="svg-pattern__planet-surface" patternUnits="userSpaceOnUse" preserveAspectRatio="none" width="4096" height="4096">
                <image href="/images/textures/rock.jpg" x="0" y="0" width="4096" height="4096"/>
                <animate attributeName="x" values="0;4096" dur="30s" repeatCount="indefinite"/>
              </pattern>
              <pattern id="svg-pattern__planet-surface-animated" x="0" patternUnits="userSpaceOnUse" preserveAspectRatio="none" width="4096" height="4096">
                <image href="/images/textures/rock.jpg" x="0" y="0" width="4096" height="4096"/>
                <animate attributeName="x" values="0;4096" dur="30s" repeatCount="indefinite"/>
              </pattern>
              <pattern id="svg-pattern__planet-surface--clouds" patternUnits="userSpaceOnUse" preserveAspectRatio="none" width="4096" height="4096">
                <image href="/images/textures/clouds.jpg" x="0" y="0" width="4096" height="4096"/>
                <animate attributeName="x" values="0;4096" dur="30s" repeatCount="indefinite"/>
              </pattern>
              <pattern id="svg-pattern__planet-surface--gas-giant" patternUnits="userSpaceOnUse" preserveAspectRatio="none" width="4096" height="4096">
                <image href="/images/textures/gas-giant.jpg" x="0" y="0" width="4096" height="4096"/>
                <animate attributeName="x" values="0;4096" dur="15s" repeatCount="indefinite"/>
              </pattern>
              <pattern id="svg-pattern__planet-surface--brown-dwarf" patternUnits="userSpaceOnUse" preserveAspectRatio="none" width="8192" height="8192">
                <image href="/images/textures/gas-giant.jpg" x="0" y="0" width="8192" height="8192"/>
              </pattern>
            </defs>
          </svg>
          <style>
            .system-map__system-object[data-system-object-type="Star"] .system-map__planet-surface {
              fill: url(#svg-pattern__star-surface) !important;
            }
            
            .system-map__system-object[data-system-object-type="Star"][data-system-object-sub-type*="Brown dwarf" i] .system-map__planet-surface {
              fill: url(#svg-pattern__planet-surface--brown-dwarf) !important;
            }
          </style>
        \`)
      </script>`}}
    />
  );
};

export default memo(SvgFilters);