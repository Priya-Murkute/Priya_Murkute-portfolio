import type { Place } from "@/types";

/**
 * Places I've wandered: the map on the About Me page pins every "visited"
 * place, and every "bucket" place is listed beside it (picking one flies the
 * map there). Coordinates are plain latitude / longitude in degrees.
 *
 * The stats above the map — places, countries, bucket list — are counted from
 * this list, so adding a place here is all it takes.
 */
export const places: Place[] = [
  { id: "london", name: "London", country: "UK", lat: 51.5074, lon: -0.1278, status: "visited" },
  { id: "cotswolds", name: "Cotswolds", country: "UK", lat: 51.85, lon: -1.85, status: "visited" },
  // The white cliffs at Dover.
  { id: "white-cliffs", name: "White Cliffs", country: "UK", lat: 51.13, lon: 1.37, status: "visited" },
  { id: "nashik", name: "Nashik", country: "India", lat: 19.9975, lon: 73.7898, status: "visited" },
  { id: "pune", name: "Pune", country: "India", lat: 18.5204, lon: 73.8567, status: "visited" },

  // Around the UK. After the places above, so those keep their say over whose name is written
  // where the pins crowd; these get theirs as the map closes in.
  { id: "bath", name: "Bath", country: "UK", lat: 51.3751, lon: -2.3618, status: "visited" },
  { id: "edinburgh", name: "Edinburgh", country: "UK", lat: 55.9533, lon: -3.1883, status: "visited" },
  { id: "liverpool", name: "Liverpool", country: "UK", lat: 53.4084, lon: -2.9916, status: "visited" },
  { id: "canterbury", name: "Canterbury", country: "UK", lat: 51.2802, lon: 1.0789, status: "visited" },
  { id: "colchester", name: "Colchester", country: "UK", lat: 51.8959, lon: 0.8919, status: "visited" },
  { id: "oxford", name: "Oxford", country: "UK", lat: 51.752, lon: -1.2577, status: "visited" },
  { id: "cambridge", name: "Cambridge", country: "UK", lat: 52.2053, lon: 0.1218, status: "visited" },
  { id: "brighton", name: "Brighton", country: "UK", lat: 50.8225, lon: -0.1372, status: "visited" },
  { id: "milton-keynes", name: "Milton Keynes", country: "UK", lat: 52.0406, lon: -0.7594, status: "visited" },

  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    lat: 35.0116,
    lon: 135.7681,
    status: "bucket",
    note: "Cherry blossom season, sketchbook in hand",
  },
  {
    id: "reykjavik",
    name: "Reykjavík",
    country: "Iceland",
    lat: 64.1466,
    lon: -21.9426,
    status: "bucket",
    note: "Chasing the northern lights",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    lat: 36.3932,
    lon: 25.4615,
    status: "bucket",
    note: "Sunset over the caldera",
  },
  {
    id: "new-york",
    name: "New York",
    country: "USA",
    lat: 40.7128,
    lon: -74.006,
    status: "bucket",
    note: "A Broadway show, then pizza at midnight",
  },
];

/**
 * The route the map draws, stop by stop, by place id: from Pune to Nashik, on to London. A
 * place left out is still pinned.
 */
export const journeyRoute: string[] = ["pune", "nashik", "london"];

/**
 * Trips out from the last stop of the route (London): each place gets its own line straight
 * from there, and none loops back. They all draw at once, fanning out together; add a new
 * place you've been to from London here to connect it.
 */
export const journeyTrips: string[] = [
  "bath",
  "cotswolds",
  "oxford",
  "milton-keynes",
  "liverpool",
  "edinburgh",
  "cambridge",
  "colchester",
  "canterbury",
  "white-cliffs",
  "brighton",
];

/** Small print under the bucket list. Leave empty to drop it. */
export const bucketListNote = "";
