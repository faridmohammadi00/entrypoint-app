import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Switch, ActivityIndicator } from 'react-native';
import { colors } from '../../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { profileService } from '../../../services/profile.service';
import Toast from 'react-native-toast-message';

interface TabItem {
  id: string;
  label: string;
}

const tabs: TabItem[] = [
  { id: 'edit', label: 'Edit Profile' },
  { id: 'settings', label: 'Settings' },
  { id: 'security', label: 'Password & Security' },
];

interface ProfileData {
  fullname: string;
  idNumber: string;
  email: string;
  city: string;
  phone: string;
  address: string;
}

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const [notifications, setNotifications] = useState({
    digitalCurrency: true,
    merchantOrder: false,
    recommendations: true,
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullname: '',
    idNumber: '',
    email: '',
    city: '',
    phone: '',
    address: '',
  });

  const renderEditProfile = () => (
    <View style={styles.formContainer}>
      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={require('../../../assets/images/person.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editImageButton}>
          <Icon name="pencil" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.formFields}>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={profileData.fullname}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, fullname: text }))}
              placeholderTextColor="#A0AEC0"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>ID Number</Text>
            <TextInput
              style={styles.input}
              value={profileData.idNumber}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.verifiedInputContainer}>
              <TextInput
                style={styles.verifiedInput}
                value={profileData.email}
                editable={false}
              />
              <Icon name="check-circle" size={20} color={colors.success} />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={profileData.city}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, city: text }))}
              placeholder="Enter city"
              placeholderTextColor="#A0AEC0"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.verifiedInputContainer}>
              <TextInput
                style={styles.verifiedInput}
                value={profileData.phone}
                editable={false}
              />
              <Icon name="check-circle" size={20} color={colors.success} />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={profileData.address}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, address: text }))}
              placeholder="Enter address"
              placeholderTextColor="#A0AEC0"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, isLoading && styles.disabledButton]}
        onPress={handleUpdateProfile}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      {/* Time Zone Section */}
      <View style={styles.settingSection}>
        <Text style={styles.settingTitle}>Time Zone</Text>
        <TouchableOpacity style={styles.timeZoneButton}>
          <Text style={styles.timeZoneText}>(GMT-12:00) International Date Line West</Text>
          <Icon name="chevron-down" size={20} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Notification Section */}
      <View style={styles.settingSection}>
        <Text style={styles.settingTitle}>Notification</Text>
        <View style={styles.notificationList}>
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>I send or receive digita currency</Text>
            <Switch
              value={notifications.digitalCurrency}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, digitalCurrency: value }))}
              trackColor={{ false: '#E2E8F0', true: colors.red }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>I receive merchant order</Text>
            <Switch
              value={notifications.merchantOrder}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, merchantOrder: value }))}
              trackColor={{ false: '#E2E8F0', true: colors.red }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>There are recommendation for my account</Text>
            <Switch
              value={notifications.recommendations}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, recommendations: value }))}
              trackColor={{ false: '#E2E8F0', true: colors.red }}
              thumbColor={colors.white}
            />
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSecurity = () => (
    <View style={styles.securityContainer}>
      {/* Password Change Section */}
      <View style={styles.securitySection}>
        <Text style={styles.settingTitle}>Change Password</Text>
        <View style={styles.passwordFields}>
          <View style={styles.field}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              secureTextEntry
              value={passwordForm.current}
              onChangeText={(text) => setPasswordForm(prev => ({ ...prev, current: text }))}
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              secureTextEntry
              value={passwordForm.new}
              onChangeText={(text) => setPasswordForm(prev => ({ ...prev, new: text }))}
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry
              value={passwordForm.confirm}
              onChangeText={(text) => setPasswordForm(prev => ({ ...prev, confirm: text }))}
              placeholderTextColor="#A0AEC0"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.changePasswordButton, isLoading && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.changePasswordText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 2FA Section */}
      <View style={styles.securitySection}>
        <Text style={styles.settingTitle}>2 Factor Authentication</Text>
        <View style={styles.twoFactorContainer}>
          <Text style={styles.twoFactorText}>Turn on the 2 factor authentication</Text>
          <Switch
            value={twoFactorEnabled}
            onValueChange={setTwoFactorEnabled}
            trackColor={{ false: '#E2E8F0', true: colors.red }}
            thumbColor={colors.white}
          />
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getProfile();
      setProfileData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to fetch profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      await profileService.updateProfile({
        fullname: profileData.fullname,
        city: profileData.city,
        address: profileData.address,
      });
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordForm.new !== passwordForm.confirm) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'New passwords do not match',
        });
        return;
      }

      setIsLoading(true);
      await profileService.changePassword({
        current_password: passwordForm.current,
        new_password: passwordForm.new,
        confirm_password: passwordForm.confirm,
      });

      setPasswordForm({
        current: '',
        new: '',
        confirm: '',
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password changed successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to change password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'edit' && renderEditProfile()}
      {activeTab === 'settings' && renderSettings()}
      {activeTab === 'security' && renderSecurity()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: colors.red,
  },
  tabText: {
    color: colors.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.white,
  },
  formContainer: {
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.red,
    padding: 8,
    borderRadius: 20,
  },
  formFields: {
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 24,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2D3748',
  },
  verifiedInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingRight: 12,
  },
  verifiedInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#2D3748',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  saveButton: {
    backgroundColor: colors.red,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  settingsContainer: {
    flex: 1,
  },
  settingSection: {
    marginBottom: 32,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 16,
  },
  timeZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
  },
  timeZoneText: {
    color: '#2D3748',
    fontSize: 14,
  },
  notificationList: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  notificationText: {
    color: '#2D3748',
    fontSize: 14,
    flex: 1,
    marginRight: 16,
  },
  securityContainer: {
    flex: 1,
  },
  securitySection: {
    marginBottom: 32,
  },
  changePasswordButton: {
    backgroundColor: colors.red,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    width: 200,
  },
  changePasswordText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  twoFactorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  twoFactorText: {
    color: '#2D3748',
    fontSize: 14,
    flex: 1,
    marginRight: 16,
  },
  passwordFields: {
    gap: 16,
    marginBottom: 24,
    height: 224,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
