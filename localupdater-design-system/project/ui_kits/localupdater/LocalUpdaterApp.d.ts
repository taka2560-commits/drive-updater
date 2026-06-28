import * as React from "react";

export interface LocalUpdaterAppProps {
  defaultView?: "list" | "timeline" | "calendar";
  defaultTheme?: "earth" | "night" | "light";
}

/**
 * @startingPoint section="App shell" subtitle="LocalUpdater のフル画面" viewport="1280x780"
 */
export function LocalUpdaterApp(props?: LocalUpdaterAppProps): JSX.Element;
