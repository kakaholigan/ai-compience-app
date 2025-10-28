"use client";

import { useState } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high" | "critical";
}

interface Phase {
  id: string;
  name: string;
  tasks: Task[];
}

export default function LegalRoadmap() {
  const [roadmap, setRoadmap] = useState<Phase[]>([
    {
      id: "incorporation",
      name: "🏢 Company Incorporation",
      tasks: [
        { id: "1", title: "Choose business structure (C-Corp recommended)", status: "pending", priority: "critical" },
        { id: "2", title: "Register Delaware C-Corp", status: "pending", priority: "critical" },
        { id: "3", title: "Get EIN from IRS", status: "pending", priority: "critical" },
        { id: "4", title: "Setup registered agent", status: "pending", priority: "high" },
      ],
    },
    {
      id: "banking",
      name: "🏦 Banking & Finance",
      tasks: [
        { id: "5", title: "Open US business bank account", status: "pending", priority: "high" },
        { id: "6", title: "Setup accounting system", status: "pending", priority: "medium" },
        { id: "7", title: "Get business credit card", status: "pending", priority: "low" },
      ],
    },
    {
      id: "fundraising",
      name: "💰 Fundraising Compliance",
      tasks: [
        { id: "8", title: "File Form D (SEC exemption)", status: "pending", priority: "critical" },
        { id: "9", title: "Prepare investor agreements (SAFE/Convertible)", status: "pending", priority: "critical" },
        { id: "10", title: "Setup cap table", status: "pending", priority: "high" },
      ],
    },
  ]);

  useCopilotReadable({
    description: "User's legal roadmap with current progress",
    value: roadmap,
  });

  useCopilotAction({
    name: "updateRoadmap",
    description: "Update legal roadmap tasks based on user's situation",
    parameters: [
      {
        name: "phaseId",
        type: "string",
        description: "Phase ID to update",
        required: true,
      },
      {
        name: "tasks",
        type: "object[]",
        description: "Array of tasks",
        required: true,
      },
    ],
    handler: async ({ phaseId, tasks }) => {
      setRoadmap((prev) =>
        prev.map((phase) =>
          phase.id === phaseId ? { ...phase, tasks } : phase
        )
      );
    },
  });

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🗺️ Legal Roadmap</CardTitle>
        <CardDescription>
          Step-by-step guidance customized for your situation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {roadmap.map((phase) => (
          <div key={phase.id} className="space-y-3">
            <h3 className="font-semibold text-sm">{phase.name}</h3>
            <div className="space-y-2">
              {phase.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {getStatusIcon(task.status)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{task.title}</p>
                    <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
