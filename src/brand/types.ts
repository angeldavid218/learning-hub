export type BrandTheme = "agentlabs" | "timerich";

export interface ResolvedBrand {
  id: string;
  name: string;
  theme: BrandTheme;
}
