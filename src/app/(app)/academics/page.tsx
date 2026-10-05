import { BookOpen, FileText, FlaskConical, ChevronRight } from "lucide-react";

const departments = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    short: "CSE",
    color: "#4f46e5",
    semesters: 8,
  },
  {
    id: "ise",
    name: "Information Science Engineering",
    short: "ISE",
    color: "#0891b2",
    semesters: 8,
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    short: "ECE",
    color: "#16a34a",
    semesters: 8,
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    short: "MECH",
    color: "#d97706",
    semesters: 8,
  },
  {
    id: "civil",
    name: "Civil Engineering",
    short: "CIVIL",
    color: "#dc2626",
    semesters: 8,
  },
];

const cseSubjects = [
  { sem: 3, name: "Data Structures", resources: 12 },
  { sem: 3, name: "DBMS", resources: 18 },
  { sem: 3, name: "Computer Architecture", resources: 9 },
  { sem: 4, name: "Operating Systems", resources: 15 },
  { sem: 4, name: "Computer Networks", resources: 11 },
  { sem: 5, name: "Machine Learning", resources: 22 },
  { sem: 5, name: "Compiler Design", resources: 7 },
];

export default function AcademicsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-gray-900">Academic Resources</h1>
        <p className="text-gray-500 text-sm mt-1">
          Notes, PYQs, lab manuals, and references — organized by department and semester
        </p>
      </div>

      {/* Departments */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Departments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs mb-4"
                style={{ backgroundColor: dept.color }}
              >
                {dept.short}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {dept.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{dept.semesters} semesters</p>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {Array.from({ length: dept.semesters }, (_, i) => i + 1).map((sem) => (
                  <span
                    key={sem}
                    className="text-xs bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-600 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  >
                    Sem {sem}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick access: CSE resources */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Quick Access — CSE</h2>
          <button className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {cseSubjects.map((subj) => (
              <div
                key={subj.name}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 cursor-pointer group"
              >
                <BookOpen size={16} className="text-indigo-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {subj.name}
                  </p>
                  <p className="text-xs text-gray-500">Semester {subj.sem}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                    <FileText size={12} /> Notes
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                    <FlaskConical size={12} /> PYQs
                  </button>
                  <span className="text-xs text-gray-400">{subj.resources} files</span>
                  <ChevronRight size={14} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload CTA */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
          <BookOpen size={18} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-indigo-900">Contribute Resources</h3>
          <p className="text-sm text-indigo-700 mt-1">
            Have notes, PYQs, or lab manuals that could help your classmates? Upload them here.
            Every contribution helps the community.
          </p>
          <button className="mt-3 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            Upload Resources
          </button>
        </div>
      </div>
    </div>
  );
}
