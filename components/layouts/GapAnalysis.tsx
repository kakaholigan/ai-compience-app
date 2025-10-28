"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

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
}

export default function GapAnalysis() {
  const [analysis, setAnalysis] = useState({
    progress: 15,
    blockers: [
      {
        id: "1",
        title: "No US Visa → Cannot be Company Director",
        severity: "critical" as const,
        solutions: [
          "Option A: Hire US citizen as director",
          "Option B: Apply for E-2 investor visa ($100k+ investment)",
          "Option C: Use nominee director service ($500-2000/year)",
        ],
      },
    ],
    requirements: [
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
      },
      {
        id: "3",
        title: "Delaware Franchise Tax",
        cost: "$450/year (minimum)",
        deadline: "March 1st annually",
      },
    ],
  });

  // Gap analysis state is managed locally
  // Can be updated via API calls from chat interface

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
                <p className="text-xs text-muted-foreground">
                  ⏰ Deadline: {req.deadline}
                </p>
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
