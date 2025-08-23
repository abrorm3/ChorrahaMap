import {Component, OnInit} from '@angular/core';
declare const ymaps3: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public map: any;

  async ngOnInit() {
    await ymaps3.ready;

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = ymaps3;

    this.map = new YMap(
      document.getElementById('map'),
      {
        location: {
          center: [69.19804206828779, 41.27878057521565],
          zoom: 18
        },
        camera: {
          tilt: 45,
          azimuth: 0
        }
      }
    );

    this.map.addChild(new YMapDefaultSchemeLayer({
      theme: 'dark'
    }));
    this.map.addChild(new YMapDefaultFeaturesLayer());

    this.addGlowingRoutes();
  }

  private createGlowingLine(coordinates: number[][], glowColor: string) {
    const lines = [];
    const v3Coords = coordinates.map(coord => [coord[1], coord[0]]);

    lines.push(new ymaps3.YMapFeature({
      geometry: {
        type: 'LineString',
        coordinates: v3Coords
      },
      style: {
        stroke: [{
          color: glowColor,
          width: 23,
          opacity: 0.1
        }]
      }
    }));

    lines.push(new ymaps3.YMapFeature({
      geometry: {
        type: 'LineString',
        coordinates: v3Coords
      },
      style: {
        stroke: [{
          color: glowColor,
          width: 15,
          opacity: 0.2
        }]
      }
    }));
    lines.push(new ymaps3.YMapFeature({
      geometry: {
        type: 'LineString',
        coordinates: v3Coords
      },
      style: {
        stroke: [{
          color: glowColor,
          width: 8,
          opacity: 0.3
        }]
      }
    }));
    lines.push(new ymaps3.YMapFeature({
      geometry: {
        type: 'LineString',
        coordinates: v3Coords
      },
      style: {
        stroke: [{
          color: '#ffffff',
          width: 2,
          opacity: 1,
          dash: [18, 6]
        }]
      }
    }));

    return lines;
  }

  private createVerticalLightBeam(centerCoord: number[], color: string) {
    const beams: any[] = [];
    const center = [centerCoord[1], centerCoord[0]];

    const baseRadius = 0.00003;
    const beamHeight = 0.0009;
    const numSegments = 300;

    for (let i = 0; i < numSegments; i++) {
      const angle1 = (i * 2 * Math.PI) / numSegments;

      const base1 = [
        center[0] + baseRadius * Math.cos(angle1),
        center[1] + baseRadius * Math.sin(angle1)
      ];

      const perspectiveShift = beamHeight * Math.cos(Math.PI / 4);
      const topRadius = baseRadius * 0.2;

      const top1 = [
        center[0] + topRadius * Math.cos(angle1),
        center[1] + topRadius * Math.sin(angle1) + perspectiveShift
      ];

      beams.push(new ymaps3.YMapFeature({
        geometry: {
          type: 'Polygon',
          coordinates: [[base1, top1]]
        },
        style: {
          fill: color,
          fillOpacity: 0.6,
          stroke: [{
            color: color,
            width: 0.5,
            opacity: 0.8
          }]
        }
      }));
    }

    return beams;
  }

  private createNumberBalloon(centerCoord: number[], number: string) {
    const center = [centerCoord[1], centerCoord[0]];

    const balloonElement = document.createElement('div');
    balloonElement.style.cssText = `
      background: rgb(24, 140, 54);
      color: white;
      font-weight: bold;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 5px;
      z-index: 1000;
    `;
    balloonElement.textContent = number;


    return new ymaps3.YMapMarker({
      coordinates: center,
      draggable: false
    }, balloonElement);
  }

  private addGlowingRoutes() {
    const route1Coords = [
      [41.279357700993714, 69.19728197861224],
      [41.278367805371715, 69.19893256168073],
    ];
    const route2Coords = [
      [41.27924439289627, 69.19710495281726],
      [41.27819223681161, 69.19881620216874]
    ];
    const route3Coords = [
      [41.27824414242834, 69.19744382276285],
      [41.27939746554246, 69.198548892877]
    ];
    const route4Coords = [
      [41.278199627791295, 69.19752965345137],
      [41.279332718122234, 69.19863472356546]
    ];
    const intersectionPoints = [
      [41.278786, 69.198028],
    ];

    const redRoute = this.createGlowingLine(route2Coords, '#ff0044');
    const greenRoute1 = this.createGlowingLine(route1Coords, '#00ff44');
    const greenRoute2 = this.createGlowingLine(route3Coords, '#00ff44');
    const greenRoute3 = this.createGlowingLine(route4Coords, '#00ff44');
    const lightBeams: any[] = [];

    intersectionPoints.forEach(point => {
      const beam = this.createVerticalLightBeam(point, '#00ff44');
      lightBeams.push(...beam);
    });
    const intersectionPoint = [41.27900, 69.19796];
    const center = [intersectionPoint[1], intersectionPoint[0]];
    const beamHeight = 0.0009;
    const perspectiveShift = beamHeight * Math.cos(Math.PI / 4);
    const coneTop = [
      center[1] + perspectiveShift,
      center[0]
    ];
    const numberBalloon = this.createNumberBalloon(coneTop, '4');
    [...redRoute, ...greenRoute1, ...greenRoute2, ...greenRoute3, ...lightBeams].forEach(element => {
      this.map.addChild(element);
    });
    this.map.addChild(numberBalloon);
  }

}
