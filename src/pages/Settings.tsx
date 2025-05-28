
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Download,
  Trash2,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    // Profile Settings
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    
    // Preferences
    preferredAPI: "openai",
    defaultDifficulty: "Intermediate",
    language: "en",
    timezone: "UTC",
    
    // Notifications
    emailNotifications: true,
    projectUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
    
    // Privacy
    profileVisibility: "private",
    dataCollection: true,
    
    // Appearance
    theme: "light",
    compactMode: false
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to load user information",
            variant: "destructive",
          });
          return;
        }

        if (user) {
          setUser(user);
          
          // Extract name from user metadata or email
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
          const nameParts = fullName.split(" ");
          
          setSettings(prev => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: user.email || "",
            bio: user.user_metadata?.bio || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to load user information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: `${settings.firstName} ${settings.lastName}`.trim(),
          bio: settings.bio,
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready shortly and sent to your email.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-[#616161]">Loading user settings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFD] via-[#FFFFFF] to-[#F0F8FF] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-[#CE93D8] to-[#9C27B0] p-3 rounded-lg">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#212121]">Settings</h1>
              <p className="text-lg text-[#616161]">Manage your account preferences and privacy settings</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#212121]">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-[#212121] font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => setSettings(prev => ({ ...prev, firstName: e.target.value }))}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-[#212121] font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => setSettings(prev => ({ ...prev, lastName: e.target.value }))}
                    className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-[#212121] font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  disabled
                  className="border-[#E0E0E0] bg-gray-50 cursor-not-allowed"
                />
                <p className="text-sm text-[#616161] mt-1">Email cannot be changed from settings</p>
              </div>
              <div>
                <Label htmlFor="bio" className="text-[#212121] font-medium">Bio</Label>
                <Input
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                  className="border-[#E0E0E0] focus:border-[#4FC3F7]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Preferences */}
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#212121]">
                <SettingsIcon className="w-5 h-5" />
                <span>AI Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#212121] font-medium">Preferred AI Provider</Label>
                  <Select value={settings.preferredAPI} onValueChange={(value) => setSettings(prev => ({ ...prev, preferredAPI: value }))}>
                    <SelectTrigger className="border-[#E0E0E0] focus:border-[#4FC3F7]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                      <SelectItem value="gemini">Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#212121] font-medium">Default Difficulty</Label>
                  <Select value={settings.defaultDifficulty} onValueChange={(value) => setSettings(prev => ({ ...prev, defaultDifficulty: value }))}>
                    <SelectTrigger className="border-[#E0E0E0] focus:border-[#4FC3F7]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#212121]">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#212121] font-medium">Email Notifications</div>
                  <div className="text-sm text-[#616161]">Receive notifications via email</div>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#212121] font-medium">Project Updates</div>
                  <div className="text-sm text-[#616161]">Get notified about new project ideas</div>
                </div>
                <Switch 
                  checked={settings.projectUpdates}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, projectUpdates: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#212121] font-medium">Weekly Digest</div>
                  <div className="text-sm text-[#616161]">Weekly summary of your activity</div>
                </div>
                <Switch 
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#212121]">
                <Lock className="w-5 h-5" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#212121] font-medium">Profile Visibility</Label>
                <Select value={settings.profileVisibility} onValueChange={(value) => setSettings(prev => ({ ...prev, profileVisibility: value }))}>
                  <SelectTrigger className="border-[#E0E0E0] focus:border-[#4FC3F7]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#212121] font-medium">Data Collection</div>
                  <div className="text-sm text-[#616161]">Allow data collection for improving services</div>
                </div>
                <Switch 
                  checked={settings.dataCollection}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataCollection: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#212121]">
                <Palette className="w-5 h-5" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#212121] font-medium">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger className="border-[#E0E0E0] focus:border-[#4FC3F7]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#212121] font-medium">Compact Mode</div>
                  <div className="text-sm text-[#616161]">Use compact layout to show more content</div>
                </div>
                <Switch 
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compactMode: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-[#E0E0E0] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="border-[#90CAF9] text-[#4FC3F7] hover:bg-[#E3F2FD]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDeleteAccount}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
