import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawerContent } from './CustomDrawerContent';
import { Dashboard } from '../screens/Dashboard/Dashboard';
import { Users } from '../screens/Users/Users';
import { Buildings } from '../screens/Buildings/Buildings';
import { VisitsReport } from '../screens/VisitsReport/VisitsReport';
import { Visitors } from '../screens/Visitors/Visitors';
import { Pricing } from '../screens/Settings/Pricing/Pricing';
import { Settings } from '../screens/Settings/Settings/Settings';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserPlans } from '../screens/UserPlans/UserPlans';
import { StyleSheet } from 'react-native';
import { Doormans } from '../screens/Doormans/Doormans';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const DashboardIcon = ({color}: {color: string}) => (
  <Icon name="view-dashboard-outline" size={24} color={color} />
);

const UsersIcon = ({color}: {color: string}) => (
  <Icon name="account-group-outline" size={24} color={color} />
);

type DrawerIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const BuildingsIcon = ({ color }: DrawerIconProps) => (
  <Icon name="office-building-outline" size={24} color={color} />
);

const VisitsReportIcon = ({ color }: DrawerIconProps) => (
  <Icon name="chart-box-outline" size={24} color={color} />
);

const VisitorsIcon = ({ color }: DrawerIconProps) => (
  <Icon name="account-group-outline" size={24} color={color} />
);

const UserPlansIcon = ({ color }: DrawerIconProps) => (
  <Icon name="clipboard-list-outline" size={24} color={color} />
);

const PricingIcon = ({ color }: DrawerIconProps) => (
  <Icon name="cash-multiple" size={24} color={color} />
);

const SettingsIcon = ({ color }: DrawerIconProps) => (
  <Icon name="cog-outline" size={24} color={color} />
);

const DoormanIcon = ({ color }: DrawerIconProps) => (
  <Icon name="door-closed" size={24} color={color} />
);

const renderDrawerContent = (props: any) => {
  'worklet';
  return <CustomDrawerContent {...props} />;
};

export const DrawerNavigator = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { user } = JSON.parse(userData);
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Error getting user role:', error);
      }
    };

    getUserRole();
  }, []);

  const getScreens = () => {
    const commonScreens = [
      {
        name: 'Dashboard',
        component: Dashboard,
        icon: DashboardIcon,
        title: 'Dashboard',
      },
      {
        name: 'VisitsReport',
        component: VisitsReport,
        icon: VisitsReportIcon,
        title: 'Visits Report',
      },
      {
        name: 'Visitors',
        component: Visitors,
        icon: VisitorsIcon,
        title: 'Visitors',
      },
      {
        name: 'Doorman',
        component: Doormans,
        icon: DoormanIcon,
        title: 'Doorman',
      },
      {
        name: 'Buildings',
        component: Buildings,
        icon: BuildingsIcon,
        title: 'Buildings',
      },
      {
        name: 'UserPlans',
        component: UserPlans,
        icon: UserPlansIcon,
        title: 'User Plans',
      },
      {
        name: 'Pricing',
        component: Pricing,
        icon: PricingIcon,
        title: 'Pricing',
      },
      {
        name: 'Settings',
        component: Settings,
        icon: SettingsIcon,
        title: 'Settings',
      },
    ];

    const adminScreens = [
      {
        name: 'Users',
        component: Users,
        icon: UsersIcon,
        title: 'Users',
      },
    ];

    return userRole === 'admin' ? [...commonScreens, ...adminScreens] : commonScreens;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer.Navigator
        drawerContent={renderDrawerContent}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.red,
          },
          headerTintColor: colors.white,
          drawerActiveBackgroundColor: colors.red,
          drawerActiveTintColor: colors.white,
          drawerInactiveTintColor: colors.black,
          drawerStyle: {
            paddingTop: 0,
            width: '80%',
          },
          drawerItemStyle: {
            borderRadius: 10,
            paddingHorizontal: 5,
          },
        }}>
        {getScreens().map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{
              drawerIcon: screen.icon,
              title: screen.title,
            }}
          />
        ))}
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
