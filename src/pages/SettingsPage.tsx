import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Bell,
  Moon,
  Globe,
  Volume2,
  User,
  Shield,
  Download,
  HelpCircle,
  LogOut,
  Save
} from 'lucide-react';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    const settings = {
      notifications,
      darkMode,
      language,
      audioEnabled,
      studyReminders,
      autoSave
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  const handleExportData = () => {
    const data = {
      hiragana: JSON.parse(localStorage.getItem('learnedHiragana') || '[]'),
      katakana: JSON.parse(localStorage.getItem('learnedKatakana') || '[]'),
      stats: JSON.parse(localStorage.getItem('studyStats') || '{}'),
      settings: JSON.parse(localStorage.getItem('appSettings') || '{}')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'japanese-learning-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('learnedHiragana');
      localStorage.removeItem('learnedKatakana');
      localStorage.removeItem('studyStats');
      alert('Progress reset successfully!');
      window.location.reload();
    }
  };

  const settingsSections = [
    {
      title: 'Study Preferences',
      icon: <SettingsIcon className="w-5 h-5" />,
      settings: [
        {
          id: 'audio',
          label: 'Enable Audio',
          description: 'Play pronunciation audio',
          type: 'toggle',
          value: audioEnabled,
          onChange: setAudioEnabled
        },
        {
          id: 'reminders',
          label: 'Study Reminders',
          description: 'Get daily study reminders',
          type: 'toggle',
          value: studyReminders,
          onChange: setStudyReminders
        },
        {
          id: 'language',
          label: 'Display Language',
          description: 'Interface language',
          type: 'select',
          value: language,
          onChange: setLanguage,
          options: [
            { value: 'en', label: 'English' },
            { value: 'ja', label: 'Japanese' },
            { value: 'es', label: 'Spanish' }
          ]
        }
      ]
    },
    {
      title: 'Appearance',
      icon: <Moon className="w-5 h-5" />,
      settings: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        }
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      settings: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive app notifications',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        }
      ]
    },
    {
      title: 'Data Management',
      icon: <Shield className="w-5 h-5" />,
      settings: [
        {
          id: 'autoSave',
          label: 'Auto-save Progress',
          description: 'Automatically save learning progress',
          type: 'toggle',
          value: autoSave,
          onChange: setAutoSave
        }
      ],
      actions: [
        {
          label: 'Export Data',
          icon: <Download className="w-4 h-4" />,
          onClick: handleExportData,
          variant: 'secondary'
        },
        {
          label: 'Reset Progress',
          icon: <HelpCircle className="w-4 h-4" />,
          onClick: handleResetProgress,
          variant: 'danger'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your learning experience</p>
      </div>

      <div className="space-y-8">
        {settingsSections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-gray-600">{section.icon}</div>
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
            </div>

            <div className="space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{setting.label}</p>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  
                  {setting.type === 'toggle' ? (
                    <button
                      onClick={() => setting.onChange(!setting.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        setting.value ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          setting.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : setting.type === 'select' ? (
                    <select
                      value={setting.value}
                      onChange={(e) => setting.onChange(e.target.value)}
                      className="border rounded-lg px-3 py-2"
                    >
                      {setting.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              ))}
            </div>

            {section.actions && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex gap-4">
                  {section.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.onClick}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        action.variant === 'danger'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : action.variant === 'secondary'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
        
        <div className="flex gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </button>
          <button className="px-4 py-2 text-red-600 hover:text-red-800 flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-8 bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">User Profile</h3>
            <p className="text-gray-600">student@example.com</p>
            <p className="text-sm text-gray-500">Member since January 2024</p>
          </div>
          <button className="ml-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Edit Profile
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Japanese Learning App v1.0.0</p>
        <p className="mt-1">© 2024 All rights reserved</p>
      </div>
    </div>
  );
};

export default SettingsPage;