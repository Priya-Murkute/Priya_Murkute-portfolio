import type { Artwork, InterestPhoto } from "@/types";

/**
 * Fallback gradients, used only while src/assets/{art,interests}/ are empty.
 * Don't edit this to add photos — drop them in those folders instead.
 */

export const interestPhotos: InterestPhoto[] = [
  {
    id: "golden-hour",
    title: "Golden Hour",
    year: "2024",
    gradient: "linear-gradient(150deg, #8fb5c8 0%, #c4a882 40%, #d4b89a 100%)",
    height: "tall",
    column: "left",
  },
  {
    id: "morning-ghats",
    title: "Morning Ghats",
    year: "2023",
    gradient: "linear-gradient(130deg, #2d4a3e 0%, #5d8a72 55%, #8ec4a0 100%)",
    height: "short",
    column: "left",
  },
  {
    id: "city-after-rain",
    title: "City after Rain",
    year: "2024",
    gradient: "linear-gradient(160deg, #2c3e6b 0%, #4a6098 55%, #c4a060 100%)",
    height: "med",
    column: "left",
  },
  {
    id: "old-walls",
    title: "Old Walls",
    year: "2023",
    gradient: "linear-gradient(145deg, #8a6848 0%, #c09870 55%, #dcc0a0 100%)",
    height: "tall",
    column: "left",
  },
  {
    id: "lavender-fields",
    title: "Lavender Fields",
    year: "2023",
    gradient: "linear-gradient(140deg, #6a5a8c 0%, #a08cbc 55%, #c8b8d4 100%)",
    height: "med",
    column: "left",
  },
  {
    id: "desert-at-dusk",
    title: "Desert at Dusk",
    year: "2024",
    gradient: "linear-gradient(120deg, #c4824a 0%, #d4a870 55%, #e8c898 100%)",
    height: "med",
    column: "right",
  },
  {
    id: "blue-everything",
    title: "Blue Everything",
    year: "2023",
    gradient: "linear-gradient(125deg, #4a6080 0%, #7898b8 55%, #a8c0d0 100%)",
    height: "tall",
    column: "right",
  },
  {
    id: "green-quiet",
    title: "Green Quiet",
    year: "2022",
    gradient: "linear-gradient(135deg, #5a7a68 0%, #8aaa94 55%, #c4d8c4 100%)",
    height: "short",
    column: "right",
  },
  {
    id: "warm-harvest",
    title: "Warm Harvest",
    year: "2023",
    gradient: "linear-gradient(155deg, #a06060 0%, #c89898 55%, #e8d0c8 100%)",
    height: "med",
    column: "right",
  },
  {
    id: "still-mornings",
    title: "Still Mornings",
    year: "2022",
    gradient: "linear-gradient(138deg, #606a38 0%, #98a870 55%, #d0dab0 100%)",
    height: "tall",
    column: "right",
  },
];

export const artworks: Artwork[] = [
  {
    id: "botanical-study-no-3",
    title: "Botanical Study No. 3",
    medium: "Pencil on cartridge paper",
    year: "2024",
    gradient: "linear-gradient(160deg, #e8d8c4 0%, #c4a88c 40%, #a8806c 100%)",
  },
  {
    id: "by-the-window",
    title: "By the Window",
    medium: "Ink & watercolour",
    year: "2024",
    gradient: "linear-gradient(145deg, #c8d8e0 0%, #8cb8c8 50%, #6898a8 100%)",
  },
  {
    id: "evening-bloom",
    title: "Evening Bloom",
    medium: "Soft pastels",
    year: "2023",
    gradient: "linear-gradient(135deg, #e0c8d8 0%, #c898b8 50%, #a87898 100%)",
  },
  {
    id: "garden-light",
    title: "Garden Light",
    medium: "Pencil & ink",
    year: "2023",
    gradient: "linear-gradient(150deg, #d8e4d0 0%, #a8c898 50%, #789870 100%)",
  },
  {
    id: "terracotta-morning",
    title: "Terracotta Morning",
    medium: "Gouache on board",
    year: "2024",
    gradient: "linear-gradient(142deg, #f0e4cc 0%, #d8b87c 50%, #b88848 100%)",
  },
  {
    id: "lavender-haze",
    title: "Lavender Haze",
    medium: "Watercolour",
    year: "2023",
    gradient: "linear-gradient(138deg, #d4d0e4 0%, #a8a0cc 50%, #807898 100%)",
  },
];
