import { Trophy, Star } from "lucide-react";

const achievements = [
  {
    id: "ac1",
    title: "1st Place — Hackdata 2026",
    student: "Joyce Malik",
    team: "Team NeuralFlow",
    club: "10X Club",
    category: "hackathon",
    date: "2026-08-12",
    description: "Won first place at Hackdata 2026 with an AI-powered aquaculture monitoring system.",
    badge: "🥇",
    verified: true,
  },
  {
    id: "ac2",
    title: "Google Cloud Champion",
    student: "Rahul Nair",
    club: "GDG AIT",
    category: "certification",
    date: "2026-07-20",
    description: "Achieved Google Cloud Professional Cloud Architect certification.",
    badge: "☁️",
    verified: true,
  },
  {
    id: "ac3",
    title: "Smart India Hackathon — Top 10 Nationally",
    student: "Meera Iyer & Team",
    club: "Nextion X",
    category: "competition",
    date: "2026-06-15",
    description: "Reached national top 10 in Smart India Hackathon 2025 with an EdTech solution.",
    badge: "🏆",
    verified: true,
  },
  {
    id: "ac4",
    title: "State Football Championship — Runners Up",
    student: "OpenSport Football Team",
    club: "OpenSport",
    category: "sports",
    date: "2026-08-30",
    description: "AIT's football team reached the finals of the state inter-college championship.",
    badge: "⚽",
    verified: true,
  },
  {
    id: "ac5",
    title: "Research Paper Published — IEEE",
    student: "Suresh Kumar",
    club: "AIT Robotics",
    category: "research",
    date: "2026-07-05",
    description: "Published research paper on autonomous navigation for indoor robots at IEEE IROS 2026.",
    badge: "📄",
    verified: true,
  },
  {
    id: "ac6",
    title: "Best UI/UX Award — DesignHack",
    student: "Ananya Pillai",
    club: "Nextion X",
    category: "design",
    date: "2026-09-01",
    description: "Won Best UI/UX award at DesignHack 2026 for an accessibility-first mobile app.",
    badge: "🎨",
    verified: false,
  },
];

const categoryColors: Record<string, string> = {
  hackathon: "bg-violet-100 text-violet-700",
  certification: "bg-blue-100 text-blue-700",
  competition: "bg-orange-100 text-orange-700",
  sports: "bg-red-100 text-red-700",
  research: "bg-teal-100 text-teal-700",
  design: "bg-pink-100 text-pink-700",
};

export default function AchievementsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-gray-900">Achievements</h1>
        <p className="text-gray-500 text-sm mt-1">
          Celebrating what AIT students are building, winning, and publishing
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all p-5"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-3xl">{ach.badge}</span>
              <div className="flex items-center gap-1.5">
                {ach.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Star size={9} fill="currentColor" /> Verified
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    categoryColors[ach.category] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {ach.category}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 leading-snug">{ach.title}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {ach.student} · {ach.club}
            </p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">{ach.description}</p>
            <p className="text-xs text-gray-400 mt-3">
              {new Date(ach.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>

      {/* Submit CTA */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
          <Trophy size={18} className="text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-900">Submit Your Achievement</h3>
          <p className="text-sm text-amber-700 mt-1">
            Won a hackathon? Published a paper? Earned a certification? Let the AIT community know.
            Verified achievements appear here with a badge.
          </p>
          <button className="mt-3 text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium">
            Submit Achievement
          </button>
        </div>
      </div>
    </div>
  );
}
