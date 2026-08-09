import { LayoutDashboard, FileText, Settings, Target, Award, Users, FileText as FileTextIcon } from "lucide-react";

export const appraisalLinks = {
  admin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/appraisal-dashboard/admin",
    },
    {
      title: "Create Cycle",
      icon: FileText,
      path: "/appraisal-dashboard/create-cycle",
    },
    {
      title: "View Cycles",
      icon: FileText,
      path: "/appraisal-dashboard/appraisal-cycles",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/appraisal-dashboard/settings",
    },
  ],

  employee: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/appraisal-dashboard/employee",
    },
    {
      title: "My Appraisals",
      icon: FileTextIcon,
      path: "/appraisal-dashboard/my-appraisals",
    },
    {
      title: "Team Appraisal",
      icon: FileTextIcon,
      path: "/appraisal-dashboard/team-appraisals",
    },
    {
      title: "SetKpis",
      icon: Settings,
      path: "/appraisal-dashboard/setKpis",
    },
    {
      title: "Self Appraisal",
      icon: FileText,
      path: "/appraisal-dashboard/self-appraisal",
    },
    {
      title: "Performance Results",
      icon: Award,
      path: "/appraisal-dashboard/performance-results",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/appraisal-dashboard/settings",
    },
    
  ],
  teamlead: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/appraisal-dashboard",
    },
    {
      title: "Assign KPIs",
      icon: Target,
      path: "/appraisal-dashboard/assign-kpis",
    },
    {
      title: "Supervisor Review",
      icon: Users,
      path: "/appraisal-dashboard/supervisor-review",
    },
    {
      title: "Performance Results",
      icon: Award,
      path: "/appraisal-dashboard/performance-results",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/appraisal-dashboard/settings",
    },
  ],
};
