// Facts about Dr. AIT, gathered from drait.edu.in and public listings (October 2026).

export const COLLEGE = {
  name: "Dr. Ambedkar Institute of Technology",
  short: "Dr. AIT",
  founded: 1980,
  founder: "M. H. Jayaprakash Narayan",
  affiliation: "Visvesvaraya Technological University (VTU), Belagavi",
  status: "Autonomous",
  accreditation: ["NAAC A+", "NBA", "AICTE approved", "UGC recognised"],
  nirf: "NIRF rank band 163",
  address: "BDA Outer Ring Road, near Jnana Bharathi Campus, Mallathahalli, Bengaluru 560056",
  website: "https://drait.edu.in",
  enquiry: { phone: "9900113406", email: "prm@drait.edu.in", admissions: "974 194 0511 / 944 892 0704" },
  schools: [
    "School of Core Engineering & Technology",
    "School of Electrical, Electronics Sciences & Engineering",
    "School of Computer Science & Engineering",
    "School of Applied Science & Humanities",
    "School of Commerce & Management",
  ],
  programmes: ["B.E.", "M.Tech", "MCA", "MBA", "BBA", "BCA", "Ph.D."],
  placements: { year: "2025–26", recruiters: "70+", placed: "800+", average: "7 LPA", highest: "30 LPA" },
  facilities: ["Central library", "Hostels", "Sports", "NCC", "NSS", "Medical counselling", "AICTE IDEA Lab", "Research incubation (ACTS)"],
} as const;

export const DEPARTMENTS = [
  { id: "aero", short: "AE", name: "Aeronautical Engineering" },
  { id: "civil", short: "Civil", name: "Civil Engineering" },
  { id: "cse", short: "CSE", name: "Computer Science & Engineering" },
  { id: "csds", short: "CSE-DS", name: "Computer Science & Engineering (Data Science)" },
  { id: "aiml", short: "AIML", name: "Artificial Intelligence & Machine Learning" },
  { id: "csbs", short: "CSBS", name: "Computer Science & Business Systems" },
  { id: "ise", short: "ISE", name: "Information Science & Engineering" },
  { id: "ece", short: "ECE", name: "Electronics & Communication Engineering" },
  { id: "eee", short: "EEE", name: "Electrical & Electronics Engineering" },
  { id: "eie", short: "EIE", name: "Electronics & Instrumentation Engineering" },
  { id: "ete", short: "ETE", name: "Electronics & Telecommunication Engineering" },
  { id: "mde", short: "MDE", name: "Medical Electronics Engineering" },
  { id: "iem", short: "IEM", name: "Industrial Engineering & Management" },
  { id: "mech", short: "Mech", name: "Mechanical Engineering" },
  { id: "mca", short: "MCA", name: "Master of Computer Applications" },
  { id: "mba", short: "MBA", name: "Master of Business Administration" },
  { id: "other", short: "Other", name: "Other" },
] as const;

export type DepartmentId = (typeof DEPARTMENTS)[number]["id"];

export const departmentShort = (id?: string | null) => DEPARTMENTS.find((d) => d.id === id)?.short ?? "";
export const departmentName = (id?: string | null) => DEPARTMENTS.find((d) => d.id === id)?.name ?? "";

export const SEMESTERS = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem", "Alumni", "Faculty"];

/** Dr. AIT emails, including department subdomains like cs.drait.edu.in. */
export const isCollegeEmail = (email?: string | null) => !!email && /@([a-z0-9-]+\.)*drait\.edu\.in$/i.test(email);

export const DEVELOPER = {
  name: "Joyce Malik",
  email: "1da23cs069@cs.drait.edu.in",
  website: "https://joycemalik.com",
  linkedin: "https://www.linkedin.com/in/joycemalik/",
  github: "https://github.com/joycemalik",
  repo: "https://github.com/joycemalik/drait",
};
