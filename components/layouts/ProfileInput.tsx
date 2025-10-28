"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfileInput() {
  const [profile, setProfile] = useState({
    citizenship: "",
    visaStatus: "",
    businessType: "",
    fundingTarget: "",
    timeline: "",
  });

  // Sync profile to parent via localStorage for cross-component communication
  const updateProfile = (updates: Partial<typeof profile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem('founderProfile', JSON.stringify(newProfile));
    window.dispatchEvent(new Event('profileUpdated'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Your Profile & Context</CardTitle>
        <CardDescription>
          Tell us about your situation so we can provide personalized guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="citizenship">Country of Citizenship</Label>
          <Input
            id="citizenship"
            placeholder="e.g., Vietnam, India, China"
            value={profile.citizenship}
            onChange={(e) => updateProfile({ citizenship: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visaStatus">Current US Visa Status</Label>
          <Select
            value={profile.visaStatus}
            onValueChange={(value) => updateProfile({ visaStatus: value })}
          >
            <SelectTrigger id="visaStatus">
              <SelectValue placeholder="Select visa status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No US Visa</SelectItem>
              <SelectItem value="f1">F-1 (Student)</SelectItem>
              <SelectItem value="h1b">H-1B (Work)</SelectItem>
              <SelectItem value="l1">L-1 (Intracompany Transfer)</SelectItem>
              <SelectItem value="o1">O-1 (Extraordinary Ability)</SelectItem>
              <SelectItem value="e2">E-2 (Investor)</SelectItem>
              <SelectItem value="greencard">Green Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type</Label>
          <Select
            value={profile.businessType}
            onValueChange={(value) => updateProfile({ businessType: value })}
          >
            <SelectTrigger id="businessType">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saas">SaaS / Software</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
              <SelectItem value="biotech">Biotech / Healthcare</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fundingTarget">Funding Target (USD)</Label>
          <Input
            id="fundingTarget"
            type="number"
            placeholder="e.g., 500000"
            value={profile.fundingTarget}
            onChange={(e) => updateProfile({ fundingTarget: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            💡 Determines SEC filing requirements (Reg D, Reg CF, etc.)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Timeline (months)</Label>
          <Input
            id="timeline"
            type="number"
            placeholder="e.g., 6"
            value={profile.timeline}
            onChange={(e) => updateProfile({ timeline: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            💡 Helps prioritize urgent tasks and set milestones
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
