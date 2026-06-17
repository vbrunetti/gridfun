export type PanelSize = "fullscreen" | "band" | "column";
export type Axis = "y" | "x";

export type PanelDef = {
  id: string;
  size: PanelSize;
  surface: "light" | "dark" | "canvas";
  bandFraction?: number;
};

export type SectionDef = {
  id: string;
  axis: Axis;
  mobileBiaxial?: boolean;
  panels: PanelDef[];
};
