import {OverlayData} from 'night-vision/dist/types';
import {Preferences} from './Preferences';

export type DrawingToolType =
  | 'Cursor'
  | 'Brush'
  | 'LineTool'
  | 'LineToolHorizontalRay'
  | 'RangeTool'
  | 'Magnet'
  | 'Trash'
  | 'Rectangle'
  | 'FibRetracement'
  | 'LongShortPosition'
  | 'ShortLongPosition'
  | 'Text';

export interface BaseDrawingTool {
  uuid: string;
  color: string;
  fillColor?: string;
  lineWidth: number;
  lineType: string;
  overlayType: DrawingToolType;
}

export interface LineDrawingTool extends BaseDrawingTool {
  overlayType: 'LineTool' | 'LineToolHorizontalRay' | 'RangeTool';
  p1: [number, number];
  p2?: [number, number];
  type: 'segment' | 'ray';
}

export interface RectangleDrawingTool extends BaseDrawingTool {
  overlayType: 'Rectangle';
  p1: [number, number];
  p2: [number, number];
}

export interface BrushDrawingTool extends BaseDrawingTool {
  overlayType: 'Brush';
  points: [number, number][];
}

export interface CursorDrawingTool extends BaseDrawingTool {
  overlayType: 'Cursor';
}

export interface MagnetDrawingTool extends BaseDrawingTool {
  overlayType: 'Magnet';
}

export interface TrashDrawingTool extends BaseDrawingTool {
  overlayType: 'Trash';
}

export interface FibDrawingTool extends BaseDrawingTool {
  overlayType: 'FibRetracement';
}

export interface ShortLongDrawingTool extends BaseDrawingTool {
  overlayType: 'LongShortPosition' | 'ShortLongPosition';
}

export interface TextDrawingTool extends BaseDrawingTool {
  overlayType: 'Text';
  text: string;
  predictedText?: string;
}

export type DrawingTool =
  | LineDrawingTool
  | RectangleDrawingTool
  | BrushDrawingTool
  | CursorDrawingTool
  | MagnetDrawingTool
  | TrashDrawingTool
  | FibDrawingTool
  | ShortLongDrawingTool
  | TextDrawingTool

export interface DrawingToolbarItem {
  type: DrawingToolType;
  label: string;
  icon: string;
}

export const getDrawingOverlays = (
  drawingTools: DrawingTool[],
  chartSettings: Preferences,
) => {
  return [
    {
      name: 'RangeTool',
      type: 'RangeTool',
      // @ts-ignore
      drawingTool: true,
      data: [],
      props: {},
      settings: {
        zIndex: 1000,
      },
    },
    {
      name: 'Brush',
      type: 'Brush',
      drawingTool: true,
      data: drawingTools.filter(
        (data) => data?.overlayType === 'Brush',
      ) as unknown as OverlayData,
      settings: {
        zIndex: 1000,
      },
      props: {
        color: chartSettings?.chartThemeSettings.brushColor,
      },
    },
    {
      name: 'LineTool',
      type: 'LineTool',
      // @ts-ignore
      drawingTool: true,
      data: drawingTools.filter((data: LineDrawingTool) => data?.type === 'segment') as unknown as OverlayData,
      props: {
        color: chartSettings?.chartThemeSettings.horizontalLevelColor,
      },
      settings: {
        zIndex: 1000,
      },
    },
    {
      name: 'LineToolHorizontalRay',
      type: 'LineToolHorizontalRay',
      // @ts-ignore
      drawingTool: true,
      data: drawingTools
        .filter((data: LineDrawingTool) => !!data?.p1?.[0] && !!data?.p1?.[1])
        .filter((data: LineDrawingTool) => data?.type === 'ray') as unknown as OverlayData,
      props: {
        color: chartSettings?.chartThemeSettings.horizontalLevelColor,
      },
      settings: {
        zIndex: 1000,
      },
    },
    {
      name: 'Rectangle',
      type: 'Rectangle',
      drawingTool: true,
      data: drawingTools.filter(
        (data) => data?.overlayType === 'Rectangle',
      ) as unknown as OverlayData,
      props: {
        color: chartSettings?.chartThemeSettings.rectangleColor,
      },
      settings: {
        zIndex: 1000,
      },
    },
    {
      name: 'ShortLongPosition',
      type: 'ShortLongPosition',
      // @ts-ignore
      drawingTool: true,
      data: drawingTools.filter(
        (data) => data?.overlayType === 'ShortLongPosition',
      ) as unknown as OverlayData,
      settings: {
        zIndex: 1000,
      },
    },
    {
      name: 'LongShortPosition',
      type: 'LongShortPosition',
      // @ts-ignore
      drawingTool: true,
      data: drawingTools.filter(
        (data) => data?.overlayType === 'LongShortPosition',
      ) as unknown as OverlayData,
      settings: {
        zIndex: 1000,
      },
    },
    {
      name: 'FibRetracement',
      type: 'FibRetracement',
      // @ts-ignore
      drawingTool: true,
      data: drawingTools.filter(
        (data) => data?.overlayType === 'FibRetracement',
      ) as unknown as OverlayData,
      settings: {
        zIndex: 1000,
      },
    },
    {
      name: 'Text',
      type: 'Text',
      // @ts-ignore
      drawingTool: true,
      data: drawingTools.filter(
        (data: TextDrawingTool) => data?.overlayType === 'Text' && data.text !== '',
      ) as unknown as OverlayData,
      settings: {
        zIndex: 1000,
      },
    }
  ];
};

