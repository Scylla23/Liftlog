import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';
import CustomScrollView from '@/components/CustomScrollView';
import { useLanguage } from '@/hooks/useLanguage';
import { fontSize, fontWeight } from '@/constants/typography';
import { useState } from 'react';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { t, changeLanguage, currentLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  /* Languages */
  const languages = [
    { code: 'en', name: t('english') },
    { code: 'es', name: t('spanish') },
  ];

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    setShowLanguageModal(false);
  };

  return (
    <CustomScrollView>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.user_metadata?.avatar_url ? (
            <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          )}
        </View>
        <Text style={styles.userName}>{user?.user_metadata?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>{t('yourStats')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>{t('workouts')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>{t('exercises')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8.5</Text>
            <Text style={styles.statLabel}>{t('hours')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>{t('settings')}</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('personalInformation')}</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('workoutPreferences')}</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('notifications')}</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>{t('privacySecurity')}</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setShowLanguageModal(true)}>
          <Text style={styles.menuItemText}>{t('language')}</Text>
          <View style={styles.languageSelector}>
            <Text style={styles.currentLanguage}>
              {languages.find((lang) => lang.code === currentLanguage)?.name || t('english')}
            </Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutButtonText}>{t('signOut')}</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  currentLanguage === language.code && styles.selectedLanguage,
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    currentLanguage === language.code && styles.selectedLanguageText,
                  ]}
                >
                  {language.name}
                </Text>
                {currentLanguage === language.code && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  statsContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  menuContainer: {
    marginBottom: spacing.xl,
  },
  menuItem: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  menuItemText: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  menuItemArrow: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  logoutContainer: {
    marginTop: spacing.lg,
  },
  logoutButton: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguage: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  selectedLanguage: {
    backgroundColor: colors.primary,
  },
  languageOptionText: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  selectedLanguageText: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  checkmark: {
    fontSize: fontSize.lg,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  cancelButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
});
