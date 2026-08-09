import React from "react";
import {
  Download,
  Share,
  Calendar,
  User,
  Printer,
  Mail,
  CheckCircle,
  TrendingUp,
  Radio,
  MessageSquare,
} from "lucide-react";
import Footer from "../Component/reuseables/Footer";

const PerformanceResults = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <main className="">
        <div className="max-w-5xl flex flex-col mx-auto p-4 md:p-10 gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="text-primary font-bold text-xs uppercase tracking-widest">
                Employee Summary
              </span>
              <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">
                Annual Review 2023
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Employee ID: HR-2023-001 • Senior Product Designer
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-[#5048e5] text-white text-sm font-bold hover:bg-[#5048e5]/90 transition-all shadow-lg shadow-primary/20">
                <Download className="text-sm" />
                Download PDF
              </button>
              <button className="flex items-center justify-center rounded-lg h-11 w-11 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                <Share className="text-sm" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-4 shadow-sm">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wide">
                Overall Performance
              </p>
              <div className="relative size-48 flex items-center justify-center">
                <svg className="size-full transform -rotate-90">
                  <circle
                    className="text-slate-100 dark:text-slate-800"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                  ></circle>
                  <circle
                    className="text-primary"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="88"
                    stroke="currentColor"
                    strokeDasharray="552.92"
                    strokeDashoffset="88.46"
                    strokeWidth="12"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                    4.2
                  </span>
                  <span className="text-slate-400 text-sm font-medium">
                    Out of 5.0
                  </span>
                </div>
              </div>
              <div className="px-4 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center gap-1.5">
                <CheckCircle className="text-sm fill-1" />
                Exceeds Expectations
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-primary to-indigo-700 p-8 rounded-xl flex flex-col justify-between text-white shadow-xl">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-white/70 text-sm font-medium">
                    Final Rating Grade
                  </p>
                  <h3 className="text-4xl font-black tracking-tight">
                    Grade A+
                  </h3>
                  <p className="text-white/80 font-medium">
                    Exceptional Individual Contributor
                  </p>
                </div>
                <div className="text-6xl opacity-20">🏆</div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <div className="h-px bg-white/20 w-full"></div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-sm" />
                    Review Cycle: Jan - Dec 2023
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="text-sm" />
                    Manager: Sarah Jenkins
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold">KPI Performance Breakdown</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-500">
                  Weight Total: 100%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4">Key Performance Indicator</th>
                    <th className="px-6 py-4">Weight</th>
                    <th className="px-6 py-4">Self Score</th>
                    <th className="px-6 py-4">Supervisor</th>
                    <th className="px-8 py-4 text-right">Weighted Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        Project Delivery & Deadlines
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Timely completion of sprint items and roadmap features
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">30%</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold">4.5</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-primary">
                        4.0
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-slate-900 dark:text-slate-100">
                      1.20
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        Design Quality & Innovation
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        UI consistency and adherence to design systems
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">40%</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold">4.0</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-primary">
                        4.8
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-slate-900 dark:text-slate-100">
                      1.92
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        Team Collaboration
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Cross-functional communication with dev and product
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">20%</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold">5.0</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-primary">
                        4.5
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-slate-900 dark:text-slate-100">
                      0.90
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        Mentorship & Leadership
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Helping junior designers grow within the team
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">10%</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold">3.5</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-primary">
                        3.0
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-slate-900 dark:text-slate-100">
                      0.30
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50/50 dark:bg-slate-800/20">
                  <tr>
                    <td
                      className="px-8 py-4 text-sm font-bold text-right text-slate-500 uppercase tracking-wider"
                      colSpan="4"
                    >
                      Final Weighted Score
                    </td>
                    <td className="px-8 py-4 text-right text-xl font-black text-primary">
                      4.32
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Supervisor Comments</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-primary/20 pl-4">
                "Alex has consistently demonstrated exceptional design thinking
                throughout this review period. Their work on the Core Dashboard
                redesign was instrumental in reducing support tickets by 15%.
                While Alex excels at execution, I would like to see more
                proactive initiative in taking over project management duties
                for smaller initiatives next quarter. Overall, a vital member of
                the product team."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdpyQ7zpm0kQfP9fN123sAmvQek5VcsvYkbhdjNE2rVepFSjvLfvREJ3-H8XhL-w4PTneMQr82DIPIM-MUMF6gQMziAA2zqVDNd4kgilyVoTYuhp6AfMJNIN8WrdgdHxmCcKu3LDFY16461t7TLNYFzqpgv5W0Rcvtni6aYQ5fHr3J2qgVv6VlDjLwq_Uwq8N2Av_ToTxdbWvuN_lSAK2ZTranRufKm72cZZKd682NtLo5wHGnfVQ7T6v4xCwLZndPa3pnasLLtns")',
                  }}
                ></div>
                <div>
                  <p className="text-sm font-bold">Sarah Jenkins</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Director of Product Design
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-primary" />
                  <h3 className="text-lg font-bold">Growth Areas</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-emerald-500 text-sm mt-1" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Advanced Prototyping (Figma/Principle)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-emerald-500 text-sm mt-1" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Stakeholder Communication Skills
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Radio className="text-primary text-sm mt-1" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Q1 Goal: Lead Design Sprint workshops
                    </span>
                  </li>
                </ul>
              </div>
              <button className="mt-8 w-full py-3 rounded-lg border-2 border-primary/30 text-primary font-bold hover:bg-[#5048e5]/5 transition-colors">
                View Full Development Plan
              </button>
            </div>
          </div>

          <Footer variant="performanceAppraisal" />
        </div>
      </main>
    </div>
  );
};

export default PerformanceResults;