export const getDrawingToolbarItems = (): DrawingToolbarItem[] => {
  return [
    {
      type: 'Cursor',
      label: '',
      icon:
        '<svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M16 13L25 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M1 13L10 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M13 10L13 1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M13 25L13 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>',
    },
    {
      type: 'Brush',
      label: 'Brush',
      icon:
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M22.3732 1.62679C21.9719 1.22546 21.4275 1 20.86 1C20.2924 1 19.748 1.22546 19.3467 1.62679L8.18836 14.0537C9.40827 14.3021 10.6261 15.4961 10.792 16.6573L22.3732 4.6533C22.7745 4.25195 23 3.70762 23 3.14004C23 2.57247 22.7745 2.02814 22.3732 1.62679ZM5.757 16.2345C4.17768 16.2345 2.9028 17.5294 2.9028 19.1341C2.9028 20.4 1.79918 21.0671 1 21.0671C1.87529 22.2463 3.36899 23 4.8056 23C6.9082 23 8.6112 21.27 8.6112 19.1341C8.6112 17.5294 7.33633 16.2345 5.757 16.2345Z" stroke="currentColor" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>\n',
    },
    {
      type: 'LineTool',
      label: 'Line',
      icon:
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M4.85199 19.1482L19.1479 4.85193M23 3.25641C23 4.50259 21.9898 5.51282 20.7437 5.51282C19.4975 5.51282 18.4873 4.50259 18.4873 3.25641C18.4873 2.01023 19.4975 1 20.7437 1C21.9898 1 23 2.01023 23 3.25641ZM5.51268 20.7436C5.51268 21.9898 4.50249 23 3.25634 23C2.0102 23 1 21.9898 1 20.7436C1 19.4974 2.0102 18.4872 3.25634 18.4872C4.50249 18.4872 5.51268 19.4974 5.51268 20.7436Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>\n',
    },
    {
      type: 'LineToolHorizontalRay',
      label: 'Horizontal Ray (Right Click)',
      icon:
        '<svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M23 8.49976H6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<circle cx="3.5" cy="8.49976" r="2.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M19.0428 5.32425C18.1646 5.32425 17.568 4.99704 17.2715 4.47778C17.1974 4.34618 17.1641 4.2217 17.1641 4.09366C17.1641 3.88027 17.3049 3.74156 17.5383 3.74156C17.7162 3.74156 17.82 3.8198 17.9052 4.00475C18.0868 4.41376 18.4351 4.65917 19.0465 4.65917C19.695 4.65917 20.1322 4.3035 20.1359 3.80558C20.1396 3.21874 19.6987 2.89153 18.9835 2.89153H18.6278C18.4165 2.89153 18.2831 2.76705 18.2831 2.5821C18.2831 2.39716 18.4165 2.27268 18.6278 2.27268H18.9613C19.5727 2.27268 19.9877 1.92413 19.9877 1.44754C19.9877 0.970956 19.669 0.654417 19.0354 0.654417C18.4944 0.654417 18.1905 0.871371 18.0052 1.29816C17.9163 1.50445 17.8274 1.57914 17.631 1.57914C17.3975 1.57914 17.2715 1.4511 17.2715 1.2377C17.2715 1.09899 17.3012 0.981626 17.3716 0.850031C17.6384 0.341435 18.2202 0 19.0354 0C20.1248 0 20.7955 0.572615 20.7955 1.33729C20.7955 1.97748 20.3249 2.41139 19.669 2.54298V2.56076C20.4546 2.62834 20.9808 3.08714 20.9808 3.80558C20.9808 4.70896 20.1582 5.32425 19.0428 5.32425Z" fill="currentColor"/>\n' +
        '<path d="M15.4073 5.29591C15.1775 5.29591 15.0108 5.14298 15.0108 4.89757V4.20759H12.8096C12.5132 4.20759 12.3242 4.02976 12.3242 3.7559C12.3242 3.57451 12.3687 3.43225 12.5095 3.19751C12.8875 2.54665 13.5508 1.59348 14.24 0.633189C14.5661 0.170829 14.7773 0.0285645 15.1256 0.0285645C15.5592 0.0285645 15.8075 0.245518 15.8075 0.629632V3.53894H16.2299C16.4485 3.53894 16.593 3.6741 16.593 3.87327C16.593 4.07244 16.4485 4.20759 16.2299 4.20759H15.8075V4.89757C15.8075 5.14298 15.6407 5.29591 15.4073 5.29591ZM15.0182 3.54961V0.732774H15.0034C14.0955 1.98115 13.5359 2.78494 13.1024 3.52827V3.54961H15.0182Z" fill="currentColor"/>\n' +
        '<path d="M9.83056 5.32442C9.02645 5.32442 8.33721 4.94741 8.08152 4.38191C8.02964 4.27166 8 4.16496 8 4.03692C8 3.81997 8.14081 3.68837 8.36685 3.68837C8.54843 3.68837 8.65589 3.7595 8.74112 3.94445C8.91528 4.39614 9.29695 4.65577 9.84167 4.65577C10.5124 4.65577 10.983 4.20053 10.983 3.55678C10.983 2.92726 10.5087 2.48268 9.84167 2.48268C9.48964 2.48268 9.17467 2.61427 8.96716 2.82056C8.73741 3.04818 8.65959 3.0873 8.4632 3.0873C8.2001 3.0873 8.06299 2.90592 8.07041 2.68185C8.07041 2.66051 8.07041 2.64273 8.07041 2.61427L8.24827 0.636797C8.28533 0.249126 8.47802 0.0961914 8.88563 0.0961914H11.1609C11.3832 0.0961914 11.5277 0.227786 11.5277 0.430513C11.5277 0.63324 11.3832 0.768392 11.1609 0.768392H8.96716L8.81523 2.36176H8.83005C9.0635 2.04166 9.50447 1.85316 10.0344 1.85316C11.0645 1.85316 11.7945 2.55026 11.7945 3.53544C11.7945 4.59175 10.9867 5.32442 9.83056 5.32442Z" fill="currentColor"/>\n' +
        '</svg>\n',
    },
    {
      type: 'Rectangle',
      label: 'Rectangle',
      icon:
        '<svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '  <rect x="3" y="5" width="18" height="14" rx="2" \n' +
        '        stroke="currentColor" stroke-width="1" \n' +
        '        stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>\n',
    },
    {
      type: 'Text',
      label: 'Text',
      icon: '<svg width="26" height="26" viewBox="0 0 26 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M18.062 19h1.09L12.459 4h-.918L4.848 19h1.09l2.24-5h7.645zm-9.437-6L12 5.464 15.375 13z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>',
    },
    {
      type: 'RangeTool',
      label: 'Measure',
      icon:
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M3.045 17.508C1.682 16.145 1 15.463 1 14.616C1 13.768 1.682 13.086 3.045 11.723L11.723 3.045C13.087 1.682 13.768 1 14.616 1C15.464 1 16.145 1.682 17.508 3.045L18.955 4.492C20.318 5.855 21 6.537 21 7.384C21 8.231 20.318 8.914 18.955 10.277L10.277 18.955C8.913 20.318 8.23 21 7.384 21C6.538 21 5.855 20.318 4.492 18.955L3.045 17.508Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M7.46368 7.46392L8.87968 8.87992M11.7067 3.22192L13.1207 4.63592M3.22168 11.7069L4.63568 13.1209M5.34268 9.58592L7.46468 11.7069M9.58568 5.34292L11.7067 7.46392" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>\n',
    },
    {
      type: 'FibRetracement',
      label: 'FibRetracement',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="24" height="28"><g fill="currentColor" fill-rule="nonzero"><path d="M3 5h22v-1h-22z"></path><path d="M3 17h22v-1h-22z"></path><path d="M3 11h19.5v-1h-19.5z"></path><path d="M5.5 23h19.5v-1h-19.5z"></path><path d="M3.5 24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM24.5 12c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm0 1c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"></path></g></svg>',
    },
    {
      type: 'Magnet',
      label: 'Magnet',
      icon:
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M3.28958 7.65378C1.82341 9.11995 0.999729 11.1085 0.999729 13.182C0.999729 15.2554 1.82341 17.244 3.28958 18.7102C4.75574 20.1763 6.74429 21 8.81776 21C10.8912 21 12.8798 20.1763 14.3459 18.7102" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M6.97683 11.3384C6.49469 11.8284 6.22573 12.4892 6.22853 13.1766C6.23133 13.8641 6.50566 14.5226 6.99178 15.0087C7.47789 15.4948 8.1364 15.7692 8.82387 15.772C9.51133 15.7748 10.1721 15.5058 10.6621 15.0236" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M10.663 15.0244L16.8055 8.88244C17.1313 8.55671 17.5732 8.37372 18.0339 8.37372C18.4946 8.37372 18.9364 8.55671 19.2622 8.88244L20.493 10.1105C20.6543 10.2718 20.7823 10.4634 20.8697 10.6742C20.957 10.885 21.002 11.1109 21.002 11.3391C21.002 11.5673 20.957 11.7932 20.8697 12.004C20.7823 12.2148 20.6543 12.4064 20.493 12.5677L14.3483 18.7102M3.29194 7.65384L9.43443 1.50918C9.59576 1.34781 9.78729 1.2198 9.9981 1.13247C10.2089 1.04514 10.4349 1.00019 10.663 1.00019C10.8912 1.00019 11.1172 1.04514 11.328 1.13247C11.5388 1.2198 11.7303 1.34781 11.8916 1.50918L13.1197 2.73778C13.2811 2.89911 13.4091 3.09065 13.4964 3.30146C13.5837 3.51226 13.6287 3.73821 13.6287 3.96639C13.6287 4.19457 13.5837 4.42051 13.4964 4.63132C13.4091 4.84213 13.2811 5.03367 13.1197 5.195L6.97776 11.3391M18.6145 14.3772L14.9292 10.6914M11.2439 7.00614L7.55813 3.32087" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>\n',
    },
    {
      type: "LongShortPosition",
      label: "LongShortPosition",
      icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26 26\" width=\"24\" height=\"26\" fill=\"none\"><path fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 6.5A2.5 2.5 0 0 1 6.95 6H24v1H6.95A2.5 2.5 0 0 1 2 6.5zM4.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 16.5a2.5 2.5 0 0 1 4.95-.5h13.1a2.5 2.5 0 1 1 0 1H6.95A2.5 2.5 0 0 1 2 16.5zM22.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-18 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2 22.5a2.5 2.5 0 0 1 4.95-.5H24v1H6.95A2.5 2.5 0 0 1 2 22.5z\"></path><path fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M22.4 8.94l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.39.63-.41-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91zm-4 1.8l-1.4.63-.4-.91 1.39-.63.41.91z\"></path></svg>"
    },
    {
      type: "ShortLongPosition",
      label: "Measure",
      icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26 26\" width=\"24\" height=\"26\" fill=\"none\"><path fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4.5 24a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 22.5a2.5 2.5 0 0 0 4.95.5H24v-1H6.95a2.5 2.5 0 0 0-4.95.5zM4.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 12.5a2.5 2.5 0 0 0 4.95.5h13.1a2.5 2.5 0 1 0 0-1H6.95a2.5 2.5 0 0 0-4.95.5zM22.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-18-6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM2 6.5a2.5 2.5 0 0 0 4.95.5H24V6H6.95A2.5 2.5 0 0 0 2 6.5z\"></path><path fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M22.4 20.06l-1.39-.63-.41.91 1.39.63.41-.91zm-4-1.8l-1.39-.63-.41.91 1.39.63.41-.91zm-4-1.8l-1.4-.63-.4.91 1.39.63.41-.91zm-4-1.8L9 14.03l-.4.91 1.39.63.41-.91z\"></path></svg>"
    },
    {
      type: 'Trash',
      label: '',
      icon:
        '<svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M3 5L5 21H15L17 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M16.2857 5.00014H2.71429M1 5.00014H19M5 3.00014V3.00014C5 1.89558 5.89541 1.00013 6.99997 1.00011L13 1.00003C14.1046 1.00001 15 1.89544 15 3V3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>\n',
    },
  ];
};
