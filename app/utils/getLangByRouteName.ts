import type { RouteRecordNameGeneric } from "vue-router";

export function getLangByRouteName(
  routeName: string | RouteRecordNameGeneric
): string {
  if (!routeName) return "";
  routeName = routeName.toString();
  if (routeName.includes("___")) {
    // return string after ___
    const lang = routeName.split("___")[1];
    if (lang === "de") return "";
  }
  return "";
}
