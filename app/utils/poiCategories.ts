export const POI_CATEGORY_MAP: Record<string, string> = {
  Meal: "catering.restaurant,catering.cafe,catering.bar,catering.fast_food,catering.pub",
  Mall: "commercial.shopping_mall,commercial.department_store",
  Sport: "sport",
  Park: "leisure.park,entertainment.water_park",
  Educational: "entertainment.museum,entertainment.aquarium",
};

export const buildPlacesQuery = (
  category: string,
  lat: number,
  lng: number,
  radius: number = 1000
): string => {
  const categories = POI_CATEGORY_MAP[category];
  return `categories=${categories}&filter=circle:${lng},${lat},${radius}`;
};

export const buildAutocompleteQuery = (
  anyInput: string,
  lat: number,
  lng: number,
  radius: number = 2000
): string => {
  return `text=${encodeURIComponent(anyInput)}&filter=circle:${lng},${lat},${radius}&bias=proximity:${lng},${lat}&lang=id`;
};