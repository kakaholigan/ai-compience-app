"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info, ExternalLink } from "lucide-react";

interface Blocker {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium";
  solutions: string[];
}

interface Requirement {
  id: string;
  title: string;
  cost: string;
  deadline: string;
  vendors?: string[];
  officialForm?: {
    name: string;
    url: string;
  };
}

export default function GapAnalysis() {
  const [profile, setProfile] = useState<any>(null);
  
  // Listen for profile updates
  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem('founderProfile');
      if (saved) {
        const p = JSON.parse(saved);
        setProfile(p);
        updateAnalysisFromProfile(p);
      }
    };
    
    loadProfile();
    window.addEventListener('profileUpdated', loadProfile);
    return () => window.removeEventListener('profileUpdated', loadProfile);
  }, []);

  const [analysis, setAnalysis] = useState<{
    progress: number;
    blockers: Blocker[];
    requirements: Requirement[];
  }>({
    progress: 15,
    blockers: [],
    requirements: [],
  });

  // Update analysis based on profile changes
  const updateAnalysisFromProfile = (p: any) => {
    if (!p) return;
    
    const blockers: Blocker[] = [];
    const requirements: Requirement[] = [
      {
        id: "1",
        title: "Registered Agent (Delaware)",
        cost: "$125-300/year",
        deadline: "Before filing incorporation",
        vendors: ["Doola", "Northwest Registered Agent", "CT Corporation"],
      },
      {
        id: "2",
        title: "IRS EIN Application",
        cost: "Free",
        deadline: "Within 7 days of incorporation",
        officialForm: {
          name: "IRS Form SS-4",
          url: "https://www.irs.gov/forms-pubs/about-form-ss-4"
        }
      },
      {
        id: "3",
        title: "Delaware Franchise Tax",
        cost: "$450/year (minimum)",
        deadline: "March 1st annually",
        officialForm: {
          name: "Annual Report",
          url: "https://icis.corp.delaware.gov/Ecorp/logintax.aspx"
        }
      },
    ];
    
    // Add visa-specific blockers
    if (p.visaStatus === 'none' || !p.visaStatus) {
      blockers.push({
        id: "visa",
        title: "No US Visa → Cannot be Company Director",
        severity: "critical",
        solutions: [
          "Option A: Hire US citizen/permanent resident as director",
          "Option B: Apply for E-2 investor visa ($100k+ investment required)",
          "Option C: Use nominee director service ($500-2000/year)",
        ],
      });
    }
    
    if (p.visaStatus === 'f1') {
      blockers.push({
        id: "f1-restriction",
        title: "F-1 Visa Work Restrictions",
        severity: "high",
        solutions: [
          "Cannot work full-time on F-1 (CPT/OPT only)",
          "Consider co-founder with H-1B or citizenship",
          "Transition to E-2 visa after funding",
        ],
      });
    }
    
    // Add funding-specific requirements
    if (p.fundingTarget && parseInt(p.fundingTarget) > 0) {
      requirements.push({
        id: "sec-filing",
        title: "SEC Form D Filing (Reg D Exemption)",
        cost: parseInt(p.fundingTarget) > 1000000 ? "$1,500-3,000" : "$0-500",
        deadline: "Within 15 days of first sale",
        officialForm: {
          name: "SEC Form D",
          url: "https://www.sec.gov/files/formd.pdf"
        }
      });
    }
    
    if (p.businessType === 'fintech') {
      requirements.push({
        id: "fintech-license",
        title: "State Money Transmitter License",
        cost: "$5,000-50,000 per state",
        deadline: "Before launching payment features",
      });
    }
    
    // Calculate progress
    let progress = 15;
    if (p.citizenship) progress += 15;
    if (p.visaStatus) progress += 15;
    if (p.businessType) progress += 15;
    if (p.fundingTarget) progress += 20;
    if (p.timeline) progress += 20;
    
    setAnalysis({ progress, blockers, requirements });
  };

  const getSeverityColor = (severity: Blocker["severity"]) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 Gap Analysis</CardTitle>
        <CardDescription>
          What's blocking you and what you need to proceed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">{analysis.progress}%</span>
          </div>
          <Progress value={analysis.progress} className="h-2" />
        </div>

        {/* Blockers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="font-semibold text-sm">Critical Blockers</h3>
          </div>
          <div className="space-y-3">
            {analysis.blockers.map((blocker) => (
              <div
                key={blocker.id}
                className="p-4 rounded-lg border border-destructive/50 bg-destructive/5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{blocker.title}</p>
                  <Badge variant={getSeverityColor(blocker.severity)}>
                    {blocker.severity}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Solutions:</p>
                  {blocker.solutions.map((solution, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                      <p className="text-xs">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold text-sm">Legal Requirements</h3>
          </div>
          <div className="space-y-2">
            {analysis.requirements.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-lg border bg-card space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{req.title}</p>
                  <Badge variant="outline">{req.cost}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    ⏰ Deadline: {req.deadline}
                  </p>
                  {req.officialForm && (
                    <a
                      href={req.officialForm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {req.officialForm.name}
                    </a>
                  )}
                </div>
                {req.vendors && (
                  <div className="flex flex-wrap gap-1">
                    {req.vendors.map((vendor, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
