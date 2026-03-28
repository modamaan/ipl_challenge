export const IPL_TEAMS = [
  {
    id: "CSK",
    name: "Chennai Super Kings",
    primaryColor: "#FBBF24", // Yellow
    secondaryColor: "#1E3A8A", // Deep Blue
    textColor: "#111827",
    logoPath: "/teams/csk.png"
  },
  {
    id: "MI",
    name: "Mumbai Indians",
    primaryColor: "#004BA0", // MI Blue
    secondaryColor: "#D1AB3E", // Gold
    textColor: "#FFFFFF",
    logoPath: "/teams/mi.png"
  },
  {
    id: "RCB",
    name: "Royal Challengers Bengaluru",
    primaryColor: "#EC1C24", // Red
    secondaryColor: "#000000", // Black/Gold
    textColor: "#FFFFFF",
    logoPath: "/teams/rcb.png"
  },
  {
    id: "KKR",
    name: "Kolkata Knight Riders",
    primaryColor: "#3A225D", // Purple
    secondaryColor: "#B3A123", // Gold
    textColor: "#FFFFFF",
    logoPath: "/teams/kkr.png"
  },
  {
    id: "DC",
    name: "Delhi Capitals",
    primaryColor: "#00008B", // Dark Blue
    secondaryColor: "#DC143C", // Crimson Red
    textColor: "#FFFFFF",
    logoPath: "/teams/dc.png"
  },
  {
    id: "RR",
    name: "Rajasthan Royals",
    primaryColor: "#EA1A85", // Pink
    secondaryColor: "#001D48", // Navy Blue
    textColor: "#FFFFFF",
    logoPath: "/teams/rr.png"
  },
  {
    id: "SRH",
    name: "Sunrisers Hyderabad",
    primaryColor: "#F26522", // Orange
    secondaryColor: "#000000", // Black
    textColor: "#FFFFFF",
    logoPath: "/teams/srh.png"
  },
  {
    id: "GT",
    name: "Gujarat Titans",
    primaryColor: "#1B2133", // Titanium Dark Blue
    secondaryColor: "#BBA14F", // Gold
    textColor: "#FFFFFF",
    logoPath: "/teams/gt.png"
  },
  {
    id: "LSG",
    name: "Lucknow Super Giants",
    primaryColor: "#0055A5", // Blue/cyan
    secondaryColor: "#F58220", // Orange
    textColor: "#FFFFFF",
    logoPath: "/teams/lsg.png"
  },
  {
    id: "PBKS",
    name: "Punjab Kings",
    primaryColor: "#DD1F2D", // Red
    secondaryColor: "#C7C8CA", // Silver
    textColor: "#FFFFFF",
    logoPath: "/teams/pbks.png"
  }
];

export function getTeam(teamId: string) {
  return IPL_TEAMS.find(t => t.id === teamId) || null;
}
